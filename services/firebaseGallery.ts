import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  orderBy,
  limit,
  onSnapshot
} from 'firebase/firestore';
import { db } from './firebase';
import { handleFirestoreError, OperationType } from './firestoreErrors';
import { GalleryItem } from '../types';

export const MAX_GALLERY_ITEMS = 12;
const CARDS_COLLECTION = 'cards';
const LOCAL_STORAGE_BACKUP_KEY = 'festive_lens_gallery_v1';

/**
 * Loads gallery items from Firestore in real-time or via one-shot fetch.
 * Automatically falls back to localStorage if offline.
 */
export async function fetchCardsFromFirestore(maxItems = MAX_GALLERY_ITEMS): Promise<GalleryItem[]> {
  try {
    const q = query(
      collection(db, CARDS_COLLECTION),
      orderBy('timestamp', 'desc'),
      limit(maxItems)
    );
    const snap = await getDocs(q);
    const items: GalleryItem[] = [];
    snap.forEach((docSnap) => {
      items.push(docSnap.data() as GalleryItem);
    });

    // Also mirror to localStorage as an offline cache
    if (items.length > 0) {
      try {
        localStorage.setItem(LOCAL_STORAGE_BACKUP_KEY, JSON.stringify(items.slice(0, 5)));
      } catch {
        // Ignore quota warning on local mirror
      }
    }
    return items;
  } catch (error) {
    console.warn('Firestore fetch failed, checking local backup:', error);
    try {
      const backup = localStorage.getItem(LOCAL_STORAGE_BACKUP_KEY);
      if (backup) {
        return JSON.parse(backup);
      }
    } catch {
      // Ignore
    }
    handleFirestoreError(error, OperationType.LIST, CARDS_COLLECTION);
  }
}

/**
 * Subscribes to real-time updates of cards from Firestore.
 */
export function subscribeCardsFromFirestore(
  onUpdate: (cards: GalleryItem[]) => void,
  onError?: (error: Error) => void,
  maxItems = MAX_GALLERY_ITEMS
): () => void {
  try {
    const q = query(
      collection(db, CARDS_COLLECTION),
      orderBy('timestamp', 'desc'),
      limit(maxItems)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items: GalleryItem[] = [];
        snapshot.forEach((docSnap) => {
          items.push(docSnap.data() as GalleryItem);
        });
        onUpdate(items);

        // Update local cache
        try {
          if (items.length > 0) {
            localStorage.setItem(LOCAL_STORAGE_BACKUP_KEY, JSON.stringify(items.slice(0, 5)));
          }
        } catch {
          // Ignore
        }
      },
      (error) => {
        console.error('Firestore snapshot listener error:', error);
        if (onError) {
          onError(error);
        }
        handleFirestoreError(error, OperationType.GET, CARDS_COLLECTION);
      }
    );

    return unsubscribe;
  } catch (error) {
    console.warn('Failed to attach onSnapshot listener:', error);
    return () => {};
  }
}

/**
 * Fetches a single card by ID (useful for deep-linking shared cards).
 */
export async function getCardByIdFromFirestore(id: string): Promise<GalleryItem | null> {
  const cardPath = `${CARDS_COLLECTION}/${id}`;
  try {
    const docRef = doc(db, CARDS_COLLECTION, id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as GalleryItem;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, cardPath);
  }
}

/**
 * Persists a festival card to Firestore.
 */
export async function saveCardToFirestore(item: GalleryItem): Promise<void> {
  const cardPath = `${CARDS_COLLECTION}/${item.id}`;
  try {
    // Construct sanitized payload strictly complying with Firestore Security Rules
    const cardData: Record<string, any> = {
      id: item.id,
      timestamp: Number(item.timestamp),
      festivalId: item.festivalId,
      festivalName: item.festivalName,
      greeting: item.greeting,
      textStyle: item.textStyle,
      aspectRatio: item.aspectRatio,
      composedImage: item.composedImage,
      isPublic: item.isPublic ?? true,
      createdAt: item.createdAt || new Date(item.timestamp).toISOString()
    };

    if (item.festivalIcon) cardData.festivalIcon = item.festivalIcon;
    if (item.styleId) cardData.styleId = item.styleId;
    if (item.styleName) cardData.styleName = item.styleName;
    if (item.resolution) cardData.resolution = item.resolution;
    if (item.ownerId) cardData.ownerId = item.ownerId;
    if (item.rawImage && item.rawImage.length <= 800000) {
      cardData.rawImage = item.rawImage;
    }

    await setDoc(doc(db, CARDS_COLLECTION, item.id), cardData);
  } catch (error) {
    console.error('Failed to save card to Firestore:', error);
    // Write to local storage fallback
    try {
      const backup = localStorage.getItem(LOCAL_STORAGE_BACKUP_KEY);
      const list = backup ? JSON.parse(backup) : [];
      const updated = [item, ...list.filter((x: GalleryItem) => x.id !== item.id)].slice(0, 5);
      localStorage.setItem(LOCAL_STORAGE_BACKUP_KEY, JSON.stringify(updated));
    } catch {
      // Ignore
    }
    handleFirestoreError(error, OperationType.WRITE, cardPath);
  }
}

/**
 * Deletes a card from Firestore.
 */
export async function deleteCardFromFirestore(id: string): Promise<void> {
  const cardPath = `${CARDS_COLLECTION}/${id}`;
  try {
    await deleteDoc(doc(db, CARDS_COLLECTION, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, cardPath);
  }
}

/**
 * Helper to compress image canvas before uploading to Firestore to stay within document size limit
 */
export function compressCanvasForGallery(
  sourceCanvas: HTMLCanvasElement,
  maxDimension = 1000,
  quality = 0.82
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
  link.href = dataUrl;
  link.download = filename || `Festival_Card_${Date.now()}.jpg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
