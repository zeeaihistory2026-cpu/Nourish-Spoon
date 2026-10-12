import React, { useEffect, useState } from "react";
import { updateProfile } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { AppNavigation } from "../../navigation/types";
import { firebaseAuth, db, saveCustomerProfile } from "../../services/firebase";
import { Page, Card, Copy, Field, Message, AccountGate } from "./components";
import { GreenButton } from "../../components/DesignPrimitives";
import { commerceError } from "./service";
export function EditProfileScreen({
  navigation,
}: {
  navigation: AppNavigation;
}) {
  const user = firebaseAuth?.currentUser;
  const [name, setName] = useState(user?.displayName || ""),
    [phone, setPhone] = useState(""),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false),
    [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    if (!db || !user) {
      setLoading(false);
      return;
    }
    getDoc(doc(db, "users", user.uid))
      .then((snapshot) => {
        if (active) setPhone(snapshot.data()?.phone || "");
      })
      .catch((error) => {
        if (active) setMessage(commerceError(error));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [user?.uid]);
  async function save() {
    if (busy || !user) return;
    if (
      !name.trim() ||
      (phone && !/^(?:\+?92|0)?3\d{9}$/.test(phone.replace(/[\s()-]/g, "")))
    ) {
      setMessage(
        "Enter your name and a valid Pakistani mobile number, or leave the number empty.",
      );
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      await saveCustomerProfile(
        user.uid,
        name.trim(),
        user.email || "",
        phone.trim(),
      );
      await updateProfile(user, { displayName: name.trim() });
      setMessage("Profile saved.");
    } catch (error) {
      setMessage(commerceError(error));
    } finally {
      setBusy(false);
    }
  }
  return (
    <Page
      title="Edit Profile"
      subtitle="Your details, kept up to date."
      back={navigation.goBack}
    >
      {!user ? (
        <AccountGate navigate={navigation.navigate} />
      ) : (
        <Card>
          {loading && <Copy>Loading your details…</Copy>}
          <Field
            label="Full name"
            value={name}
            onChangeText={setName}
            maxLength={80}
            autoComplete="name"
          />
          <Field
            label="Email address"
            value={user.email || ""}
            editable={false}
          />
          <Field
            label="Mobile number (optional)"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            autoComplete="tel"
            maxLength={30}
          />
          {!!message && <Message>{message}</Message>}
          <GreenButton
            title={busy ? "Saving…" : "Save Profile"}
            disabled={busy || loading}
            onPress={save}
          />
        </Card>
      )}
    </Page>
  );
}
