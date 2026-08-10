import { Text, View, StyleSheet } from "react-native";

export default function Menu() {\
      // auth0provider, apiprovider, and queryclientprovider can be used in mobile as well
      // routing, component library, and my routing auth guard need to be different
  return (
    <View style={styles.container}>
      <Text>Menu</Text>
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
