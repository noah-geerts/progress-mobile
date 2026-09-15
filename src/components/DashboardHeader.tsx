import dayjs from "dayjs";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { Pressable, StyleSheet, Text } from "react-native";
import { theme } from "@/design/theme";
import { useCurrentDay } from "../hooks/CurrentDayProvider";
import Header from "./Header";

const buttonPressed = "rgba(235, 235, 235, 0.8)";
const buttonBackground = "rgba(255, 255, 255, 0.9)";

export default function DashboardHeader() {
  const { currentDay, setCurrentDay } = useCurrentDay();
  const dayLabel = currentDay.isSame(dayjs(), "day") ? "Today" : currentDay.format("ddd, MMM D");

  return (
    <Header>
      <Pressable
        accessibilityLabel="Previous day"
        accessibilityRole="button"
        onPress={() => setCurrentDay((day) => day.subtract(1, "day"))}
        style={({ pressed }) => [styles.arrowButton, pressed && styles.arrowButtonPressed]}
      >
        <ChevronLeft color={theme.primaryTextColor} size={26} strokeWidth={2} />
      </Pressable>

      <Text accessibilityRole="header" accessibilityLiveRegion="polite" style={styles.dayLabel}>
        {dayLabel}
      </Text>

      <Pressable
        accessibilityLabel="Next day"
        accessibilityRole="button"
        onPress={() => setCurrentDay((day) => day.add(1, "day"))}
        style={({ pressed }) => [styles.arrowButton, pressed && styles.arrowButtonPressed]}
      >
        <ChevronRight color={theme.primaryTextColor} size={26} strokeWidth={2} />
      </Pressable>
    </Header>
  );
}

const styles = StyleSheet.create({
  arrowButton: {
    alignItems: "center",
    backgroundColor: buttonBackground,
    borderWidth: 0.7,
    borderColor: "white",
    borderRadius: 24,
    flexShrink: 0,
    height: theme.roundButtonSize,
    justifyContent: "center",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    width: theme.roundButtonSize,
  },
  arrowButtonPressed: {
    backgroundColor: buttonPressed,
    transform: [{ scale: 1.06 }],
  },
  dayLabel: {
    color: theme.primaryTextColor,
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0,
    lineHeight: 24,
    textAlign: "center",
  },
});
