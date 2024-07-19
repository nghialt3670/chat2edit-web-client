import endpoints from "../config";

interface ConvResponse {
  id: string;
  title: string;
}

interface SettingsResponse {
  theme: "dark" | "light";
}

interface UserResponse {
  settings: SettingsResponse;
  convs: ConvResponse[];
}

export async function requestUser(token: string): Promise<UserResponse> {
  const response = await fetch(`${endpoints.users}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) throw new Error();

  return (await response.json()) as UserResponse;
}
