import { Text, View, StyleSheet, Button } from "react-native";
import { useAuth0 } from "react-native-auth0";

export default function Index() {
  const { clearSession } = useAuth0();

  return (
    <View style={styles.container}>
      <Text>Logged In</Text>
      <Button title="Log Out" onPress={() => clearSession()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
});
