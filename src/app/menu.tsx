import { useAuth0 } from "react-native-auth0";
import { SafeAreaView } from "react-native-safe-area-context";
import { LogOut } from "lucide-react-native";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { theme } from "@/design/theme";

export default function Menu() {
  const { clearSession, user } = useAuth0();
  const displayName = user?.name ?? user?.email ?? "Your account";

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>menu</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.accountCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{displayName.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={styles.accountDetails}>
            <Text style={styles.accountLabel}>SIGNED IN AS</Text>
            <Text numberOfLines={1} style={styles.accountName}>
              {displayName}
            </Text>
          </View>
        </View>

        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Log out"
            onPress={() => clearSession()}
            style={({ pressed }) => [
              styles.signOutButton,
              pressed && styles.signOutButtonPressed,
            ]}
          >
            <LogOut color={theme.dangerColor} size={21} strokeWidth={2} />
            <Text style={styles.signOutText}>log out</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: theme.backgroundColor,
    flex: 1,
  },
  content: {
    paddingBottom: 36,
    paddingHorizontal: 24,
    paddingTop: 30,
  },
  header: {
    alignItems: "center",
    borderBottomColor: theme.borderColor,
    borderBottomWidth: 1,
    justifyContent: "center",
    minHeight: 58,
    paddingHorizontal: 24,
  },
  title: {
    color: theme.primaryTextColor,
    fontSize: 20,
    fontWeight: "600",
    letterSpacing: 0,
  },
  accountCard: {
    alignItems: "center",
    backgroundColor: theme.backgroundColor,
    borderColor: theme.borderColor,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    padding: 18,
  },
  avatar: {
    alignItems: "center",
    backgroundColor: "#e5efff",
    borderRadius: 25,
    height: 50,
    justifyContent: "center",
    width: 50,
  },
  avatarText: {
    color: "#2563eb",
    fontSize: 20,
    fontWeight: "700",
  },
  accountDetails: {
    flex: 1,
    marginLeft: 14,
  },
  accountLabel: {
    color: theme.secondaryTextColor,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.1,
    marginBottom: 4,
  },
  accountName: {
    color: theme.primaryTextColor,
    fontSize: 16,
    fontWeight: "600",
  },
  actions: {
    marginTop: 24,
  },
  signOutButton: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderColor: theme.borderColor,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    minHeight: 70,
    paddingHorizontal: 16,
  },
  signOutButtonPressed: {
    backgroundColor: theme.backgroundPressed,
  },
  signOutText: {
    color: theme.dangerColor,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 14,
  },
});