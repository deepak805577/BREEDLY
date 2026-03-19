import imageCompression from "browser-image-compression";

export async function compressImage(file) {
  return await imageCompression(file, {
    maxSizeMB: 0.3,
    maxWidthOrHeight: 512,
    useWebWorker: true,
  });
}
