import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Card, Title, Paragraph, Divider } from 'react-native-paper';
import { router } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    
    // Simulate login API call
    setTimeout(() => {
      setLoading(false);
      // For demo purposes, accept any email/password
      if (email && password) {
        // Direct navigation without alert
        router.replace('/(tabs)');
      } else {
        Alert.alert('Error', 'Invalid credentials');
      }
    }, 1000);
  };

  const handleDemoLogin = () => {
    setEmail('demo@company.com');
    setPassword('demo123');
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>EMS Login</Title>
          <Paragraph style={styles.subtitle}>Expense Management System</Paragraph>
          
          <Divider style={styles.divider} />
          
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            left={<TextInput.Icon icon="email" />}
          />
          
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            secureTextEntry
            style={styles.input}
            left={<TextInput.Icon icon="lock" />}
          />
          
          <Button
            mode="contained"
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
            style={styles.loginButton}
            icon="login"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
          
          <Divider style={styles.divider} />
          
          <Button
            mode="outlined"
            onPress={handleDemoLogin}
            style={styles.demoButton}
            icon="account-circle"
          >
            Use Demo Account
          </Button>
          
          <Paragraph style={styles.demoInfo}>
            Demo credentials: demo@company.com / demo123
          </Paragraph>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#F5F7FA', // Light blue business background
  },
  card: {
    elevation: 8,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#1976D2',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  title: {
    textAlign: 'center',
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
    color: '#1976D2', // 保持主题色强调
    letterSpacing: -0.5,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 16,
    color: '#90A4AE',
    marginBottom: 24,
    fontWeight: '400',
  },
  divider: {
    marginVertical: 24,
    backgroundColor: '#E3F2FD',
  },
  input: {
    marginBottom: 20,
    backgroundColor: '#F5F7FA',
  },
  loginButton: {
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 12,
  },
  demoButton: {
    marginTop: 12,
    borderRadius: 12,
    borderColor: '#90A4AE',
  },
  demoInfo: {
    textAlign: 'center',
    fontSize: 13,
    color: '#B0BEC5',
    marginTop: 16,
    fontStyle: 'italic',
    lineHeight: 18,
  },
});