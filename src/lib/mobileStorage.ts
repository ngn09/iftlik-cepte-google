import { Capacitor } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";
import localforage from "localforage";

localforage.config({
  name: "ciftlik-offline",
  storeName: "kv",
});

const isNative = () => Capacitor.isNativePlatform();

export const mobileStorage = {
  async getItem(key: string): Promise<string | null> {
    if (isNative()) {
      const { value } = await Preferences.get({ key });
      return value ?? null;
    }
    return (await localforage.getItem<string>(key)) ?? null;
  },
  async setItem(key: string, value: string) {
    if (isNative()) {
      await Preferences.set({ key, value });
    } else {
      await localforage.setItem(key, value);
    }
  },
  async removeItem(key: string) {
    if (isNative()) {
      await Preferences.remove({ key });
    } else {
      await localforage.removeItem(key);
    }
  },
  async clear() {
    if (isNative()) {
      await Preferences.clear();
    } else {
      await localforage.clear();
    }
  },
};

export default mobileStorage;
