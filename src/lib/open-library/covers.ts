export type ImageSize = "S" | "M" | "L";

export function coverUrl(coverId: number, size: ImageSize = "M"): string {
  return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
}

export function authorPhotoUrl(photoId: number, size: ImageSize = "M"): string {
  return `https://covers.openlibrary.org/a/id/${photoId}-${size}.jpg`;
}
