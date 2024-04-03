import {
  FaFile,
  FaFileExcel,
  FaFileImage,
  FaFilePdf,
  FaFilePowerpoint,
  FaFileWord,
} from "react-icons/fa6";
import { FaFileArchive } from "react-icons/fa";

export const getFileIcon = (fileExtension: string) => {
  switch (fileExtension) {
    case "pdf":
      return <FaFilePdf size={16} color="F40F02" />;
    case "doc":
    case "docx":
      return <FaFileWord size={16} color="2b579a" />;
    case "xls":
    case "xlsx":
      return <FaFileExcel size={16} color="217346" />;
    case "ppt":
    case "pptx":
      return <FaFilePowerpoint size={16} color="d24726" />;
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
      return <FaFileImage size={16} color="48c96f" />;
    case "zip":
    case "rar":
      return <FaFileArchive size={16} color="4D4A4F" />;
    default:
      return <FaFile size={16} />;
  }
};