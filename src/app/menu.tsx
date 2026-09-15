import { useAuth0 } from "react-native-auth0";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { LogOut, User } from "lucide-react-native";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { theme } from "@/design/theme";
import Header from "@/components/Header";

export default function Menu() {
  const { clearSession, user } = useAuth0();
  const displayName = user?.name ?? user?.email ?? "Your account";
  const insets = useSafeAreaInsets();
  const topBuffer = insets.top + 20;
  const bottomBuffer = insets.bottom + 50;

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header>
        <Text style={styles.title}>menu</Text>
      </Header>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: topBuffer, paddingBottom: bottomBuffer }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionHeader}>Account</Text>
        <View style={[styles.option, styles.account]}>
          <User size={21} strokeWidth={2} />
          <View>
            <Text style={styles.accountLabel}>Signed in as</Text>
            <Text numberOfLines={1} style={styles.accountName}>
              {displayName}
            </Text>
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Log out"
          onPress={() => clearSession()}
          style={({ pressed }) => [styles.option, pressed && styles.optionPressed]}
        >
          <LogOut color={theme.dangerColor} size={21} strokeWidth={2} />
          <Text style={styles.signOutText}>log out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    color: theme.primaryTextColor,
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0,
    lineHeight: 24,
    textAlign: "center",
  },
  safeArea: {
    backgroundColor: theme.backgroundColor,
    flex: 1,
  },
  content: {
    flex: 1,
    gap: 12,
  },
  sectionHeader: {
    color: theme.secondaryTextColor,
    fontWeight: 700,
    paddingLeft: 24,
  },
  option: {
    alignItems: "center",
    flexDirection: "row",
    gap: 14,
    minHeight: 48,
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 24,
    paddingRight: 24,
    borderRadius: 16,
  },
  optionPressed: {
    backgroundColor: theme.backgroundPressed,
  },
  account: {
    borderBottomColor: theme.surfaceColor,
    borderBottomWidth: 1,
  },
  accountLabel: {
    color: theme.secondaryTextColor,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.1,
    marginBottom: 4,
  },
  accountName: {
    color: theme.primaryTextColor,
    fontSize: 16,
    fontWeight: "600",
  },
  signOutText: {
    color: theme.dangerColor,
    fontSize: 16,
    fontWeight: "600",
  },
});
