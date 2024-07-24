import { memo } from "react";
import classes from "./FilePreview.module.css";
import { RiImageEditFill } from "react-icons/ri";
import { MdFileDownload } from "react-icons/md";
import { MdOutlineReply } from "react-icons/md";
import { CircularProgress, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { downloadFile } from "../../utils/file";
import useFileStore from "../../stores/FileStore";
import { createBsonId } from "../../utils/id";

interface FilePreviewProps {
  fileId: string;
}

function FilePreview({ fileId }: FilePreviewProps) {
  const navigate = useNavigate();
  const fileStore = useFileStore();

  const file = fileStore.getFiles([fileId])[0];
  const dataURL = fileStore.getDataURLs([fileId])[0];

  const handleReplyClick = () => {
    if (fileStore.onFormIds.length === 6) {
      alert("Maxiximum files is 6");
      return;
    }
    const newFileId = createBsonId();
    fileStore.setFiles([newFileId], [file]);
    fileStore.setOnFormIds([...fileStore.onFormIds, newFileId]);
  };

  const handleDownloadClick = async () => {
    downloadFile(file);
  };

  const handleEditClick = () => {
    navigate("/edit");
  };

  const renderPreviewImage = () => {
    return dataURL ? (
      <img
        className={classes.image}
        src={dataURL}
        alt={`Preview of ${file.name}`}
      />
    ) : (
      <CircularProgress disableShrink />
    );
  };

  return (
    <div className={classes.main}>
      <div className={classes.label}>
        <IconButton size="small" onClick={handleEditClick}>
          <RiImageEditFill className="size-full" />
        </IconButton>
        <IconButton size="small" onClick={handleDownloadClick}>
          <MdFileDownload className="size-full" />
        </IconButton>
        <IconButton size="small" onClick={handleReplyClick}>
          <MdOutlineReply className="size-full" />
        </IconButton>
      </div>
      {renderPreviewImage()}
    </div>
  );
}

export default memo(FilePreview);
