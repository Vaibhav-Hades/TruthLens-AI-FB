// Error handling and retry utilities
export const API_ERROR_MESSAGES = {
   NETWORK_ERROR: '❌ Network error - check your connection',
   TIMEOUT: '⏱️ Request timeout - please try again',
   SERVER_ERROR: '❌ Server error - please refresh',
   INVALID_INPUT: '⚠️ Invalid input provided',
   NOT_FOUND: '❌ Resource not found',
   UNAUTHORIZED: '🔐 Unauthorized access',
   RATE_LIMITED: '⏳ Too many requests - wait a moment'
}

export const withRetry = async (fn, maxRetries = 3, delayMs = 1000) => {
   let lastError
   
   for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
         return await fn()
      } catch (error) {
         lastError = error
         if (attempt < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, delayMs * attempt))
         }
      }
   }
   
   throw lastError
}

export const getErrorMessage = (status) => {
   switch (status) {
      case 'NETWORK_ERROR':
         return API_ERROR_MESSAGES.NETWORK_ERROR
      case 'TIMEOUT':
         return API_ERROR_MESSAGES.TIMEOUT
      case 500:
         return API_ERROR_MESSAGES.SERVER_ERROR
      case 400:
         return API_ERROR_MESSAGES.INVALID_INPUT
      case 404:
         return API_ERROR_MESSAGES.NOT_FOUND
      case 401:
         return API_ERROR_MESSAGES.UNAUTHORIZED
      case 429:
         return API_ERROR_MESSAGES.RATE_LIMITED
      default:
         return '❌ An error occurred'
   }
}

// Validation utilities
export const validateText = (text, minLength = 10) => {
   if (!text || text.trim().length === 0) {
      return { valid: false, error: 'Text cannot be empty' }
   }
   if (text.trim().length < minLength) {
      return { valid: false, error: `Text must be at least ${minLength} characters` }
   }
   if (text.length > 10000) {
      return { valid: false, error: 'Text exceeds 10,000 characters' }
   }
   return { valid: true }
}

export const validateUrl = (url) => {
   try {
      new URL(url)
      return { valid: true }
   } catch {
      return { valid: false, error: 'Invalid URL format' }
   }
}

// Request caching
class RequestCache {
   constructor(ttl = 5 * 60 * 1000) { // 5 mins default
      this.cache = new Map()
      this.ttl = ttl
   }

   set(key, value) {
      this.cache.set(key, {
         value,
         timestamp: Date.now()
      })
   }

   get(key) {
      const item = this.cache.get(key)
      if (!item) return null

      if (Date.now() - item.timestamp > this.ttl) {
         this.cache.delete(key)
         return null
      }

      return item.value
   }

   clear() {
      this.cache.clear()
   }
}

export const analyzeCache = new RequestCache()

// Debounce utility
export const debounce = (fn, delay = 300) => {
   let timeoutId
   return (...args) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => fn(...args), delay)
   }
}

// Throttle utility
export const throttle = (fn, limit = 1000) => {
   let inThrottle
   return (...args) => {
      if (!inThrottle) {
         fn.apply(this, args)
         inThrottle = true
         setTimeout(() => inThrottle = false, limit)
      }
   }
}
