import React, { useState } from 'react';
import { View, ScrollView, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { Text, Botanical, Brand, ART, GreenButton } from '../components/DesignPrimitives';
import { useMobileStore } from '../services/storeService';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

WebBrowser.maybeCompleteAuthSession();
export function AuthScreen({ signup = false, onBack, onSwitch, onSuccess }: { signup?: boolean; onBack: () => void; onSwitch: () => void; onSuccess: () => void }) {
  const { theme: c } = useMobileStore();
  const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [phone, setPhone] = useState('');
  const [password, setPassword] = useState(''); const [confirm, setConfirm] = useState('');
  const [visible, setVisible] = useState(false); const [confirmVisible, setConfirmVisible] = useState(false);
  const [busy, setBusy] = useState(false); const [message, setMessage] = useState('');
  const configured = () => { if (!isSupabaseConfigured) { setMessage('Account services are not configured yet. You can still browse and order as a guest.'); return false; } return true; };
  const submit = async () => {
    setMessage('');
    if (!email.trim() || !password || (signup && (!name.trim() || !phone.trim()))) { setMessage('Please complete all required fields.'); return; }
    if (signup && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setMessage('Please enter a valid email address.'); return; }
    if (signup && (password.length < 8 || password !== confirm)) { setMessage('Use at least 8 characters and make sure both passwords match.'); return; }
    if (!configured()) return;
    setBusy(true);
    try {
      if (signup) {
        const { data, error } = await supabase.auth.signUp({ email: email.trim(), password, options: { data: { full_name: name.trim(), phone: phone.trim() } } });
        if (error) throw error;
        if (data.session) onSuccess(); else setMessage('Check your email to confirm your account, then sign in.');
      } else {
        const credentials = email.includes('@') ? { email: email.trim(), password } : { phone: email.replace(/[^+0-9]/g, ''), password };
        const { error } = await supabase.auth.signInWithPassword(credentials);
        if (error) throw error;
        onSuccess();
      }
    } catch (error: any) { setMessage(error.message || 'Could not connect. Please try again.'); } finally { setBusy(false); }
  };
  const reset = async () => {
    if (!email.includes('@')) { setMessage('Enter your email address above to receive a password reset link.'); return; }
    if (!configured()) return;
    setBusy(true);
    try { const { error } = await supabase.auth.resetPasswordForEmail(email.trim()); if (error) throw error; setMessage('Check your email for a password reset link.'); } catch (e: any) { setMessage(e.message); } finally { setBusy(false); }
  };
  const oauth = async (provider: 'google' | 'apple') => {
    if (!configured()) return;
    setBusy(true); setMessage('');
    try {
      const redirectTo = Linking.createURL('auth/callback');
      const { data, error } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo, skipBrowserRedirect: true } });
      if (error) throw error;
      if (data.url) {
        if (Platform.OS === 'web') { await Linking.openURL(data.url); return; }
        const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
        if (result.type === 'success') {
          const params = new URLSearchParams(result.url.split('#')[1] || result.url.split('?')[1]);
          if (params.get('error_description')) throw new Error(params.get('error_description')!);
          const access_token = params.get('access_token'); const refresh_token = params.get('refresh_token');
          if (access_token && refresh_token) { const { error } = await supabase.auth.setSession({ access_token, refresh_token }); if (error) throw error; onSuccess(); }
        }
      }
    } catch (e: any) { setMessage(e.message); } finally { setBusy(false); }
  };
  const field = (label: string, placeholder: string, value: string, change: (v: string) => void, icon: any, secure = false, show = false, toggle?: () => void) => <View key={label} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: c.surface, borderColor: c.border, borderWidth: 1, borderRadius: 14, minHeight: 54, paddingHorizontal: 14, marginBottom: 9, gap: 14 }}>
    <Ionicons name={icon} size={23} color={c.primary} /><View style={{ flex: 1 }}>{signup && <Text style={{ fontSize: 12, fontWeight: '700', color: c.text, marginBottom: 2 }}>{label}</Text>}<TextInput accessibilityLabel={label} value={value} onChangeText={change} placeholder={placeholder} placeholderTextColor={c.textMuted} secureTextEntry={secure && !show} autoCapitalize={label.includes('Name') ? 'words' : 'none'} autoComplete={label === 'Email Address' ? 'email' : label === 'Password' ? (signup ? 'new-password' : 'current-password') : 'off'} keyboardType={label.includes('Phone') && signup ? 'phone-pad' : label.includes('Email') ? 'email-address' : 'default'} style={{ fontFamily: 'Lato_400Regular', color: c.text, fontSize: 14, paddingVertical: 5 }} /></View>{secure && <TouchableOpacity accessibilityLabel={show ? 'Hide password' : 'Show password'} onPress={toggle}><Ionicons name={show ? 'eye-outline' : 'eye-off-outline'} size={21} color={c.textSecondary} /></TouchableOpacity>}
  </View>;
  return <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: c.background }}><Botanical full />
    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingTop: 16, flexGrow: 1 }}>
      <TouchableOpacity accessibilityLabel="Go back" onPress={onBack} style={{ position: 'absolute', left: 16, top: 16, backgroundColor: c.surface, width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', zIndex: 2 }}><Ionicons name="chevron-back" size={25} color={c.primary} /></TouchableOpacity>
      <Brand large />
      <Text style={{ fontFamily: 'serif', fontWeight: '700', textAlign: 'center', color: c.primary, fontSize: signup ? 25 : 32, marginTop: 25, marginBottom: 9 }}>{signup ? 'Create Your Account' : 'Welcome Back'}</Text>
      <Text style={{ color: c.textSecondary, textAlign: 'center', fontSize: 14, lineHeight: 20, paddingHorizontal: 36, marginBottom: 18 }}>{signup ? 'Join Nourish Spoon and start your journey towards healthier, happier tomorrows.' : 'Sign in to continue your journey towards a healthier, happier you.'}</Text>
      <View style={{ paddingHorizontal: 24 }}>
        {signup && field('Full Name', 'Enter your full name', name, setName, 'person-outline')}
        {field(signup ? 'Email Address' : 'Email or Phone Number', signup ? 'Enter your email address' : 'Email or Phone Number', email, setEmail, 'mail-outline')}
        {signup && field('Phone Number', 'Enter your phone number', phone, setPhone, 'call-outline')}
        {field('Password', signup ? 'Create a password' : 'Password', password, setPassword, 'lock-closed-outline', true, visible, () => setVisible(!visible))}
        {signup && field('Confirm Password', 'Re-enter your password', confirm, setConfirm, 'lock-closed-outline', true, confirmVisible, () => setConfirmVisible(!confirmVisible))}
        {!signup && <TouchableOpacity onPress={reset} style={{ alignSelf: 'flex-end', paddingBottom: 14 }}><Text style={{ color: c.primary, textDecorationLine: 'underline' }}>Forgot Password?</Text></TouchableOpacity>}
        {!!message && <Text accessibilityRole="alert" style={{ color: c.text, fontSize: 13, lineHeight: 19, marginBottom: 12 }}>{message}</Text>}
        <GreenButton title={busy ? 'Please wait…' : signup ? 'Create Account' : 'Sign In'} onPress={submit} disabled={busy} />
        {!signup && <><View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 18 }}><View style={{ flex: 1, height: 1, backgroundColor: c.border }} /><Text style={{ color: c.textSecondary }}>or continue with</Text><View style={{ flex: 1, height: 1, backgroundColor: c.border }} /></View><View style={{ flexDirection: 'row', gap: 8 }}>{(['google','apple'] as const).map(p => <TouchableOpacity key={p} disabled={busy} onPress={() => oauth(p)} style={{ flex: 1, minHeight: 44, borderRadius: 24, borderWidth: 1, borderColor: c.border, backgroundColor: c.surface, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 }}><FontAwesome name={p === 'google' ? 'google' : 'apple'} size={21} color={p === 'google' ? '#4285F4' : c.text} /><Text style={{ color: c.text, fontSize: 11 }}>Continue with {p === 'google' ? 'Google' : 'Apple'}</Text></TouchableOpacity>)}</View></>}
        {signup && <Text style={{ fontSize: 11, lineHeight: 17, color: c.textSecondary, textAlign: 'center', marginTop: 12 }}>By creating an account, you agree to our{'\n'}<Text onPress={() => Alert.alert('Terms & Privacy', 'Account details are used to manage your Nourish Spoon account. Order details are sent to Nourish Spoon through WhatsApp for confirmation. Contact info@nourishspoon.com for account or privacy requests.')} style={{ color: c.primary, textDecorationLine: 'underline' }}>Terms & Conditions and Privacy Policy.</Text></Text>}
        <TouchableOpacity onPress={onSwitch} style={{ alignItems: 'center', paddingVertical: 18 }}><Text style={{ fontSize: 13, color: c.textSecondary }}>{signup ? 'Already have an account? ' : 'Don’t have an account? '}<Text style={{ color: c.primary, fontWeight: '700', textDecorationLine: 'underline' }}>{signup ? 'Sign In' : 'Sign Up'}</Text></Text></TouchableOpacity>
        <TouchableOpacity onPress={onBack} style={{ alignItems: 'center', paddingBottom: 12 }}><Text style={{ color: c.primary, fontSize: 12 }}>Continue as guest</Text></TouchableOpacity>
      </View>
      <Image source={ART.login} style={{ width: '100%', aspectRatio: 2.76 }} resizeMode="cover" />
    </ScrollView>
  </KeyboardAvoidingView>;
}
