import ApiProvider from "@/components/ApiProvider";
import { Tabs } from "expo-router";
import { useEffect } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { Auth0Provider, useAuth0 } from "react-native-auth0";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

// Tanstack Query Client
const queryClient = new QueryClient();

export default function Layout() {
  return (
    <Auth0Provider
      domain="dev-7depnj7pxm3mr8iz.us.auth0.com"
      clientId="7UFjBQjLFsI5SrwF29TYb4beI9s1YOyL"
    >
      <ApiProvider>
        <QueryClientProvider client={queryClient}>
          <SafeAreaProvider>
            <StatusBar style="dark" />
            <AuthGuard />
          </SafeAreaProvider>
        </QueryClientProvider>
      </ApiProvider>
    </Auth0Provider>
  );
}

function AuthGuard() {
  const { authorize, isLoading, hasValidCredentials, user } = useAuth0();

  // Force login if user becomes logged out
  useEffect(() => {
    async function checkIfAuthenticated() {
      const isAuthenticated = await hasValidCredentials();
      if (!isAuthenticated) {
        authorize();
      }
    }

    checkIfAuthenticated();
  }, [user]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={{ height: 200 }} />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <View style={{ height: 200 }} />
        <Text>Welcome to Progress</Text>
        <Button title="Log in" onPress={() => authorize()} />
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#1f6f5b",
        tabBarInactiveTintColor: "#8b9691",
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Log", tabBarLabel: "Log" }} />
      <Tabs.Screen
        name="menu"
        options={{ title: "Menu", tabBarLabel: "Menu" }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  tabBar: {
    backgroundColor: "#ffffff",
    borderTopColor: "#e7ece9",
    borderTopWidth: 1,
    height: 68,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: "600",
  },
});
