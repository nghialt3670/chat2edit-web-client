import { v4 } from "uuid";
import endpoints from "../config";
import Message from "../models/Message";
import { getFiles } from "./getFiles";

interface MessageResponse {
  text: string;
  fileIds: string[];
  timestamp: number;
}

interface ConvResponse {
  messages: MessageResponse[];
}

export async function getConv(
  convId: string,
  jwt: string,
): Promise<ConvResponse> {
  const response = await fetch(`${endpoints.convs}/${convId}`, {
    headers: { Authorization: `Bearer ${jwt}` },
  });

  if (!response.ok) throw new Error();

  return await response.json();
}
