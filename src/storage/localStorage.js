// Setting max size to 3 mbs since limit is often 5mbs, 
// this will allow local storage to still be used for other purposes.
const MAX_CACHE_SIZE = 3 * (1024 * 1024)


export class LocalStore {

  constructor() {
    this.storage = localStorage
  }

  /**
   * Persists the input session to persistent storage.
   */
  save(key, theValue) {
    return this.verifyStorage()
      .then(() => this.serialize(theValue))
      .then(serialized => this.insert(key, serialized))
  }

  /**
   * Load from local or session storage with key
   * Return: null if nothing found or couldn"t load
   * @param {string} key 
   * @returns 
   * @memberof LocalStore
   */
  load(key) {
    return this.verifyStorage()
      .then(() => this.storage.getItem(key))
      .then(val => {
        if (!val) {
          return null
        }
        return this.deserialize(val)
      })
  }

  /**
   * Clear local Storage
   * 
   * @returns 
   * @memberof LocalStore
   */
  clear() {
    this.storage.clear()
    return Promise.resolve()
  }

  remove(key) {
    this.storage.removeItem(key)
    return Promise.resolve(true)
  }

  getKeys() {
    return Promise.resolve(Object.keys(this.storage))
  }

  verifyStorage() {
    if (!this.storage) {
      // no storage, we can"t don"t do anything.
      return Promise.reject("localStorage is not available")
    }
    return Promise.resolve()
  }

  serialize(value) {
    if (this.isDate(value)) {
      value = value.toISOString();
    }
    // ensuring the stored object is type string, or else convert.
    if (typeof value !== "string") {
      // wont handle recursive objects, recursive objects should not be stored.
      value = JSON.stringify(value)
    }
    return value
  }

  deserialize(found) {
    // Parse to an object|array if it has object|array syntax
    if (found && (found.indexOf("{") > -1 || found.indexOf("[") > -1)) {
      return this.getObjectProps(JSON.parse(found))
      // Parse boolean
    } else if (found === "true" || found === "false") {
      return (found === "true") ? true : false
    } else if (!isNaN(Number(found))) {
      return Number(found)
    } else if (this.isSerializedDate(found)) {
      return this.convertToDate(found)
    } else if (found === 'undefined') {
      return null
    }
    return found
  }

  getObjectProps(obj) {
    Object.keys(obj).map((key) => {
      obj[key] = this.getPropValue(obj[key])
    })
    return obj;
  }

  getPropValue(value) {
    if (this.isArray(value)) {
      return value.map(val => this.getPropValue(val))
    } else if (typeof value === "object") {
      return this.getObjectProps(value)
    } else if (typeof value === "string" && this.isSerializedDate(value)) {
      return this.convertToDate(value)
    }
    return value
  }

  convertToDate(value) {
    let epoch = Date.parse(value)
    if (isNaN(epoch)) {
      return value
    }
    return new Date(epoch)
  }

  isSerializedDate(val) {
    var isDate = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/.test(val)
    if (!isDate) {
      return /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+/.test(val)
    }
    return isDate
  }

  insert(key, value) {
    try {
      this.storage.setItem(key, value)
      return Promise.resolve(true)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  isDate(value) {
    return Object.prototype.toString.call(value) === "[object Date]"
  }

  isArray(value) {
    return Object.prototype.toString.call(value) === "[object Array]"
  }

}