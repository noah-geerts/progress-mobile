import { Href, usePathname, useRouter } from "expo-router";
import { Book, Menu, Plus } from "lucide-react-native";
import {
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { LucideIcon } from "lucide-react-native";
import { theme } from "@/common/theme";

type NavOptionProps = {
  icon: LucideIcon;
  label: string;
  route: string;
};

const optionPressed = "rgba(235, 235, 235, 0.7)";
const optionSelected = "rgba(225, 225, 225, 0.7)";
const navBackground = "rgba(255, 255, 255, 0.7)";

export function NavOption({ icon: Icon, label, route }: NavOptionProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isActive = pathname === route;
  const iconColor = isActive ? theme.primaryColor : theme.secondaryTextColor;
  const iconStroke = isActive ? 2.5 : 2;

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="tab"
      accessibilityState={{ selected: isActive }}
      onPress={() => {
        if (!isActive) {
          router.navigate(route as Href);
        }
      }}
      style={({ pressed }) => [
        styles.option,
        isActive && {backgroundColor: optionSelected},
        pressed && {backgroundColor: optionPressed}
      ]}
    >
      <Icon size={24} color={iconColor} strokeWidth={iconStroke} />
    </Pressable>
  );
}

export function NavBar() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={[styles.navBar, {marginBottom: insets.bottom }]}>
        <NavOption icon={Book} label="Log" route="/" />

        <Pressable
          accessibilityLabel="Add"
          accessibilityRole="button"
          onPress={() => {}}
          style={({ pressed }) => [
            styles.addButton,
            pressed && styles.addButtonPressed,
          ]}
        >
          <Plus color="#ffffff" size={27} strokeWidth={2.75} />
        </Pressable>

        <NavOption icon={Menu} label="Menu" route="/menu" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    bottom: 0
  },
  navBar: {
    alignItems: "center",
    backgroundColor: navBackground,
    borderColor: "white",
    borderRadius: 34,
    borderWidth: .7,
    elevation: 8,
    flexDirection: "row",
    height: 58,
    justifyContent: "space-around",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    width: "90%",
  },
  option: {
    alignItems: "center",
    borderRadius: 26,
    height: 50,
    justifyContent: "center",
    minWidth: 102,
    paddingHorizontal: 12,
  },
  addButton: {
    alignItems: "center",
    backgroundColor: theme.primaryColor,
    borderRadius: 25,
    elevation: 5,
    height: 50,
    justifyContent: "center",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    width: 50,
  },
  addButtonPressed: {
    backgroundColor: theme.primaryPressed,
    transform: [{ scale: 0.96 }],
  },
});