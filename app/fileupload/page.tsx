"use client"

import { useState, ChangeEvent, DragEvent } from "react";

const callTransformImageAPI = async (file: File, prompt: string) => {
  const formData = new FormData();
  formData.append('file', file);
  // formData.append('prompt', prompt); // If using prompts

  const response = await fetch('/api/transformimage', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Unknown error occurred');
  }

  const result = await response.json();
  return result;
};

export default function FileUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTransformed, setIsTransformed] = useState(false);
  const [transformedData, setTransformedData] = useState<any>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('File selected:', file);
      setSelectedFile(file);
      startImageTransformation(file);
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);

    const file = event.dataTransfer.files?.[0];
    if (file) {
      console.log('File dropped:', file);
      setSelectedFile(file);
      startImageTransformation(file);
    }
  };

  const startImageTransformation = async (file: File) => {
    setIsLoading(true);
    const prompt = `
      Hello,

I would like to transform an image into a pixelated mosaic that I can recreate using small square-shaped plastic parts, similar to a mosaic. Here are the specifics:

Image Transformation:

Please pixelate the image I provide so it uses only 5 different colors.
Initially, use colors like blue, red, black, yellow, white, green, and brown.
If possible, recommend a palette of 10 colors that would make the mosaic resemble the original image more closely.
Image Size and Clarity:

Ensure the pixelated image is clear, with pixels that are appropriately sized—not too large or too small.
If the initial pixels are too large, please reduce their size (e.g., make them three times smaller) to increase the image's clarity.
Output Requirements:

Generate a pixelated version of the image with a mesh overlay for each color.
Provide a summary of how many plastic parts (pixels) I will need for each color to recreate the mosaic.
If the colors used don't produce a satisfactory resemblance to the original image, please suggest alternative colors.
Please process the image accordingly and provide the transformed image along with the color summary.
    `
    try {
      const result = await callTransformImageAPI(file, prompt);
      setTransformedData(result);
      setIsTransformed(true);
    } catch (error) {
      console.error('Error transforming image:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isTransformed && transformedData) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh_-_4rem)] px-4 md:px-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">
          Vaša Transformisana Slika
        </h1>
        <img
          src={transformedData.transformedImage}
          alt="Transformisana"
          className="w-full max-w-xs md:max-w-md object-cover mb-6"
        />
        <div className="text-center mb-6">
          <h2 className="text-lg font-bold">Potrebne Boje za Mozaik:</h2>
          {transformedData.colorSummary && Object.entries(transformedData.colorSummary).length > 0 ? (
            Object.entries(transformedData.colorSummary).map(([color, count]) => (
              <p key={color}>{`${color}: ${count} komada`}</p>
            ))
          ) : (
            <p>Nema podataka o bojama za prikaz.</p>
          )}
        </div>
        <button className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700">
          Kupi Ovaj Mozaik
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh_-_4rem)] px-4 md:px-8">
      <h1 className="text-3xl font-bold mb-4 text-center">Otpremite Svoju Sliku</h1>

      {isLoading ? (
        <div className="flex items-center justify-center space-x-2">
          <div className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
          <span>Transformisanje Slike...</span>
        </div>
      ) : (
        <div
          className={`border-4 border-dashed rounded-md p-8 text-center max-w-xs md:max-w-lg w-full ${
            dragActive ? "border-blue-500" : "border-gray-300"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <p className="mb-2">
            {selectedFile
              ? `Izabrana datoteka: ${selectedFile.name}`
              : "Prevucite i ispustite sliku ovde ili kliknite da otpremite"}
          </p>
          <input
            type="file"
            className="hidden"
            id="fileUpload"
            onChange={handleFileChange}
          />
          <label
            htmlFor="fileUpload"
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 cursor-pointer"
          >
            {selectedFile ? "Promeni Sliku" : "Otpremi Sliku"}
          </label>
        </div>
      )}
    </div>
  );
}
