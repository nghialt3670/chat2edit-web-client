import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import classes from "./ChatBox.module.css";
import MessageForm from "../MessageForm";
import Message from "../Message";
import IMessage from "../../models/Message";
import { requestChat } from "../../api";
import { v4 } from "uuid";
import { useAuth } from "@clerk/clerk-react";
import { useConvsStore } from "../../stores";
import { requestMessages } from "../../api/requestMessages";
import Conv from "../../models/Conv";
import { createBsonId } from "../../utils/id";
import { CircularProgress } from "@mui/material";

const RESPONDING_MESSAGE_DELAY_MS = 500;
const RESPONDING_MESSAGE: IMessage = {
  id: v4(),
  type: "Response",
  text: "",
  files: [],
  timestamp: 0,
};

export default function ChatBox() {
  const { getToken } = useAuth();
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [replyFiles, setReplyFiles] = useState<File[]>([]);
  const messagesContainer = useRef<HTMLDivElement>(null);
  const messagesLength = useRef<number>(0);
  const { currConv, addMessage, createNewConv } = useConvsStore((state) => ({
    currConv: state.currConv,
    addMessage: state.addMessage,
    createNewConv: state.createNewConv,
  }));

  useEffect(() => {
    if (messagesContainer.current)
      messagesContainer.current.scrollTop =
        messagesContainer.current.scrollHeight;

    const updateMessages = async () => {
      const token = await getToken();
      if (token && currConv.title && currConv.messages.length === 0) {
        const messages = await requestMessages(currConv.id, token);
        messages.forEach((message) => addMessage(message));
      }
    };
    
    updateMessages();
  }, [currConv]);
  
  const handleFileReply = useCallback((file: File): void => {
    setReplyFiles([...replyFiles, file]);
  }, []);

  const handleSendMessage = async (message: IMessage): Promise<void> => {
    addMessage(message);
    messagesLength.current += 1;
    setReplyFiles([]);
    setTimeout(
      () => setIsFetching(messagesLength.current % 2 !== 0),
      RESPONDING_MESSAGE_DELAY_MS,
    );
    try {
      const token = await getToken();
      if (!token) throw Error("token null");
      const resMessage = await requestChat(currConv.id, token, message);
      addMessage(resMessage);
      messagesLength.current += 1;
      setIsFetching(false);
    } catch (error) {
      alert("erorrrrrrrrrrr");
    }
  };

  const renderMessages = (): ReactNode[] | ReactNode => {
    if (currConv.messages.length === 0) return <CircularProgress color="info" disableShrink />

    return currConv.messages.map((message) => (
      <Message
        key={message.id}
        message={message}
        onFileReply={handleFileReply}
      />
    ));
  };

  const renderReplyingMessage = (): ReactNode | undefined => {
    if (!isFetching) return undefined;
    return (
      <Message message={RESPONDING_MESSAGE} onFileReply={handleFileReply} />
    );
  };

  return (
    <div className={classes.main}>
      <div className={classes.messages_container} ref={messagesContainer}>
        {renderMessages()}
        {renderReplyingMessage()}
      </div>
      <MessageForm replyFiles={replyFiles} onSendMessage={handleSendMessage} />
    </div>
  );
}
