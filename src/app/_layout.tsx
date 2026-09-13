import ApiProvider from "@/hooks/ApiProvider";
import { Tabs } from "expo-router";
import { Fragment, useEffect } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { Auth0Provider, useAuth0 } from "react-native-auth0";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { NavBar } from "@/components/NavBar";
import { theme } from "@/design/theme";
import PanelHost from "@/design/components/PanelHost";
import PanelProvider from "@/design/hooks/PanelProvider";
import CurrentDayProvider from "@/hooks/CurrentDayProvider";

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
            <CurrentDayProvider>
              <PanelProvider>
                <StatusBar style="dark" />
                <AuthGuard />
              </PanelProvider>
            </CurrentDayProvider>
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
        authorize({
          audience: "http://localhost:3000"
        });
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
    <Fragment>
    <PanelHost/>
    <Tabs
      tabBar={() => <NavBar />}
      screenOptions={{
        headerShown: false,
      }}
    />
    </Fragment>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.backgroundColor,
    alignItems: "center",
    justifyContent: "flex-start",
  },
});
