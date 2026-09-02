import { Stack } from "expo-router";
import { useEffect } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { Auth0Provider, useAuth0 } from "react-native-auth0";

export default function Layout() {
  return (
    <Auth0Provider
      domain="dev-7depnj7pxm3mr8iz.us.auth0.com"
      clientId="7UFjBQjLFsI5SrwF29TYb4beI9s1YOyL"
    >
      <AuthGuard />
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

  return <Stack />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
});
