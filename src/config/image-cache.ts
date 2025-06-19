import constants from './consts';

// Image cache configuration
export const IMAGE_CACHE_CONFIG = {
  // Cache duration in milliseconds (30 days)
  CACHE_DURATION: 1000 * 60 * 60 * 24 * 30,
  
  // Cache keys prefixes for different types of images
  CACHE_KEYS: {
    RANKING_BANNER: 'ranking-banner',
    USER_AVATAR: 'user-avatar',
    RANKING_DETAIL_BANNER: 'ranking-detail-banner',
    RANKING_ITEM_PHOTO: 'ranking-item-photo',
  },
  
  // Default placeholder image
  PLACEHOLDER_IMAGE: constants.bannerPlaceholder,
  
  // Image quality settings
  QUALITY: {
    HIGH: 1.0,
    MEDIUM: 0.8,
    LOW: 0.6,
  },
  
  // Resize modes
  RESIZE_MODES: {
    COVER: 'cover' as const,
    CONTAIN: 'contain' as const,
    STRETCH: 'stretch' as const,
  },
};

// Helper function to generate cache keys
export function generateCacheKey(type: keyof typeof IMAGE_CACHE_CONFIG.CACHE_KEYS, identifier: string): string {
  return `${IMAGE_CACHE_CONFIG.CACHE_KEYS[type]}-${identifier}`;
}

// Helper function to get optimized image URL
export function getOptimizedImageUrl(imageName: string | null | undefined): string {
  if (!imageName) {
    return IMAGE_CACHE_CONFIG.PLACEHOLDER_IMAGE;
  }
  
  return `${constants.bucketUrl}/${imageName}`;
} 