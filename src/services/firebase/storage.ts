import { putFile, ref, getDownloadURL } from '@react-native-firebase/storage';

import { firebaseStorage } from './config';

// Local files must be plain file:// paths on Android (content:// URIs need copying first).
export async function uploadImage(remotePath: string, localUri: string): Promise<string> {
  const reference = ref(firebaseStorage, remotePath);
  await putFile(reference, localUri);
  return getDownloadURL(reference);
}
