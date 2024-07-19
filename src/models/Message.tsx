export default interface Message {
  id: string;
  type: "Request" | "Response";
  text: string;
  files: File[];
  timestamp: number;
}
