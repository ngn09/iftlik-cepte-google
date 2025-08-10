import { useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";
import {
  PushNotifications,
  type PermissionStatus,
  type Token,
  PushNotificationSchema,
} from "@capacitor/push-notifications";
import { useToast } from "@/components/ui/use-toast";

export function usePushNotifications() {
  const { toast } = useToast();
  const [permission, setPermission] = useState<PermissionStatus["receive"]>(
    "prompt"
  );
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    let mounted = true;

    (async () => {
      try {
        const status = await PushNotifications.checkPermissions();
        let receive = status.receive;
        if (receive !== "granted") {
          const req = await PushNotifications.requestPermissions();
          receive = req.receive;
        }
        if (!mounted) return;
        setPermission(receive);

        if (receive === "granted") {
          await PushNotifications.register();
        }
      } catch (e) {
        console.error("Push permission error", e);
        toast({
          title: "Bildirim izni başarısız",
          description: "Cihaz bildirim izni veremedi.",
          variant: "destructive",
        });
      }
    })();

    const reg = PushNotifications.addListener(
      "registration",
      (t: Token) => {
        setToken(t.value);
        console.log("Push token:", t.value);
        toast({ title: "Bildirimlere kaydedildi" });
      }
    );

    const regErr = PushNotifications.addListener(
      "registrationError",
      (error) => {
        console.error(error);
        toast({
          title: "Bildirim kayıt hatası",
          description: "Ayarlarınızı kontrol edin.",
          variant: "destructive",
        });
      }
    );

    const received = PushNotifications.addListener(
      "pushNotificationReceived",
      (notification: PushNotificationSchema) => {
        toast({
          title: notification.title ?? "Yeni bildirim",
          description: notification.body ?? "",
        });
      }
    );

    return () => {
      mounted = false;
      reg.then((l) => l.remove());
      regErr.then((l) => l.remove());
      received.then((l) => l.remove());
    };
  }, [toast]);

  return { permission, token } as const;
}
