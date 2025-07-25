import { Stack } from "expo-router";
import { StyleSheet } from 'react-native';
import { MD3LightTheme, PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Custom business theme with blue color scheme
const businessTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#1976D2',        // Material Blue
    primaryContainer: '#2196F3', // Lighter Blue
    secondary: '#1565C0',      // Dark Blue
    secondaryContainer: '#42A5F5', // Light Blue
    tertiary: '#0D47A1',       // Deep Blue
    surface: '#FAFBFC',        // Very light gray
    surfaceVariant: '#F5F7FA', // Light blue-gray background
    background: '#FFFFFF',     // Clean white
    outline: '#E3F2FD',        // Light blue border
    onPrimary: '#FFFFFF',      // White text on primary
    onSecondary: '#FFFFFF',    // White text on secondary
    onSurface: '#1976D2',      // Blue text on surface
    onBackground: '#1976D2',   // Blue text on background
  },
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});

export default function RootLayout() {
  return (
    <SafeAreaProvider style={styles.safeArea}>
      <PaperProvider theme={businessTheme}>
        <Stack>
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
