import { useFormValidation } from "../../hooks/useFormValidation";
import React, { useEffect, useRef, useState } from "react";
import { View, useWindowDimensions } from "react-native";
import { updateProfile } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { AppNavigation, RouteParams } from "../../navigation/types";
import { firebaseAuth, db, saveCustomerProfile } from "../../services/firebase";
import { Page, Card, Copy, Field, AccountGate } from "./components";
import { GreenButton } from "../../components/DesignPrimitives";
import { useInfoDialog } from "../../components/InfoDialog";
import { commerceError } from "./service";
export function EditProfileScreen({
  navigation,
  initialProfile,
}: {
  navigation: AppNavigation;
  initialProfile?: RouteParams["profile"];
}) {
  const { fontScale } = useWindowDimensions();
  const user = firebaseAuth?.currentUser;
  const cached = initialProfile?.uid === user?.uid ? initialProfile : undefined;
  const [name, setName] = useState(cached?.fullName || user?.displayName || "");
  const [phone, setPhone] = useState(cached?.phone || "");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(cached?.phone === undefined);
  const phoneEdited = useRef(false);
  const { showInfo, dialog } = useInfoDialog();
  useEffect(() => {
    // More already has a live account snapshot. Reuse it rather than repeat a slow read.
    if (cached?.phone !== undefined || !db || !user) {
      setLoading(false);
      return;
    }
    let active = true;
    getDoc(doc(db, "users", user.uid))
      .then((snapshot) => {
        // A delayed response must never replace a number the customer typed or cleared.
        if (active && !phoneEdited.current)
          setPhone(snapshot.data()?.phone || "");
      })
      .catch(() => {
        if (active) setStatus("Number unavailable.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [user?.uid]);
  const form = useFormValidation();
  async function save() {
    if (busy || !user) return;
    const cleanPhone = phone.trim();
    const errors: Record<string, string> = {};
    if (!name.trim()) errors.name = "Enter your full name.";
    if (
      phoneEdited.current &&
      cleanPhone &&
      !/^(?:\+?92|0)?3\d{9}$/.test(cleanPhone.replace(/[\s()-]/g, ""))
    )
      errors.phone = "Enter a valid Pakistani mobile number.";
    if (!form.validate(errors)) return;
    setBusy(true);
    setStatus("");
    try {
      // Omit an untouched phone so a save during loading cannot erase its server value.
      await saveCustomerProfile(
        user.uid,
        name.trim(),
        user.email || "",
        phoneEdited.current ? cleanPhone : undefined,
      );
      await updateProfile(user, { displayName: name.trim() });
      setStatus("Profile saved.");
    } catch (error) {
      showInfo("Unable to save profile", commerceError(error));
    } finally {
      setBusy(false);
    }
  }
  return (
    <Page
      validationTick={form.validationTick}
      title="Edit Profile"
      subtitle="Your details, kept up to date."
      back={navigation.goBack}
    >
      {dialog}
      {!user ? (
        <AccountGate navigate={navigation.navigate} />
      ) : (
        <Card>
          <Field
            label="Full name"
            value={name}
            {...form.bind("name", setName)}
            icon="create-outline"
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
            error={form.errors.phone}
            validationTick={form.validationTick}
            onChangeText={(value) => {
              form.clear("phone");
              phoneEdited.current = true;
              setPhone(value);
              setStatus("");
            }}
            keyboardType="phone-pad"
            autoComplete="tel"
            maxLength={30}
          />
          <View
            style={{
              height: Math.ceil(42 * fontScale),
              justifyContent: "center",
            }}
          >
            <Copy>
              {status || (loading ? "Loading number…" : "Number is optional.")}
            </Copy>
          </View>
          <GreenButton
            title={busy ? "Saving…" : "Save Profile"}
            disabled={busy}
            onPress={save}
          />
        </Card>
      )}
    </Page>
  );
}
