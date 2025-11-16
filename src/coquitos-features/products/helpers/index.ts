export { getStatusColor } from './get-status-color';
export { compressImage, validateImageSize, getImageInfo } from './image-compression';
export { generateProductSKU, generateSKUWithCategory, generateSimpleSKU, isValidSKU } from './generate-sku';
export { 
  getDaysUntilExpiration, 
  isProductNearExpiration,
  isProductExpiringSoon,
  isProductExpiredOrExpiringToday,
  getNearestExpirationDate, 
  formatExpirationDate 
} from './expiration-helpers';

