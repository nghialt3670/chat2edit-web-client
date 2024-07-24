import { memo, ReactNode, useEffect } from "react";
import classes from "./Message.module.css";
import IMessage from "../../models/Message";
import { useAuth } from "@clerk/clerk-react";
import FilePreview from "./FilePreview";
import { FaUserCircle } from "react-icons/fa";
import Logo from "../../logo.svg";
import { Skeleton } from "@mui/material";
import { useUserStore } from "../../stores";
import { getFiles } from "../../api";
import useFileStore from "../../stores/FileStore";
import { getFilePreviewDataURL } from "../../utils/file";

export interface MessageProps {
  message?: IMessage;
}

function Message({ message }: MessageProps) {
  const avatarDataURL = useUserStore((state) => state.avatarDataURL);
  const fileStore = useFileStore();
  const { isSignedIn, getToken } = useAuth();

  useEffect(() => {
    const updateFiles = async () => {
      if (!message) return;
      try {
        const jwt = await getToken();
        if (!jwt) throw new Error("Can not get JWT");

        const files = await getFiles(message?.fileIds, jwt);
        const dataURLs = await Promise.all(
          files.map(async (file) => await getFilePreviewDataURL(file)),
        );
        fileStore.setFiles(message.fileIds, files);
        fileStore.setDataURLs(message.fileIds, dataURLs as string[]);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("An error occurred:", error.message);
          alert("An unexpected error occurred. Please try again.");
        } else {
          console.error("An unexpected error occurred:", error);
          alert("An unexpected error occurred. Please try again.");
        }
      }
    };

    if (
      message &&
      message.fileIds &&
      !(message.fileIds[0] in fileStore.idToFile)
    ) {
      updateFiles();
    }
  }, []);

  const renderAvatar = (): ReactNode => {
    if (message && message.type === "Request") {
      return isSignedIn ? (
        <img className={classes.avatar} src={avatarDataURL as string} />
      ) : (
        <div className={classes.avatar}>
          <FaUserCircle size={25} />
        </div>
      );
    } else {
      return <img className={classes.avatar} src={Logo} />;
    }
  };

  const renderText = () => {
    if (!message) return undefined;
    if (message.text === "") return undefined;
    return (
      <div className={classes.text_container}>
        <div className={classes.text}>{message.text}</div>
      </div>
    );
  };

  const renderFiles = () => {
    if (!message) return undefined;
    if (message.fileIds.length === 0) return undefined;
    return (
      <div className={classes.file_preview_container}>
        {message.fileIds.map((fileId) => (
          <FilePreview key={fileId} fileId={fileId} />
        ))}
      </div>
    );
  };

  const renderContent = () => {
    if (!message)
      return (
        <>
          <Skeleton animation="wave" />
          <Skeleton animation="wave" />
          <Skeleton animation="wave" />
        </>
      );

    return (
      <>
        {renderText()}
        {renderFiles()}
      </>
    );
  };

  return (
    <div className={classes.main}>
      {renderAvatar()}
      <div className={classes.content}>{renderContent()}</div>
    </div>
  );
}

export default memo(Message);
