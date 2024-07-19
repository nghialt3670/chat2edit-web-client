import React, { memo, useContext, useEffect, useState } from "react";
import classes from "./FilePreview.module.css";
import { RiImageEditFill } from "react-icons/ri";
import { MdFileDownload } from "react-icons/md";
import { MdOutlineReply } from "react-icons/md";
import { CircularProgress, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { downloadFile, getFilePreviewDataURL } from "../../utils/file";

interface FilePreviewProps {
  file: File;
  onReply: (file: File) => void;
}

function FilePreview({ file, onReply }: FilePreviewProps) {
  const [dataURL, setDataURL] = useState<string | null>();
  const navigate = useNavigate();

  useEffect(() => {
    const readAndSetDataURL = async () => {
      const dataURL = await getFilePreviewDataURL(file);
      setDataURL(dataURL);
    };
    readAndSetDataURL();
  }, [file]);

  const handleReplyClick = () => {
    onReply(file);
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
