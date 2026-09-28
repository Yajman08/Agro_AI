export const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;

export function validateImageFile(file: File): string | null {
  if (!file.type.startsWith("image/")) {
    return "Please choose an image file, such as a JPG, PNG, or WEBP photo.";
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return "This image is too large. Please choose a photo smaller than 10 MB.";
  }

  return null;
}