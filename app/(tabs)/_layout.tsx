import { MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileHeader from '../components/ProfileHeader';

export default function TabLayout() {
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#FFFFFF" }}
      edges={["bottom"]}
    >
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#1976D2", // Material Blue for active tabs
          tabBarInactiveTintColor: "#90A4AE", // Light gray for inactive tabs
          tabBarStyle: {
            backgroundColor: "#FFFFFF", // Clean white background
            borderTopColor: "#E3F2FD", // Light blue border
            borderTopWidth: 1,
            paddingTop: 8,
            shadowColor: "#FFFFFF"
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "600",
            marginTop: 4,
          },
          headerStyle: {
            backgroundColor: "#FFFFFF", // Clean white header
            elevation: 4,
            shadowOpacity: 0.1,
          },
          headerTintColor: "#1976D2", // Blue header text
          headerTitleStyle: {
            fontWeight: "700",
            fontSize: 18,
          },
          headerRight: () => <ProfileHeader />,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="home" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="expenses"
          options={{
            title: "Expenses",
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="receipt-long" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="approvals"
          options={{
            title: "Approvals",
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="assignment" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="receipts"
          options={{
            title: "Receipts",
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="receipt" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}
