import { createContext, PropsWithChildren, useContext } from "react";
import { OrderNotice } from "@packages/types/commerce";
import { useAccountData } from "./useAccountData";
import { watchNotices } from "./service";

type Inbox = ReturnType<typeof useAccountData<OrderNotice>> & {
  unreadCount: number;
};
const InboxContext = createContext<Inbox | null>(null);

/** One account-scoped live subscription shared by the inbox and its indicators. */
export function NotificationInboxProvider({ children }: PropsWithChildren) {
  const inbox = useAccountData(watchNotices);
  const unreadCount = inbox.items.filter((notice) => !notice.read).length;
  return (
    <InboxContext.Provider value={{ ...inbox, unreadCount }}>
      {children}
    </InboxContext.Provider>
  );
}

export function useNotificationInbox() {
  const inbox = useContext(InboxContext);
  if (!inbox) throw new Error("Notification inbox provider is missing.");
  return inbox;
}
