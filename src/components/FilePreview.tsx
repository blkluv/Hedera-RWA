import React from "react";

interface FilePreviewProps {
  files: File[];
}

const FilePreview: React.FC<FilePreviewProps> = ({ files }) => {
  if (!files.length) return null;
  return (
    <ul className="text-left mt-2">
      {files.map((file, idx) => (
        <li key={idx} className="truncate">
          <span className="font-medium">{file.name}</span> (
          {(file.size / 1024).toFixed(2)} KB)
        </li>
      ))}
    </ul>
  );
};

export default FilePreview;
