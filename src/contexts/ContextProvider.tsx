import React, { Dispatch, ReactNode, SetStateAction } from "react";
import MessagesContext from "./MessagesContext";
import Message from "../models/Message";

interface ContextProviderProps {
  messages: Message[];
  setMessages: Dispatch<SetStateAction<Message[]>>;
  children: ReactNode;
}

export default function ContextProvider({
  messages,
  setMessages,
  children,
}: ContextProviderProps) {
  return (
    <MessagesContext.Provider value={{ messages, setMessages }}>
      {children}
    </MessagesContext.Provider>
  );
}
