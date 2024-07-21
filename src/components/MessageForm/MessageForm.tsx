import React, { ReactNode, useEffect, useRef, useState } from "react";
import classes from "./MessageForm.module.css";
import { IconButton } from "@mui/material";
import { MdAddPhotoAlternate } from "react-icons/md";
import { BiSolidSend } from "react-icons/bi";
import Message from "../../models/Message";
import { v4 } from "uuid";
import { createTheme } from "@mui/material";
import { convertFile, copyFile, readFileToDataURL } from "../../utils/file";
import FilePreview from "./FilePreview";
import { getTimestampInSeconds } from "../../utils/time";

const MIN_UPLOADING_TIME_MS = 500;
const MAX_NUM_FILES = 6;

interface MessageFormProps {
  replyFiles: File[];
  onSendMessage: (message: Message) => void;
}

enum UploadState {
  NoUpload = "NoUpload",
  Uploading = "Uploading",
  Uploaded = "Uploaded",
}

export default function MessageForm({
  replyFiles,
  onSendMessage,
}: MessageFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [text, setText] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    if (replyFiles.length === 0) return;
    const copyAndSetReplyFiles = async () => {
      const newFiles = await Promise.all(
        replyFiles.map(async (file) => await copyFile(file)),
      );
      setFiles([...files, ...newFiles]);
    };
    copyAndSetReplyFiles();
  }, [replyFiles]);

  const handleFileInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      if (files.length > MAX_NUM_FILES) {
        alert(`Maximum file upload per request is ${MAX_NUM_FILES}`);
        return;
      }
      setFiles(files);
      event.target.value = "";
      textInputRef.current?.focus();
    }
  };

  const handleTextInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setText(event.target.value);
  };

  const handleUploadClick = (): void => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = (removedFile: File): void => {
    setFiles(files.filter((file) => file.name !== removedFile.name));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const convertedFiles = await Promise.all(files.map(async file => await convertFile(file)))
    console.log(convertedFiles)
    const message: Message = {
      id: v4(),
      type: "Request",
      text: text,
      files: convertedFiles,
      timestamp: getTimestampInSeconds(),
    };
    onSendMessage(message);
    setText("");
    setFiles([]);
  };

  const renderFilePreviews = (): ReactNode | undefined => {
    if (files.length === 0) return undefined;
    return (
      <div className={classes.container}>
        {files.map((file) => (
          <FilePreview
            key={file.name}
            file={file}
            onRemove={handleRemoveFile}
          />
        ))}
      </div>
    );
  };

  if (formRef.current) {
    if (files.length === 0)
      formRef.current.style.borderRadius = formRef.current.style.borderRadius;
    else {
      formRef.current.style.borderTopLeftRadius = "0px";
      formRef.current.style.borderTopRightRadius = "0px";
    }
  }

  return (
    <form className={classes.main} ref={formRef} onSubmit={handleSubmit}>
      {renderFilePreviews()}
      <input
        className={classes.file_input}
        type="file"
        multiple
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileInputChange}
      />
      <IconButton size="large" onClick={handleUploadClick}>
        <MdAddPhotoAlternate />
      </IconButton>
      <input
        className={classes.text_input}
        type="text"
        spellCheck="false"
        required
        ref={textInputRef}
        value={text}
        onChange={handleTextInputChange}
      />
      <IconButton size="large" type="submit" disabled={text.trim() === ""}>
        <BiSolidSend />
      </IconButton>
      <input type="submit" hidden />
    </form>
  );
}
