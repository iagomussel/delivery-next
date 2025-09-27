// Minimal upload placeholder; integrate with cloud later.

export interface UploadResult { url: string; width?: number; height?: number }

export async function uploadImage(_file: File): Promise<UploadResult> {
  // TODO: integrate with S3/Cloudinary
  return { url: '/placeholder.png' }
}

export function isAllowedImageType(type: string) {
  return ['image/png', 'image/jpeg', 'image/webp'].includes(type)
}

export function isUnderSizeLimit(bytes: number, limitMB = 5) {
  return bytes <= limitMB * 1024 * 1024
}

