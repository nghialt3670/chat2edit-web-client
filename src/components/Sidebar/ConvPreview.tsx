import React from "react";
import Conv from "../../models/Conv";
import classes from "./ConvPreview.module.css";
import { useConvsStore, useLayoutStore } from "../../stores";
import moment from "moment";
import { getTimestampInSeconds } from "../../utils/time";

interface ConvPreviewProps {
  idx: number;
  conv: Conv;
}

export default function ConvPreview({ idx, conv }: ConvPreviewProps) {
  const setCurrConv = useConvsStore((state) => state.setCurrConv);
  const toggleSidebar = useLayoutStore((state) => state.toggleSidebar);

  const handleClick = () => {
    setCurrConv(conv, idx);
    toggleSidebar();
  };

  let dateString: string;
  const messages = conv.messages;
  let timestampMiliSecs;
  if (messages.length > 0) {
    const lastMessage = messages[messages.length - 1];
    timestampMiliSecs = lastMessage.timestamp * 1000;
  } else {
    timestampMiliSecs = getTimestampInSeconds() * 1000
  }

  return (
    <div className={classes.main} onClick={handleClick}>
      <div>{moment(timestampMiliSecs).fromNow()}</div>
      <div className={classes.title}>{conv.title}</div>
    </div>
  );
}
