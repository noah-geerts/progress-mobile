import { Text, View, StyleSheet, TextInput } from "react-native";

export default function Dashboard() {
  return (
    <View style={styles.container}>
      <Text>
        Logged In
      </Text>
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
