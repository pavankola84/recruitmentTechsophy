import React from "react";
import { FileUploader } from "react-drag-drop-files";

function FileUpload({ setFile, fileTypes }: any) {
  const handleChange = (file: File) => {
    setFile(file);
  };
  return (
    <FileUploader handleChange={handleChange} name="file" types={fileTypes} />
  );
}

export default FileUpload;
