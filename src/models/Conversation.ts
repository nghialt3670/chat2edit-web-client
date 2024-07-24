import Message from "./Message";

export default interface Conversation {
  id: string;
  title: string | null;
  messages: Message[];
  lastSentTimestamp?: number;
}
