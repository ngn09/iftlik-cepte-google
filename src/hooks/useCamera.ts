import { Capacitor } from "@capacitor/core";
import {
  Camera,
  CameraResultType,
  CameraSource,
} from "@capacitor/camera";

export type PickImageOptions = {
  quality?: number;
  allowEditing?: boolean;
};

export function useCamera() {
  const ensurePermissions = async () => {
    if (!Capacitor.isNativePlatform()) return true;
    const perm = await Camera.checkPermissions();
    if (perm.camera !== "granted" || perm.photos !== "granted") {
      const req = await Camera.requestPermissions({ permissions: ["camera", "photos"] });
      return req.camera === "granted" && req.photos === "granted";
    }
    return true;
  };

  const takePhoto = async (opts: PickImageOptions = {}) => {
    const ok = await ensurePermissions();
    if (!ok) throw new Error("Kamera/galeri izni verilmedi");
    const photo = await Camera.getPhoto({
      source: CameraSource.Camera,
      resultType: CameraResultType.DataUrl,
      quality: opts.quality ?? 80,
      allowEditing: opts.allowEditing ?? false,
      saveToGallery: true,
    });
    return photo.dataUrl!;
  };

  const pickFromGallery = async (opts: PickImageOptions = {}) => {
    const ok = await ensurePermissions();
    if (!ok) throw new Error("Kamera/galeri izni verilmedi");
    const photo = await Camera.getPhoto({
      source: CameraSource.Photos,
      resultType: CameraResultType.DataUrl,
      quality: opts.quality ?? 80,
      allowEditing: opts.allowEditing ?? false,
    });
    return photo.dataUrl!;
  };

  const pickMultipleFromGallery = async (limit = 10) => {
    const ok = await ensurePermissions();
    if (!ok) throw new Error("Kamera/galeri izni verilmedi");
    const res = await Camera.pickImages({ limit, quality: 80 });
    return res.photos.map((p) => p.webPath || p.path || "");
  };

  return { takePhoto, pickFromGallery, pickMultipleFromGallery } as const;
}
