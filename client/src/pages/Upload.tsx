import { useState } from "react";
import { ChangeEvent } from "react";
function Upload() {
  const [image, setImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [outlineStyle, setOutlineStyle] = useState<string>("pencil");
  // Handle image upload and preview
  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImage(URL.createObjectURL(selectedFile));
    }
  };

  // Clear the image
  const handleClear = () => {
    setImage(null);
    setFile(null);
  };

  console.log(image);

  return (
    <div className="max-w-4xl mx-auto p-5 font-sans">
      <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
        Outline Draw of a Person
      </h1>
      <p className="text-gray-600 mb-6 text-center">
        Upload an image to get started!
      </p>

      {/* File input */}
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="block mx-auto mb-6 p-2 text-sm text-gray-700 border border-gray-300 rounded-md cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />

      {/* Flex container for preview and controls */}
      {image && (
        <div className="flex flex-row gap-6">
          <div className="flex-1 border-1 border-gray-300 px-28 rounded-2xl">
            <img
              src={image}
              alt="Uploaded preview"
              className="max-w-full h-auto shadow-sm"
            />
          </div>

          {/* Right: Buttons and Settings */}
          <div className="flex-1 flex flex-col justify-start gap-4">
            {/* Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => handleClear()}
                className="px-6 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition-colors"
              >
                Clear Image
              </button>
            </div>

            {/* Settings */}
            <div className="mt-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Outline Style
              </label>
              <select
                value={outlineStyle}
                onChange={(e) => setOutlineStyle(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="pencil">Pencil</option>
                <option value="ink">Ink</option>
                <option value="chalk">Chalk</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Upload;
