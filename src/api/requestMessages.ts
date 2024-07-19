import { v4 } from "uuid";
import endpoints from "../config";
import Message from "../models/Message";
import { requestFiles } from "./requestFiles";

interface MessageResponse {
  text: string;
  file_ids: string[];
  timestamp: number;
}

export async function requestMessages(
  convId: string,
  token: string,
): Promise<Message[]> {
  const response = await fetch(`${endpoints.convs}/${convId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) throw new Error();

  const data = await response.json();
  const messageResponses = data["messages"] as MessageResponse[];

  return await Promise.all(
    messageResponses.map(async (res, idx) => ({
      id: v4(),
      type: idx % 2 === 0 ? "Request" : "Response",
      text: res.text,
      files: await requestFiles(res.file_ids),
      timestamp: res.timestamp,
    })),
  );
}
