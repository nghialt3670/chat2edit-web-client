import React, { memo, ReactNode } from "react";
import classes from "./Message.module.css";
import IMessage from "../../models/Message";
import { useAuth, useUser } from "@clerk/clerk-react";
import FilePreview from "./FilePreview";
import { FaUserCircle } from "react-icons/fa";
import Logo from "../../logo.svg";
import { Skeleton } from "@mui/material";
import { useUserStore } from "../../stores";

export interface MessageProps {
  message: IMessage;
  onFileReply: (file: File) => void;
}

function Message({ message, onFileReply }: MessageProps) {
  const { isSignedIn } = useAuth();
  const avatarDataURL = useUserStore((state) => state.avatarDataURL);

  const renderAvatar = (): ReactNode => {
    if (message.type === "Request") {
      return isSignedIn ? (
        <img className={classes.avatar} src={avatarDataURL as string} />
      ) : (
        <FaUserCircle size={25} />
      );
    } else {
      return <img className={classes.avatar} src={Logo} />;
    }
  };

  const renderText = () => {
    if (message.text === "") return undefined;
    return (
      <div className={classes.text_container}>
        <div className={classes.text}>{message.text}</div>
      </div>
    );
  };

  const renderFiles = () => {
    if (message.files.length === 0) return undefined;
    return (
      <div className={classes.attachments_container}>
        {message.files.map((file) => (
          <FilePreview key={file.name} file={file} onReply={onFileReply} />
        ))}
      </div>
    );
  };

  const renderReplying = () => {
    return (
      <>
        <Skeleton animation="wave" />
        <Skeleton animation="wave" />
        <Skeleton animation="wave" />
      </>
    );
  };

  const isResponding = message.text === "";

  return (
    <div className={classes.main}>
      {renderAvatar()}
      <div className={classes.content}>
        {isResponding ? (
          renderReplying()
        ) : (
          <>
            {renderText()}
            {renderFiles()}
          </>
        )}
      </div>
    </div>
  );
}

export default memo(Message);
