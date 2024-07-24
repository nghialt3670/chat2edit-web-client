import { endpoints } from "../config";

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
