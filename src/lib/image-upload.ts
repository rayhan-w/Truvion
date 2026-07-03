const DIRECT_UPLOAD_LIMIT = 1.5 * 1024 * 1024;
const MAX_SOURCE_SIZE = 25 * 1024 * 1024;
const MAX_DIMENSION = 1600;
const OUTPUT_TYPE = "image/webp";
const OUTPUT_QUALITY = 0.82;

function loadImage(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("This image format could not be processed. Please try JPG, PNG, or WebP."));
    };
    img.src = url;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(blob => {
      if (blob) resolve(blob);
      else reject(new Error("Could not compress image"));
    }, OUTPUT_TYPE, OUTPUT_QUALITY);
  });
}

function withWebpExtension(fileName: string) {
  const cleanName = fileName.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/\.[^.]+$/, "");
  return `${cleanName || "image"}.webp`;
}

export async function prepareImageUpload(file: File) {
  if (!file.type.startsWith("image/")) throw new Error("Please choose an image file");
  if (file.size > MAX_SOURCE_SIZE) throw new Error("Image is too large. Please use an image under 25MB.");

  if (file.size <= DIRECT_UPLOAD_LIMIT) {
    return { blob: file as Blob, fileName: file.name, contentType: file.type };
  }

  if (file.type === "image/svg+xml") {
    throw new Error("Large SVG files are not supported. Please use a smaller SVG, JPG, PNG, or WebP image.");
  }

  const img = await loadImage(file);
  const scale = Math.min(1, MAX_DIMENSION / Math.max(img.naturalWidth, img.naturalHeight));
  const width = Math.max(1, Math.round(img.naturalWidth * scale));
  const height = Math.max(1, Math.round(img.naturalHeight * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not process image");
  ctx.drawImage(img, 0, 0, width, height);

  const compressed = await canvasToBlob(canvas);
  return { blob: compressed, fileName: withWebpExtension(file.name), contentType: OUTPUT_TYPE };
}