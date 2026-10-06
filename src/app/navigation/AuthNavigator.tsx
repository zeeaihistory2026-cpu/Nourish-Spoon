import { createNativeStackNavigator } from '@react-navigation/native-stack';

import type { AuthStackParamList } from './navigationTypes';
import { ForgotPasswordScreen } from '../../features/auth/screens/ForgotPasswordScreen';
import { LoginScreen } from '../../features/auth/screens/LoginScreen';
import { SignUpScreen } from '../../features/auth/screens/SignUpScreen';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();

export function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="SignUp" component={SignUpScreen} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </AuthStack.Navigator>
  );
}
