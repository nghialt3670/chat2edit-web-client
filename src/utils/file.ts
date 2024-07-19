import { createCanvasFromFile } from "./fabric";

export function readFileToDataURL(file: File): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string | null);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function readFileAsText(file: File): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

export function getFileBaseName(file: File): string {
  const fileNameParts = file.name.split(".");
  fileNameParts.pop();
  return fileNameParts.join(".");
}

export function getBaseName(filename: string): string {
  const fileNameParts = filename.split(".");
  fileNameParts.pop();
  return fileNameParts.join(".");
}

export function getExtension(filename: string): string {
  return filename.split(".").pop() || "";
}

export function downloadFile(file: File): void {
  const url = URL.createObjectURL(file);
  const a = document.createElement("a");
  a.href = url;
  a.download = file.name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function copyFile(file: File): Promise<File> {
  const fileNameParts = file.name.split(".");
  const extension = fileNameParts.pop();
  const baseName = fileNameParts.join(".");
  const newFilename = `${baseName} (copy).${extension}`;
  const buffer = await file.arrayBuffer();
  return new File([buffer], newFilename, { type: file.type });
}

export function createJsonFile(object: Object, filename: string) {
  const jsonString = JSON.stringify(object);
  const blob = new Blob([jsonString], { type: "application/json" });
  return new File([blob], filename, { type: "application/json" });
}

export async function getFilePreviewDataURL(
  file: File,
): Promise<string | null> {
  switch (getExtension(file.name)) {
    case "canvas":
      const canvas = await createCanvasFromFile(file);
      if (!canvas) return null;
      return canvas?.toDataURL();
    case "jpeg":
    case "jpg":
    case "png":
    case "gif":
    case "bmp":
    case "webp":
    case "tiff":
    case "svg+xml":
    case "vnd.microsoft.icon":
    case "heif":
    case "heic":
    case "avif":
    case "ico":
      return await readFileToDataURL(file);
    default:
      return null;
  }
}

export async function fetchImageAsDataURL(httpURL: string): Promise<string> {
  const response = await fetch(httpURL);
  const blob = await response.blob();
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      resolve(dataUrl);
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsDataURL(blob);
  });
}

export function getFilenameFromContentDisposition(
  contentDisposition: string,
): string | null {
  const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
  const matches = filenameRegex.exec(contentDisposition);

  if (matches != null && matches[1]) {
    const filename = matches[1].replace(/['"]/g, "");
    return filename;
  }
  return null;
}
