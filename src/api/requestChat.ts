import endpoints from "../config";
import Message from "../models/Message";
import { requestFiles } from "./requestFiles";
import { v4 } from "uuid";

export async function requestChat(
  convId: string,
  token: string,
  message: Message,
): Promise<Message> {
  const formData = new FormData();
  formData.append("text", message.text);
  message.files.forEach((file) => {
    formData.append(`files`, file);
  });

  const response = await fetch(`${endpoints.chat}/${convId}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!response.ok) {
    throw new Error();
  }

  const data = await response.json();
  const fileIds = data["file_ids"] as string[];

  return {
    id: v4(),
    type: "Response",
    text: data.text,
    files: await requestFiles(fileIds),
    timestamp: data.timestamp,
  };
}
