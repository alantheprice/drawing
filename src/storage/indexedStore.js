import {
  Deferred
} from "../deferred.model"

const CACHE_NAME = "cache"
const CACHE_KEY_NAME = "cacheKeys"
const RW = "readwrite"

export class IndexedStore {

  constructor(DBName) {
    this.DB_NAME = DBName
    this.getDbProm = null
    this.keys = new Set()
    this.idb = indexedDB
    this.getDbProm = this.open()
    window["indexedStore"] = this
  }

  open() {
    let deferred = new Deferred()
    let request = this.idb.open(this.DB_NAME, 1)
    request.onerror = (event) => {
      deferred.reject("Error in Opening indexedDB")
    }
    request.onsuccess = (event) => {
      let db = event.target.result
      this.addErrorHandler(db)
      deferred.resolve(db)
    }
    request.onupgradeneeded = (event) => {
      let db = event.target.result
      this.addErrorHandler(db)

      let objectStore = db.createObjectStore(CACHE_NAME, {
        keyPath: "key"
      })
      // creating a seperate object store for keys for performance reasons
      let objectKeyStore = db.createObjectStore(CACHE_KEY_NAME, {
        keyPath: "key"
      })
      // ensuring both transactions have finished before we resolve.
      var success = false
      let complete = (event) => {
        if (!success) {
          success = true
          return
        }
        deferred.resolve(db)
      }
      objectStore.transaction.oncomplete = complete
      objectStore.transaction.oncomplete = complete
    }
    return deferred.promise
  }

  addErrorHandler(db) {
    db.onerror = (event) => {
      console.error(event.target.errorCode)
    }
  }

  // : Promise < IDBTransaction >
  getTransaction(storeName) {
    return this.getDbProm.then(db => {
      return db.transaction([storeName], RW)
    })
  }

  getObjectStore(storeName) {
    return this.getTransaction(storeName)
      .then(transaction => {
        return transaction.objectStore(storeName)
      })
  }

  /**
   * Persists the input session to persistent storage.
   * : Promise < boolean > 
   */
  save(key, theValue) {
    return this.getObjectStore(CACHE_NAME)
      .then(objStore => {
        return this.convertToPromise(objStore.put({
          key: key,
          value: theValue
        }))
      }).then(() => {
        return this.addKey(key)
      })
  }

  //: Promise < boolean >
  addKey(key) {
    this.keys.add(key)
    return this.getObjectStore(CACHE_KEY_NAME)
      .then(objStore => {
        return this.convertToPromise(objStore.put({
          key: key
        }))
      }).then(() => {
        return true
      })
  }

  //: Promise < boolean >
  removeKey(key) {
    this.keys.delete(key)
    return this.getObjectStore(CACHE_KEY_NAME)
      .then(objStore => {
        return this.convertToPromise(objStore.delete(key))
      }).then(() => {
        return true
      })
  }

  /**
   * Load from local or session storage with key
   * Return: null if nothing found or couldn"t load
   * : Promise < any >
   */
  load(key) {
    return this.getObjectStore(CACHE_NAME)
      .then(objectStore => {
        return this.convertToPromise(objectStore.get(key))
      }).then((keyValue) => {
        return (keyValue && keyValue.value) ? keyValue.value : null
      })
  }

  //: Promise
  clear() {
    return this.getObjectStore(CACHE_NAME)
      .then(objectStore => {
        return this.convertToPromise(objectStore.clear())
      }).then(() => {
        return this.getObjectStore(CACHE_KEY_NAME)
      }).then(keyStore => {
        return this.convertToPromise(keyStore.clear())
      }).then(() => {
        this.keys = new Set()
      })
  }

  // remove(key) {
  //   return this.getObjectStore(CACHE_NAME)
  //     .then(objectStore => {
  //       return this.convertToPromise(objectStore.delete(key))
  //     }).then(() => {
  //       return this.getObjectStore(CACHE_KEY_NAME)
  //     }).then(keyStore => {
  //       return this.convertToPromise(keyStore.delete(key))
  //     }).then(() => true)
  // }

  verifyStorage() {
    return !!this.idb
  }

  convertToPromise(request) {
    return new Promise((resolve, reject) => {
      request.onerror = (error) => {
        reject(error)
      }
      request.onsuccess = (event) => {
        resolve(event.target.result || null)
      }
    })
  }

  getAllItems(storeName) {
    return this.getTransaction(storeName)
      .then(transaction => {
        var store = transaction.objectStore(storeName)
        var items = []
        return new Promise((resolve, reject) => {
          transaction.oncomplete = function (evt) {
            resolve(items)
          }

          let cursorRequest = store.openCursor()
          cursorRequest.onerror = function (error) {
            reject(error)
            console.error(error)
          }

          cursorRequest.onsuccess = function (evt) {
            var cursor = evt.target.result
            if (cursor) {
              items.push(cursor.value)
              cursor.continue()
            }
          }
        })
      })
  }

}