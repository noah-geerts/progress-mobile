import { Stack } from "expo-router";
import { useAuth0, Auth0Provider } from "react-native-auth0";

export default function Layout() {
  const {user} = useAuth0();
  return (
    <Auth0Provider
      domain="dev-7depnj7pxm3mr8iz.us.auth0.com"
      clientId="7UFjBQjLFsI5SrwF29TYb4beI9s1YOyL"
    >
      <Stack>
        <Stack.Protected guard={!!user}>
          <Stack.Screen name="(authenticated)" />
        </Stack.Protected>
        <Stack.Screen name="index" />
      </Stack>
    </Auth0Provider>
  );
}
