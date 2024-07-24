import { useEffect } from "react";
import classes from "./FilePreview.module.css";
import { IconButton } from "@mui/material";
import { TiDelete } from "react-icons/ti";
import { getExtension, getFilePreviewDataURL } from "../../utils/file";
import CircularProgress from "@mui/material/CircularProgress";
import useFileStore from "../../stores/FileStore";

interface FilePreviewProps {
  fileId: string;
}

export default function FilePreview({ fileId }: FilePreviewProps) {
  const fileStore = useFileStore();

  useEffect(() => {
    const readAndSetDataURL = async () => {
      const dataURL = fileStore.getDataURLs([fileId])[0];
      if (!dataURL) {
        const file = fileStore.getFiles([fileId])[0];
        const dataURL = await getFilePreviewDataURL(file);
        if (dataURL) {
          fileStore.setDataURLs([fileId], [dataURL]);
        }
      }
    };
    readAndSetDataURL();
  }, [fileId, fileStore.idToDataURL]);

  const file = fileStore.getFiles([fileId])[0];
  const dataURL = fileStore.getDataURLs([fileId])[0];

  const handleRemoveClick = () => {
    fileStore.removeOnFormIds([fileId]);
    fileStore.removeFiles([fileId]);
  };

  const renderPreviewImage = () => {
    return dataURL ? (
      <img className={classes.image} src={dataURL} alt={file.name} />
    ) : (
      <CircularProgress disableShrink />
    );
  };

  const fileExtension = getExtension(file.name);

  return (
    <div className={classes.main}>
      <div className={classes.label}>
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
