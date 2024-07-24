import { endpoints } from "../config";

interface UpdateResponse {
  convId: string;
  fileIds: string[];
}

interface MessageResponse {
  text: string;
  fileIds: string[];
  timestamp: number;
}

interface ChatResponse {
  status: "success" | "error";
  update: UpdateResponse;
  message?: MessageResponse;
}

export async function postChat(
  convId: string,
  text: string,
  files: File[],
  timestamp: number,
  jwt: string,
): Promise<ChatResponse | null> {
  const formData = new FormData();
  formData.append("text", text);
  formData.append("timestamp", timestamp.toString());
  files.forEach((file) => formData.append(`files`, file));

  const response = await fetch(`${endpoints.chat}/${convId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${jwt}`,
      ContentType: "application/json",
    },
    body: formData,
  });

  if (!response.ok) return null;

  return await response.json();
}
