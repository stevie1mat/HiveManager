import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import { useAuth } from '../../context/AuthContext';
import { FONTS } from '../../constants/fonts';

const GoogleLogo = ({ size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M22.578 12.27c0-.79-.07-1.54-.2-2.27h-9.88v4.28h5.69c-.24 1.39-.99 2.58-2.07 3.39v2.78h3.57c2.08-1.92 3.28-4.74 3.28-8.18z"
      fill="#4285F4"
    />
    <Path
      d="M12.498 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.78c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.28-1.93-6.14-4.53h-3.67v2.87c1.82 3.6 5.5 6.02 9.81 6.02z"
      fill="#34A853"
    />
    <Path
      d="M6.358 14.05c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.01h-3.67c-.73 1.45-1.16 3.09-1.16 4.86s.43 3.41 1.16 4.86l3.67-2.88z"
      fill="#FBBC05"
    />
    <Path
      d="M12.498 5.48c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.948 2.1 15.458 1 12.498 1 8.188 1 4.518 3.42 2.698 7.01l3.67 2.86c.86-2.6 3.28-4.53 6.13-4.53z"
      fill="#EA4335"
    />
  </Svg>
);

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (!result.success) {
      Alert.alert('Login Failed', result.error);
    }
  };

  const handleGoogleLogin = () => {
    Alert.alert('Google Login', 'Google login functionality would be implemented here');
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <Text style={styles.logo}>🐝</Text>
              </View>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>Sign in to manage your hives.</Text>
              </View>
            </View>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="mail-outline" size={20} color="#9c8749" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="you@example.com"
                    placeholderTextColor="#9c8749"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="lock-closed-outline" size={20} color="#9c8749" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor="#9c8749"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons
                      name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                      size={20}
                      color="#9c8749"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => Alert.alert('Forgot Password', 'Password reset functionality would be implemented here')}
                style={styles.forgotPassword}
              >
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              <View style={styles.buttonGroup}>
                <TouchableOpacity
                  style={[styles.button, loading && styles.buttonDisabled]}
                  onPress={handleLogin}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Log In'}</Text>
                </TouchableOpacity>

                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>OR</Text>
                  <View style={styles.dividerLine} />
                </View>

                <TouchableOpacity
                  style={styles.googleButton}
                  onPress={handleGoogleLogin}
                >
                  <GoogleLogo size={20} />
                  <Text style={styles.googleButtonText}>Continue with Google</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.registerContainer}>
                <Text style={styles.registerText}>
                  Don't have an account?{' '}
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                  <Text style={styles.registerLink}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f5',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    minHeight: '100%',
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    width: 96,
    height: 96,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: 80,
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    fontFamily: FONTS.heading,
    color: '#1c180d',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: FONTS.body,
    color: 'rgba(28, 24, 13, 0.7)',
    paddingTop: 4,
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontFamily: FONTS.bodyMedium,
    color: '#1c180d',
    paddingBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#e8e2ce',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
  },
  inputIcon: {
    marginRight: 12,
    width: 20,
    height: 20,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: FONTS.body,
    color: '#1c180d',
    padding: 0,
  },
  eyeIcon: {
    padding: 4,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 4,
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#f4c025',
    fontSize: 14,
    fontFamily: FONTS.bodyMedium,
  },
  buttonGroup: {
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#f4c025',
    borderRadius: 8,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#1c180d',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: FONTS.bodyBold,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e8e2ce',
  },
  dividerText: {
    marginHorizontal: 8,
    color: 'rgba(28, 24, 13, 0.7)',
    fontSize: 14,
    fontFamily: FONTS.body,
    backgroundColor: '#f8f8f5',
    paddingHorizontal: 8,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#e8e2ce',
    borderRadius: 8,
    height: 48,
    marginTop: 24,
  },
  googleButtonText: {
    color: '#1c180d',
    fontSize: 16,
    fontFamily: FONTS.bodyMedium,
    marginLeft: 12,
  },
  registerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  registerText: {
    fontSize: 14,
    fontFamily: FONTS.body,
    color: 'rgba(28, 24, 13, 0.7)',
    textAlign: 'center',
  },
  registerLink: {
    color: '#f4c025',
    fontWeight: '600',
    fontFamily: FONTS.bodyBold,
  },
});

export default LoginScreen;

