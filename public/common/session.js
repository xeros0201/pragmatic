const getRate = ()=>{


    return 0.1
}
class SessionStorageCRUD {
    /**
     * Create (Add) a new item to sessionStorage.
     * @param {string} key - The unique key for the item.
     * @param {Object} value - The object to store.
     * @returns {boolean} - Returns true if the item was added, false if the key already exists.
     */
    static createItem(key, value) {
      if (sessionStorage.getItem(key)) {
        
        this.updateItem(key, value)
        return true; // Key already exists
      }
      try {
        const serializedValue = JSON.stringify(value);
        sessionStorage.setItem(key, serializedValue);
        return true;
      } catch (error) {
        console.error(`Error creating item with key "${key}":`, error);
        return false;
      }
    }
  
    /**
     * Get (Read) an item from sessionStorage.
     * @param {string} key - The key of the item to retrieve.
     * @returns {Object|null} - The retrieved object or null if not found or on error.
     */
    static getItem(key) {
      const serializedValue = sessionStorage.getItem(key);
      if (!serializedValue) {
        console.warn(`Get failed: No item found with key "${key}".`);
        return null;
      }
      try {
        return JSON.parse(serializedValue);
      } catch (error) {
        console.error(`Error parsing item with key "${key}":`, error);
        return null;
      }
    }
  
    /**
     * Update an existing item in sessionStorage.
     * @param {string} key - The key of the item to update.
     * @param {Object} newValue - The new object to replace the existing one.
     * @returns {boolean} - Returns true if the item was updated, false if the key does not exist.
     */
    static updateItem(key, newValue) {
      if (!sessionStorage.getItem(key)) {
        console.warn(`Update failed: No item found with key "${key}".`);
        return false; // Key does not exist
      }
      try {
        const serializedValue = JSON.stringify(newValue);
        sessionStorage.setItem(key, serializedValue);
        return true;
      } catch (error) {
        console.error(`Error updating item with key "${key}":`, error);
        return false;
      }
    }
  
    /**
     * Delete an item from sessionStorage.
     * @param {string} key - The key of the item to delete.
     * @returns {boolean} - Returns true if the item was deleted, false if the key does not exist.
     */
    static deleteItem(key) {
      if (!sessionStorage.getItem(key)) {
        console.warn(`Delete failed: No item found with key "${key}".`);
        return false; // Key does not exist
      }
      try {
        sessionStorage.removeItem(key);
        return true;
      } catch (error) {
        console.error(`Error deleting item with key "${key}":`, error);
        return false;
      }
    }
  
    /**
     * Get all keys stored in sessionStorage.
     * @returns {Array<string>} - An array of all keys.
     */
    static getAllKeys() {
      return Object.keys(sessionStorage);
    }
  
    /**
     * Clear all items from sessionStorage.
     * @returns {boolean} - Returns true if cleared successfully.
     */
    static clearAll() {
      try {
        sessionStorage.clear();
        return true;
      } catch (error) {
        console.error("Error clearing sessionStorage:", error);
        return false;
      }
    }
  }

 



  class CookieCRUD {
    /**
     * Encode a value for safe storage in cookies.
     * @param {string} value - The value to encode.
     * @returns {string} - The encoded value.
     */
    static encode(value) {
      return encodeURIComponent(value);
    }
  
    /**
     * Decode a value retrieved from cookies.
     * @param {string} value - The value to decode.
     * @returns {string} - The decoded value.
     */
    static decode(value) {
      return decodeURIComponent(value);
    }
  
    /**
     * Set a cookie with the given name, value, and expiration in seconds.
     * @param {string} name - The name/key of the cookie.
     * @param {string} value - The value of the cookie.
     * @param {number} seconds - Number of seconds until the cookie expires.
     */
    static setCookie(name, value, seconds) {
      const maxAge = seconds ? `; max-age=${seconds}` : '';
      // Optionally, include 'Secure' and 'SameSite' attributes for enhanced security
      const secure = location.protocol === 'https:' ? '; Secure' : '';
      const sameSite = '; SameSite=Lax'; // Adjust as needed: None, Strict, Lax
      document.cookie = `${this.encode(name)}=${this.encode(value)}${maxAge}; path=/${sameSite}${secure}`;
    }
  
    /**
     * Get the value of a cookie by name.
     * @param {string} name - The name/key of the cookie to retrieve.
     * @returns {string|null} - The cookie value or null if not found.
     */
    static getCookie(name) {
      const cookies = document.cookie ? document.cookie.split('; ') : [];
      const prefix = this.encode(name) + '=';
      for (let cookie of cookies) {
        if (cookie.indexOf(prefix) === 0) {
          return this.decode(cookie.substring(prefix.length));
        }
      }
      return null;
    }
  
    /**
     * Delete a cookie by name.
     * @param {string} name - The name/key of the cookie to delete.
     */
    static deleteCookie(name) {
      // Set the cookie with max-age=0 to delete it
      this.setCookie(name, '', 0);
    }
  
    /**
     * Create (Add) a new item as a cookie.
     * @param {string} key - The unique key for the cookie.
     * @param {Object} value - The object to store.
     * @param {number} expiresSeconds - Seconds until the cookie expires.
     * @returns {boolean} - Returns true if the cookie was added, false if the key already exists.
     */
    static createItem(key, value, expiresSeconds = 30) { // Default: 7 days
      if (this.getCookie(key)) {
            this.updateItem(key, value,60)
      }
      try {
        const serializedValue = JSON.stringify(value);
        this.setCookie(key, serializedValue, expiresSeconds);
        return true;
      } catch (error) {
        console.error(`Error creating cookie with key "${key}":`, error);
        return false;
      }
    }
  
    /**
     * Get (Read) an item from cookies.
     * @param {string} key - The key of the cookie to retrieve.
     * @returns {Object|null} - The retrieved object or null if not found or on error.
     */
    static getItem(key) {
      const serializedValue = this.getCookie(key);
      if (!serializedValue) {
        console.warn(`Get failed: No cookie found with key "${key}".`);
        return null;
      }
      try {
        return JSON.parse(serializedValue);
      } catch (error) {
        console.error(`Error parsing cookie with key "${key}":`, error);
        return null;
      }
    }
  
    /**
     * Update an existing item in cookies.
     * @param {string} key - The key of the cookie to update.
     * @param {Object} newValue - The new object to replace the existing one.
     * @param {number} expiresSeconds - Seconds until the cookie expires.
     * @returns {boolean} - Returns true if the cookie was updated, false if the key does not exist.
     */
    static updateItem(key, newValue, expiresSeconds = 604800) { // Default: 7 days
      if (!this.getCookie(key)) {
        console.warn(`Update failed: No cookie found with key "${key}".`);
        return false; // Key does not exist
      }
      try {
        const serializedValue = JSON.stringify(newValue);
        this.setCookie(key, serializedValue, expiresSeconds);
        return true;
      } catch (error) {
        console.error(`Error updating cookie with key "${key}":`, error);
        return false;
      }
    }
  
    /**
     * Delete an item from cookies.
     * @param {string} key - The key of the cookie to delete.
     * @returns {boolean} - Returns true if the cookie was deleted, false if the key does not exist.
     */
    static deleteItem(key) {
      if (!this.getCookie(key)) {
        console.warn(`Delete failed: No cookie found with key "${key}".`);
        return false; // Key does not exist
      }
      try {
        this.deleteCookie(key);
        return true;
      } catch (error) {
        console.error(`Error deleting cookie with key "${key}":`, error);
        return false;
      }
    }
  
    /**
     * Get all keys of the cookies managed by this utility.
     * @returns {Array<string>} - An array of all cookie keys.
     */
    static getAllKeys() {
      const cookies = document.cookie ? document.cookie.split('; ') : [];
      const keys = cookies.map(cookie => {
        const eqIdx = cookie.indexOf('=');
        return eqIdx > -1 ? this.decode(cookie.substring(0, eqIdx)) : this.decode(cookie);
      });
      return keys;
    }
  
    /**
     * Clear all cookies managed by this utility.
     * Note: This will attempt to delete all accessible cookies in the current path.
     * @returns {boolean} - Returns true if cleared successfully.
     */
    static clearAll() {
      const keys = this.getAllKeys();
      try {
        for (let key of keys) {
          this.deleteCookie(key);
        }
        return true;
      } catch (error) {
        console.error("Error clearing cookies:", error);
        return false;
      }
    }
  }