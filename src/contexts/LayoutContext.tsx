import { Dispatch, SetStateAction, createContext } from "react";
import Message from "../models/Message";

export interface MessagesContextType {
  messages: Message[];
  setMessages: Dispatch<SetStateAction<Message[]>>;
}

const MessagesContext = createContext<MessagesContextType | null>(null);

export default MessagesContext;
