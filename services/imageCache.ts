const CACHE_KEY = 'worksheetImageCache';
const MAX_CACHE_SIZE = 50; // Store up to 50 images

interface CacheEntry {
  word: string;
  imageData: string;
  timestamp: number;
}

// Get the cache from localStorage
const getCache = (): CacheEntry[] => {
  try {
    const cachedData = localStorage.getItem(CACHE_KEY);
    return cachedData ? JSON.parse(cachedData) : [];
  } catch (e) {
    console.error("Failed to read image cache from localStorage", e);
    return [];
  }
};

// Save the cache to localStorage
const saveCache = (cache: CacheEntry[]): void => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (e) {
    console.error("Failed to save image cache to localStorage", e);
  }
};

export const getImageFromCache = (word: string): string | null => {
  const normalizedWord = word.toLowerCase().trim();
  const cache = getCache();
  const entry = cache.find(item => item.word === normalizedWord);
  return entry ? entry.imageData : null;
};

export const saveImageToCache = (word: string, imageData: string): void => {
  if (!imageData) return;
  const normalizedWord = word.toLowerCase().trim();
  let cache = getCache();
  
  // Remove existing entry for the same word to update it
  cache = cache.filter(item => item.word !== normalizedWord);

  // Add new entry
  const newEntry: CacheEntry = {
    word: normalizedWord,
    imageData,
    timestamp: Date.now(),
  };
  cache.unshift(newEntry); // Add to the front

  // Evict old entries if cache is too large
  if (cache.length > MAX_CACHE_SIZE) {
    // Keep the most recent entries
    cache = cache.sort((a, b) => b.timestamp - a.timestamp).slice(0, MAX_CACHE_SIZE);
  }

  saveCache(cache);
};
