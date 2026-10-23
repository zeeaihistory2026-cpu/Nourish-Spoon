import { useState } from "react";
import type { OrderNotice } from "@packages/types/commerce";
import { AppNavigation } from "../../navigation/types";
import { useNotificationInbox } from "./NotificationInbox";
import { useAccountData } from "./useAccountData";
import {
  markNotice,
  markNoticesRead,
  watchOrders,
  commerceError,
} from "./service";
import { notificationOrder } from "./notificationPresentation";
import { NotificationInboxView } from "./NotificationInboxView";

export function NotificationsScreen({
  navigation,
}: {
  navigation: AppNavigation;
}) {
  const inbox = useNotificationInbox();
  const orders = useAccountData(watchOrders);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const order = notificationOrder(inbox.items, orders.items);

  async function markAll() {
    if (busy || !inbox.unreadCount) return;
    setBusy("all");
    setMessage("");
    try {
      await markNoticesRead(
        inbox.items.filter((item) => !item.read).map((item) => item.id),
      );
    } catch (error) {
      setMessage(commerceError(error));
    } finally {
      setBusy(null);
    }
  }
  async function openNotice(notice: OrderNotice) {
    if (busy) return;
    setBusy(notice.id);
    setMessage("");
    try {
      if (!notice.read) await markNotice(notice.id);
      if (notice.order_id)
        navigation.navigate("OrderDetails", { orderId: notice.order_id });
    } catch (error) {
      setMessage(commerceError(error));
    } finally {
      setBusy(null);
    }
  }
  async function openOrder() {
    if (!order || busy) return;
    setBusy("order");
    setMessage("");
    try {
      await markNoticesRead(
        inbox.items
          .filter((item) => item.order_id === order.id && !item.read)
          .map((item) => item.id),
      );
      navigation.navigate("OrderDetails", { orderId: order.id });
    } catch (error) {
      setMessage(commerceError(error));
    } finally {
      setBusy(null);
    }
  }

  return (
    <NotificationInboxView
      navigation={navigation}
      signedIn={!!inbox.user}
      notices={inbox.items}
      order={order}
      orders={orders.items}
      unreadCount={inbox.unreadCount}
      loading={inbox.loading}
      orderLoading={orders.loading}
      error={inbox.error || orders.error || message}
      busy={busy}
      onMarkAll={markAll}
      onOpenNotice={openNotice}
      onOpenOrder={openOrder}
    />
  );
}
