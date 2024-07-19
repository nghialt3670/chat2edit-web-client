import React, { useEffect, useRef, useState } from "react";
import classes from "./FilePreview.module.css";
import { IconButton } from "@mui/material";
import { TiDelete } from "react-icons/ti";
import {
  getExtension,
  getFilePreviewDataURL,
  readFileToDataURL,
} from "../../utils/file";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

interface FilePreviewProps {
  file: File;
  onRemove: (file: File) => void;
}

export default function FilePreview({ file, onRemove }: FilePreviewProps) {
  const [dataURL, setDataURL] = useState<string | null>();
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const readAndSetDataURL = async () => {
      const dataURL = await getFilePreviewDataURL(file);
      setDataURL(dataURL);
    };
    readAndSetDataURL();
  }, [file]);

  const handleRemoveClick = () => {
    onRemove(file);
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

  const fileExtension = getExtension(file.name);

  return (
    <div className={classes.main}>
      <div className={classes.label} ref={labelRef}>
        <span className={classes.extension}>{fileExtension}</span>
        <div className={classes.remove_button}>
          <IconButton size="small" onClick={handleRemoveClick}>
            <TiDelete />
          </IconButton>
        </div>
      </div>
      <div className={classes.image_container}>{renderPreviewImage()}</div>
    </div>
  );
}
