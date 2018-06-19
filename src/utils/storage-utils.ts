import {NativeStorage} from "@ionic-native/native-storage";

export class StorageUtils {
  constructor(private nativeStorage: NativeStorage) {}

  get(id) {
    return new Promise((resolve, reject) => {
      this.nativeStorage.getItem(id).then((data) => {
        if (!data) {
          reject("Value doesn't exist");
        } else {
          resolve(data.toString());
        }
      }, (error) => {
        reject(error);
      });
    });
  }

  set(id, data) {
    return this.nativeStorage.setItem(id, data);
  }

  remove(id) {
    return this.nativeStorage.remove(id);
  }

  clear() {
    return this.nativeStorage.clear();
  }

  keys() {
    return this.nativeStorage.keys();
  }
}
