import React, { ReactNode, useEffect, useRef, useState } from "react";
import classes from "./MessageForm.module.css";
import { IconButton } from "@mui/material";
import { MdAddPhotoAlternate } from "react-icons/md";
import { BiSolidSend } from "react-icons/bi";
import FilePreview from "./FilePreview";
import useFileStore from "../../stores/FileStore";
import { createBsonId } from "../../utils/id";
import Message from "../../models/Message";
import { getTimestampInSeconds } from "../../utils/time";
import { useConvStore } from "../../stores";

const MAX_NUM_FILES = 6;

export default function MessageForm() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [text, setText] = useState<string>("");
  const fileStore = useFileStore();
  const convStore = useConvStore();

  const handleFileInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);

      if (newFiles.length > MAX_NUM_FILES) {
        alert(`Maximum file upload per request is ${MAX_NUM_FILES}`);
        return;
      }
      const newFileIds = Array.from({ length: newFiles.length }, () =>
        createBsonId(),
      );
      fileStore.setFiles(newFileIds, newFiles);
      fileStore.setOnFormIds(newFileIds);
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

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    const message: Message = {
      id: createBsonId(),
      type: "Request",
      text: text,
      fileIds: fileStore.onFormIds,
      timestamp: getTimestampInSeconds(),
    };
    convStore.addMessage(message);
    fileStore.setOnFormIds([]);
    setText("");
  };

  const renderFilePreviews = (): ReactNode | undefined => {
    if (fileStore.onFormIds.length === 0) return undefined;
    return (
      <div className={classes.container}>
        {fileStore.onFormIds.map((fileId) => (
          <FilePreview key={fileId} fileId={fileId} />
        ))}
      </div>
    );
  };

  if (formRef.current) {
    if (fileStore.onFormIds.length === 0)
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
