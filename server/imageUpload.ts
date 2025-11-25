import FormData from "form-data";

export async function uploadImageToImgbb(
  imageBuffer: Buffer,
  fileName: string
): Promise<string> {
  const apiKey = process.env.IMGBB_API_KEY;

  if (!apiKey) {
    throw new Error("IMGBB_API_KEY is not configured");
  }

  const formData = new FormData();
  formData.append("image", imageBuffer, fileName);
  formData.append("key", apiKey);

  try {
    const response = await globalThis.fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      body: formData as any,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload image: ${response.statusText}`);
    }

    const data: any = await response.json();

    if (!data.success) {
      throw new Error(data.error?.message || "Image upload failed");
    }

    return data.data.url;
  } catch (error) {
    throw new Error(`Image upload error: ${error}`);
  }
}

export async function uploadImageFromUrl(imageUrl: string): Promise<string> {
  try {
    const response = await globalThis.fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image from URL: ${response.statusText}`);
    }

    const buffer = await response.arrayBuffer();
    const bufferObj = Buffer.from(buffer);
    const fileName = `product-${Date.now()}.jpg`;

    return uploadImageToImgbb(bufferObj, fileName);
  } catch (error) {
    throw new Error(`Failed to upload image from URL: ${error}`);
  }
}
