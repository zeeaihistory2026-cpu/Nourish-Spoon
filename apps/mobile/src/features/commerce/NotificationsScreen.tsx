import { AppNavigation } from "../../navigation/types";
import { useState } from "react";
import { Page, Card, Heading, Copy, Message, AccountGate } from "./components";
import { GreenButton } from "../../components/DesignPrimitives";
import { useNotificationInbox } from "./NotificationInbox";
import { markNotice, commerceError } from "./service";
export function NotificationsScreen({
  navigation,
}: {
  navigation: AppNavigation;
}) {
  const { user, items, error, loading } = useNotificationInbox(),
    [message, setMessage] = useState("");
  return (
    <Page title="Notifications" back={navigation.goBack}>
      {!user ? (
        <AccountGate navigate={navigation.navigate} />
      ) : (
        <>
          {!!error && <Message>{error}</Message>}
          {!!message && <Message>{message}</Message>}
          {loading && <Copy>Loading updates…</Copy>}
          {!error && !loading && !items.length && (
            <Card>
              <Heading>You’re all caught up</Heading>
              <Copy>Order and payment updates will appear here.</Copy>
            </Card>
          )}
          {items.map((notice) => (
            <Card key={notice.id}>
              <Heading>
                {notice.read ? "" : "• "}
                {notice.title}
              </Heading>
              <Copy>{notice.body}</Copy>
              <Copy>{new Date(notice.created_at).toLocaleString()}</Copy>
              <GreenButton
                title={
                  notice.order_id
                    ? "View Order"
                    : notice.read
                      ? "Read"
                      : "Mark as read"
                }
                disabled={!notice.order_id && notice.read}
                onPress={async () => {
                  try {
                    await markNotice(notice.id);
                    if (notice.order_id)
                      navigation.navigate("OrderDetails", {
                        orderId: notice.order_id,
                      });
                  } catch (error) {
                    setMessage(commerceError(error));
                  }
                }}
              />
            </Card>
          ))}
        </>
      )}
    </Page>
  );
}
