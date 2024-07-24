import classes from "./Home.module.css";
import MessageList from "../../components/MessageList";
import MessageForm from "../../components/MessageForm";
import { useEffect } from "react";
import { useConvStore } from "../../stores";
import Sidebar from "../../components/Sidebar";
import AppBar from "../../components/AppBar";
import useFileStore from "../../stores/FileStore";
import { convertFile } from "../../utils/file";
import { useAuth } from "@clerk/clerk-react";
import { postChat } from "../../api";
import Message from "../../models/Message";
import { createBsonId } from "../../utils/id";
import { getTimestampInSeconds } from "../../utils/time";

const errorMessage: Message = {
  id: createBsonId(),
  type: "Response",
  text: "Failed to process your message. Please try again later.",
  fileIds: [],
  timestamp: getTimestampInSeconds(),
};

export default function Home() {
  const convStore = useConvStore();
  const fileStore = useFileStore();
  const { getToken } = useAuth();

  useEffect(() => {
    const sendMessage = async () => {
      try {
        const jwt = await getToken();
        if (!jwt) throw new Error("Authentication token not found.");

        const currConv = convStore.currConv;
        const lastMessage = currConv.messages[currConv.messages.length - 1];
        const files = fileStore.getFiles(lastMessage.fileIds);
        const convertedFiles = await Promise.all(
          files.map(async (file) => await convertFile(file)),
        );

        const chatResponse = await postChat(
          currConv.id,
          lastMessage.text,
          convertedFiles,
          lastMessage.timestamp,
          jwt,
        );

        if (!chatResponse || chatResponse.status === "error") {
          convStore.addMessage(errorMessage);
          return;
        }

        const update = chatResponse.update;
        convStore.updateCurrId(update.convId);
        fileStore.updateIds(lastMessage.fileIds, update.fileIds);

        convStore.addMessage({
          id: createBsonId(),
          type: "Response",
          text: chatResponse.message?.text as string,
          fileIds: chatResponse.message?.fileIds as string[],
          timestamp: chatResponse.message?.timestamp as number,
        });
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

    if (convStore.currConv.messages.length % 2 !== 0) sendMessage();
  }, [convStore.currConv]);

  return (
    <div className={classes.main}>
      <AppBar />
      <div className={classes.body}>
        <Sidebar />
        <div className={classes.chat_area}>
          <MessageList />
          <MessageForm />
        </div>
      </div>
    </div>
  );
}
