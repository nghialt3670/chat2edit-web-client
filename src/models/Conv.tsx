import Message from "./Message";

export default interface Conv {
  id: string;
  title: string | null;
  messages: Message[];
}
