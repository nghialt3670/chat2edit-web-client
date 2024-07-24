import { useEffect, useRef } from "react";
import { useConvStore } from "../../stores";
import Message from "./Message";
import classes from "./MessageList.module.css";
import { createBsonId } from "../../utils/id";
import { getConv } from "../../api";
import { useAuth } from "@clerk/clerk-react";

export default function MessageList() {
  const mainRef = useRef<HTMLDivElement>(null);
  const convStore = useConvStore();
  const { getToken } = useAuth();

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = mainRef.current.scrollHeight;
    }
    const updateConv = async () => {
      try {
        const jwt = await getToken();
        if (!jwt) throw new Error("Can not get JWT");

        const convResponse = await getConv(convStore.currConv.id, jwt);
        if (!convResponse) throw new Error("Can not load conversation");

        convResponse.messages.forEach((message, idx) => {
          if (idx === convResponse.messages.length - 1)
            convStore.updateCurrTitle(message.text)

          convStore.addMessage({
            id: createBsonId(),
            type: idx % 2 === 0 ? "Request" : "Response",
            text: message.text,
            fileIds: message.fileIds,
            timestamp: message.timestamp,
          });
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

    if (
      convStore.currConv.title &&
      convStore.currConv.title !== "New Conversation" &&
      convStore.currConv.messages.length === 0
    )
      updateConv();
  }, [convStore.currConv]);

  const currConv = convStore.currConv;
  const lastMessage = currConv.messages[currConv.messages.length - 1];

  return (
    <div className={classes.main} ref={mainRef}>
      {currConv.messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
      {lastMessage && lastMessage.type === "Request" && <Message />}
    </div>
  );
}
