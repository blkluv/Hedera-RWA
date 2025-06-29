import React from "react";

interface ImageUploaderProps {
  files: File[];
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ files }) => {
  if (!files.length) return null;
  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {files.map((file, idx) => {
        const url = URL.createObjectURL(file);
        return (
          <div
            key={idx}
            className="w-32 h-32 border rounded overflow-hidden flex items-center justify-center"
          >
            <img
              src={url}
              alt={file.name}
              className="object-cover w-full h-full"
            />
          </div>
        );
      })}
    </div>
  );
};

export default ImageUploader;
