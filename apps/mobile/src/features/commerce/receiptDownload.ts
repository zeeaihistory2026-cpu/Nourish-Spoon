import { File, Paths } from "expo-file-system";
import { isAvailableAsync, shareAsync } from "expo-sharing";

/** Keep receipts in private app storage until the customer chooses a destination. */
export async function downloadReceipt(filename: string, base64: string) {
  if (!await isAvailableAsync()) throw new Error("Saving PDFs is unavailable on this device.");
  if (!/^Nourish-Spoon-[a-zA-Z0-9-]+-receipt\.pdf$/.test(filename)) throw new Error("The receipt filename is invalid.");
  const file = new File(Paths.cache, filename);
  file.write(base64, { encoding: "base64" });
  // Android recipients may read the URI after the chooser closes. Let the OS
  // reclaim this private cache file instead of invalidating their granted URI.
  await shareAsync(file.uri, { mimeType: "application/pdf", UTI: "com.adobe.pdf", dialogTitle: "Save or share your receipt" });
}
