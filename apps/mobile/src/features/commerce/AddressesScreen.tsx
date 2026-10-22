import { AppNavigation } from "../../navigation/types";
import { useFormValidation } from "../../hooks/useFormValidation";
import { useState } from "react";
import { GreenButton } from "../../components/DesignPrimitives";
import {
  Page,
  Card,
  Heading,
  Copy,
  Field,
  Message,
  AccountGate,
} from "./components";
import {
  watchAddresses,
  saveAddress,
  removeAddress,
  commerceError,
} from "./service";
import { addressErrors } from "./validateFields";
import { useAccountData } from "./useAccountData";
export function AddressesScreen({ navigation }: { navigation: AppNavigation }) {
  const { user, items, error, loading } = useAccountData(watchAddresses);
  const [label, setLabel] = useState("Home"),
    [name, setName] = useState(""),
    [phone, setPhone] = useState(""),
    [city, setCity] = useState(""),
    [line, setLine] = useState("");
  const [editing, setEditing] = useState<string | undefined>(),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  const form = useFormValidation();
  async function save() {
    if (busy) return;
    if (!form.validate(addressErrors({ label, name, phone, city, line }))) {
      setMessage("");
      return;
    }
    setBusy(true);
    try {
      await saveAddress(
        {
          label: label.trim(),
          name: name.trim(),
          phone: phone.trim(),
          city: city.trim(),
          line: line.trim(),
        },
        editing,
      );
      setEditing(undefined);
      setName("");
      setPhone("");
      setCity("");
      setLine("");
      setMessage("Address saved.");
    } catch (error) {
      setMessage(commerceError(error));
    } finally {
      setBusy(false);
    }
  }
  return (
    <Page
      validationTick={form.validationTick}
      title="Saved Addresses"
      back={navigation.goBack}
    >
      {!user ? (
        <AccountGate navigate={navigation.navigate} />
      ) : (
        <>
          {!!error && <Message>{error}</Message>}
          {loading && <Copy>Loading addresses…</Copy>}
          {items.map((address) => (
            <Card key={address.id}>
              <Heading>{address.label}</Heading>
              <Copy>
                {address.name} · {address.phone}
                {"\n"}
                {address.line}, {address.city}
              </Copy>
              <GreenButton
                title="Edit Address"
                disabled={busy}
                onPress={() => {
                  form.reset();
                  setEditing(address.id);
                  setLabel(address.label);
                  setName(address.name);
                  setPhone(address.phone);
                  setCity(address.city);
                  setLine(address.line);
                }}
              />
              <GreenButton
                title="Remove Address"
                disabled={busy}
                onPress={async () => {
                  setBusy(true);
                  try {
                    await removeAddress(address.id);
                    setMessage("Address removed.");
                  } catch (error) {
                    setMessage(commerceError(error));
                  } finally {
                    setBusy(false);
                  }
                }}
              />
            </Card>
          ))}
          <Card>
            <Heading>{editing ? "Edit address" : "Add an address"}</Heading>
            <Field
              label="Address label"
              value={label}
              {...form.bind("label", setLabel)}
              maxLength={40}
            />
            <Field
              label="Full name"
              value={name}
              {...form.bind("name", setName)}
              maxLength={80}
            />
            <Field
              label="Mobile number"
              value={phone}
              {...form.bind("phone", setPhone)}
              keyboardType="phone-pad"
              maxLength={30}
            />
            <Field
              label="City"
              placeholder="Enter any city"
              value={city}
              {...form.bind("city", setCity)}
              maxLength={80}
            />
            <Field
              label="Street address"
              value={line}
              {...form.bind("line", setLine)}
              multiline
              maxLength={300}
            />
            {!!message && <Message>{message}</Message>}
            <GreenButton
              title={busy ? "Saving…" : "Save Address"}
              disabled={busy}
              onPress={save}
            />
          </Card>
        </>
      )}
    </Page>
  );
}
