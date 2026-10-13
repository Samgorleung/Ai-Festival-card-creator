import { GalleryItem } from '../types';

const GALLERY_STORAGE_KEY = 'festive_lens_gallery_v1';
export const MAX_GALLERY_ITEMS = 5;

/**
 * Safely loads gallery items from localStorage.
 */
export function loadGallery(): GalleryItem[] {
  try {
    const raw = localStorage.getItem(GALLERY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.slice(0, MAX_GALLERY_ITEMS);
    }
    return [];
  } catch (err) {
    console.warn('Failed to read gallery from localStorage:', err);
    return [];
  }
}

/**
 * Saves a new gallery item or updates existing items.
 * Keeps only the last MAX_GALLERY_ITEMS (newest first).
 * Handles QuotaExceededError by auto-pruning older items.
 */
export function saveToGallery(item: GalleryItem): GalleryItem[] {
  const current = loadGallery();
  // Filter out any existing item with identical id
  const filtered = current.filter(existing => existing.id !== item.id);
  // Put new item at the front
  let updatedList = [item, ...filtered].slice(0, MAX_GALLERY_ITEMS);

  // Attempt to write to localStorage with graceful fallback
  let attempts = 0;
  while (attempts < 3) {
    try {
      localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(updatedList));
      return updatedList;
    } catch (err) {
      attempts++;
      console.warn(`localStorage quota pressure on attempt ${attempts}. Pruning oldest item...`, err);
      if (updatedList.length > 1) {
        // Prune the oldest item and try again
        updatedList = updatedList.slice(0, updatedList.length - 1);
      } else {
        // If even 1 item fails, try to strip rawImage to reduce payload
        if (updatedList[0]?.rawImage) {
          updatedList[0] = { ...updatedList[0], rawImage: undefined };
        } else {
          break;
        }
      }
    }
  }

  try {
    localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(updatedList));
  } catch {
    console.error('Unable to persist gallery item due to strict browser quota.');
  }

  return updatedList;
}

/**
 * Updates an existing item in the gallery (e.g., when greeting or textStyle changes).
 */
export function updateGalleryItem(id: string, updates: Partial<GalleryItem>): GalleryItem[] {
  const current = loadGallery();
  const index = current.findIndex(i => i.id === id);
  if (index === -1) return current;

  current[index] = { ...current[index], ...updates };
  try {
    localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(current));
  } catch (err) {
    console.warn('Failed to update gallery item in storage:', err);
  }
  return [...current];
}

/**
 * Deletes a single item by id.
 */
export function deleteFromGallery(id: string): GalleryItem[] {
  const current = loadGallery();
  const updated = current.filter(item => item.id !== id);
  try {
    localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Failed to remove gallery item from storage:', err);
  }
  return updated;
}

/**
 * Clears all items in the gallery.
 */
export function clearGallery(): void {
  try {
    localStorage.removeItem(GALLERY_STORAGE_KEY);
  } catch (err) {
    console.warn('Failed to clear gallery:', err);
  }
}

/**
 * Compresses an HTMLCanvasElement down to high-resolution JPEG (max 1200px)
 * for compact local storage persistence without visual degradation.
 */
export function compressCanvasForGallery(
  sourceCanvas: HTMLCanvasElement,
  maxDimension = 1200,
  quality = 0.85
): string {
  const { width, height } = sourceCanvas;
  let targetWidth = width;
  let targetHeight = height;

  if (Math.max(width, height) > maxDimension) {
    if (width > height) {
      targetWidth = maxDimension;
      targetHeight = Math.round((height * maxDimension) / width);
    } else {
      targetHeight = maxDimension;
      targetWidth = Math.round((width * maxDimension) / height);
    }
  }

  const thumbCanvas = document.createElement('canvas');
  thumbCanvas.width = targetWidth;
  thumbCanvas.height = targetHeight;
  const ctx = thumbCanvas.getContext('2d');
  if (ctx) {
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(sourceCanvas, 0, 0, targetWidth, targetHeight);
    return thumbCanvas.toDataURL('image/jpeg', quality);
  }

  return sourceCanvas.toDataURL('image/jpeg', quality);
}

/**
 * Programmatically downloads an image data URL with a specific filename.
 */
export function downloadCardImage(dataUrl: string, filename?: string): void {
  const link = document.createElement('a');
  link.download = filename || `Festival_Card_${Date.now()}.png`;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
