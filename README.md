# ReactNativeInstorageTest

This is a test to show the issue https://github.com/TallerWebSolutions/apollo-cache-instorage/issues/6 from the project apollo-cache-instorage

Furthermore, some apollo-cache-instorage files had been modified to get this working:

[src/utils.js:](https://github.com/TallerWebSolutions/apollo-cache-instorage/blob/master/src/utils.js)
```js
const validStorage = storage =>
  Boolean(
    storage &&
      storage.getItem &&
      storage.setItem &&
      storage.removeItem /*&&
      storage.clear*/
  )
```

[src/objectStorageCache.js:](https://github.com/TallerWebSolutions/apollo-cache-instorage/blob/master/src/objectStorageCache.js)
```js
get (dataId) {
  if (!this.data[dataId] && this.persistence.shouldPersist('get', dataId)) {
    /*this.data[dataId] = this.persistence.denormalize(
      this.persistence.storage.getItem(`${this.persistence.prefix}${dataId}`)
    )*/

    const data = this.persistence.storage.getItem('' + this.persistence.prefix + dataId).then(data => {
      console.info('GETTTTT     OK', data)
      this.data[dataId] = data && this.persistence.denormalize(data);
    }).catch(error => {
      console.info('GETTTTT     NOT OK', error)
    })
  }

  return this.data[dataId]
}
```
