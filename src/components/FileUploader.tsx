import React, { useState } from "react";
import ImageUploader from "./ImageUploader";
import FilePreview from "./FilePreview";

interface FileUploaderProps {
  accept?: string;
  allowedExtensions?: string[]; // e.g. ['.png', '.jpg']
  multiple?: boolean;
  onFilesChange?: (files: File[]) => void;
  inputId: string; // unique id for input/label
}

const FileUploader: React.FC<FileUploaderProps> = ({
  accept,
  allowedExtensions,
  multiple = false,
  onFilesChange,
  inputId,
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string>("");

  const validateFiles = (fileArray: File[]) => {
    if (!allowedExtensions || allowedExtensions.length === 0)
      return { valid: true, files: fileArray };
    const validFiles = fileArray.filter((file) =>
      allowedExtensions.some((ext) => file.name.toLowerCase().endsWith(ext))
    );
    if (validFiles.length !== fileArray.length) {
      return {
        valid: false,
        files: validFiles,
        error: `Only files of type: ${allowedExtensions.join(
          ", "
        )} are allowed.`,
      };
    }
    return { valid: true, files: validFiles };
  };

  const handleFiles = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;
    let fileArray = Array.from(selectedFiles);
    if (!multiple) fileArray = fileArray.slice(0, 1);
    const validation = validateFiles(fileArray);
    if (!validation.valid) {
      setError(validation.error || "Invalid file type.");
    } else {
      setError("");
    }
    setFiles(validation.files);
    onFilesChange?.(validation.files);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const handleRemove = (idx: number) => {
    const newFiles = files.filter((_, i) => i !== idx);
    setFiles(newFiles);
    onFilesChange?.(newFiles);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="border-2 border-dashed rounded p-4 text-center cursor-pointer"
    >
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        className="hidden"
        id={inputId}
      />
      <label htmlFor={inputId} className="block cursor-pointer">
        Click or drag files here to upload
      </label>
      <div className="mt-4">
        {accept?.includes("image") ? (
          <ImageUploader files={files} />
        ) : (
          <FilePreview files={files} />
        )}
        {files.length > 0 && (
          <ul className="mt-2 flex flex-wrap gap-2 justify-center">
            {files.map((file, idx) => (
              <li key={idx} className="flex items-center gap-2 text-xs">
                <span>{file.name}</span>
                <button
                  type="button"
                  className="text-red-500 hover:underline"
                  onClick={() => handleRemove(idx)}
                  aria-label={`Remove ${file.name}`}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
        {error && <div className="text-red-500 text-xs mt-2">{error}</div>}
      </div>
    </div>
  );
};

export default FileUploader;
