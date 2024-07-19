import endpoints from "../config";
import { getFilenameFromContentDisposition } from "../utils/file";

export async function requestFiles(fileIds: string[]): Promise<File[]> {
  return await Promise.all(
    fileIds.map(async (id) => {
      const response = await fetch(`${endpoints.files}/${id}`);

      if (!response.ok) throw new Error();

      const blob = await response.blob();
      const contentDisposition = response.headers.get("Content-Disposition");

      if (!contentDisposition) throw new Error();
      const filename = getFilenameFromContentDisposition(contentDisposition);
      if (!filename) throw new Error();
      return new File([blob], filename);
    }),
  );
}
