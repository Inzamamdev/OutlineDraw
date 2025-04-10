import tf from "@tensorflow/tfjs-node";
import * as bodyPix from "@tensorflow-models/body-pix";
import sharp from "sharp";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { Readable } from "stream";

const processImage = async (req, res) => {
  const imagePath = req.file.path;

  try {
    // Upload original image to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(imagePath, {
      folder: "outline-draw/uploads",
    });
    const originalUrl = uploadResult.secure_url;

    // Load and decode the image
    const imageBuffer = fs.readFileSync(imagePath);
    const imageTensor = tf.node.decodeImage(imageBuffer);

    // Segment person with BodyPix
    const net = await bodyPix.load();
    const segmentation = await net.segmentPerson(imageTensor, {
      internalResolution: "medium",
      segmentationThreshold: 0.7,
    });

    // Create mask buffer
    const maskData = new Uint8Array(
      segmentation.width * segmentation.height * 4
    );
    for (let i = 0; i < segmentation.data.length; i++) {
      const offset = i * 4;
      maskData[offset] = segmentation.data[i] ? 255 : 0; // R
      maskData[offset + 1] = segmentation.data[i] ? 255 : 0; // G
      maskData[offset + 2] = segmentation.data[i] ? 255 : 0; // B
      maskData[offset + 3] = 255; // A
    }

    // Generate outline with Sharp
    const maskBuffer = Buffer.from(maskData);
    const outlineBuffer = await sharp(maskBuffer, {
      raw: {
        width: segmentation.width,
        height: segmentation.height,
        channels: 4,
      },
    })
      .resize(imageTensor.shape[1], imageTensor.shape[0])
      .blur(1)
      .threshold(128)
      .negate()
      .toColourspace("b-w")
      .toBuffer();

    // Upload outline to Cloudinary
    const outlineStream = Readable.from(outlineBuffer);
    const outlineUploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "outline-draw/outlines" },
        (error, result) => (error ? reject(error) : resolve(result))
      );
      outlineStream.pipe(uploadStream);
    });

    // Composite original image with outline in Cloudinary
    const processedUrl = cloudinary.url(outlineUploadResult.public_id, {
      transformation: [{ overlay: { url: originalUrl }, effect: "overlay" }],
    });

    // Clean up
    tf.dispose(imageTensor);
    fs.unlinkSync(imagePath);

    // Send processed URL to client
    res.json({ url: processedUrl });
  } catch (error) {
    console.error("Error processing image:", error);
    res.status(500).send("Processing failed");
    if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
  }
};

export { processImage };
