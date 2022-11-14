import {
  doc, getFirestore, setDoc, collection,
} from 'firebase/firestore';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from 'firebase/storage';
import app from './firebase';

export default class Storage {
  constructor(path) {
    this.storage = getStorage(app);
    this.firestore = getFirestore(app);
    this.collection = collection(this.firestore, 'files');
    this.path = path;
  }

  setPath(path) {
    this.path = path;
  }

  uploadFile(file) {
    return new Promise((resolve, reject) => {
      const path = `files/${file.id}_${file.name}`;
      const fileRef = ref(this.storage, path);
      uploadBytes(fileRef, file)
        .then(({ metadata }) => {
          const metadataValidated = {};
          Object.keys(metadata).forEach((key) => {
            metadataValidated[key] = metadata[key] || null;
          });
          getDownloadURL(fileRef)
            .then((url) => {
              resolve({
                id: file.id,
                metadata: metadataValidated,
                path: fileRef.fullPath,
                url,
                name: file.name,
              });
            })
            .catch((err) => {
              reject(err);
            });
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  setFile(id, data) {
    return setDoc(doc(this.collection, id), data);
  }
}
