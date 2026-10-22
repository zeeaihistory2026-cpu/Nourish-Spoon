import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

export function useRemotePhoto(path: string | undefined) {
  const [photo, setPhoto] = useState<{ path: string; uri: string }>();
  useEffect(() => {
    setPhoto(undefined);
    if (!path || !db) return;
    return onSnapshot(
      doc(db, path),
      (snapshot) => {
        const photo = snapshot.data();
        setPhoto(
          photo?.content_type === "image/jpeg" && typeof photo.data === "string"
            ? { path, uri: `data:image/jpeg;base64,${photo.data}` }
            : undefined,
        );
      },
      () => setPhoto(undefined),
    );
  }, [path]);
  return photo?.path === path ? photo?.uri : undefined;
}

export async function choosePhoto(avatar = false): Promise<string | undefined> {
  const Picker = await import("expo-image-picker");
  const result = await Picker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: avatar,
    aspect: [1, 1],
    quality: 1,
    allowsMultipleSelection: false,
  });
  if (result.canceled) return;
  const source = result.assets[0];
  const { ImageManipulator, SaveFormat } =
    await import("expo-image-manipulator");
  const context = ImageManipulator.manipulate(source.uri);
  const limit = avatar ? 320 : 960;
  context.resize(
    source.width >= source.height
      ? { width: Math.min(limit, source.width) }
      : { height: Math.min(limit, source.height) },
  );
  const image = await context.renderAsync();
  try {
    for (const compress of [0.75, 0.55, 0.35]) {
      const output = await image.saveAsync({
        format: SaveFormat.JPEG,
        compress,
        base64: true,
      });
      if (output.base64 && output.base64.length <= 160000)
        return `data:image/jpeg;base64,${output.base64}`;
    }
    throw Error("This photo is too large. Choose a smaller image.");
  } finally {
    image.release();
    context.release();
  }
}
