import { Redirect } from "expo-router";
import { useState } from "react";
import { Text, View, StyleSheet, TextInput, Button } from "react-native";
import { useAuth0 } from "react-native-auth0";

export default function Dashboard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { authorize, user } = useAuth0();

  if(!!user) {
    return <Redirect href="/(authenticated)/index"/>
  }

  return (
    <View style={styles.container}>
      <Text>Logged out</Text>
      <View style={{ flexDirection: "column", gap: 10 }}>
        <TextInput
          style={{ fontSize: 24 }}
          placeholder="email"
          value={email}
          onChangeText={(t) => setEmail(t)}
        />
        <TextInput
          style={{ fontSize: 24 }}
          placeholder="password"
          value={password}
          onChangeText={(t) => setPassword(t)}
        />
        <Button title="Log in" onPress={() => authorize()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
