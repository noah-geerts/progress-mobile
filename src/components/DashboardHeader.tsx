import dayjs, { type Dayjs } from "dayjs";
import type { Dispatch, SetStateAction } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "@/common/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type DashboardHeaderProps = {
  currentDay: Dayjs;
  setCurrentDay: Dispatch<SetStateAction<Dayjs>>;
};

export default function DashboardHeader({
  currentDay,
  setCurrentDay,
}: DashboardHeaderProps) {
  const dayLabel = currentDay.isSame(dayjs(), "day")
    ? "Today"
    : currentDay.format("ddd, MMM D");
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={[styles.header, {marginTop: insets.top}]}>
        <Pressable
          accessibilityLabel="Previous day"
          accessibilityRole="button"
          onPress={() => setCurrentDay((day) => day.subtract(1, "day"))}
          style={({ pressed }) => [
            styles.arrowButton,
            pressed && styles.arrowButtonPressed,
          ]}
        >
          <ChevronLeft color={theme.primaryTextColor} size={22} strokeWidth={2} />
        </Pressable>

        <Text
          accessibilityRole="header"
          accessibilityLiveRegion="polite"
          style={styles.dayLabel}
        >
          {dayLabel}
        </Text>

        <Pressable
          accessibilityLabel="Next day"
          accessibilityRole="button"
          onPress={() => setCurrentDay((day) => day.add(1, "day"))}
          style={({ pressed }) => [
            styles.arrowButton,
            pressed && styles.arrowButtonPressed,
          ]}
        >
          <ChevronRight color={theme.primaryTextColor} size={22} strokeWidth={2} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    zIndex: 1
  },
  header: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 57,
    width: "90%",
  },
  arrowButton: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderWidth: 0.7,
    borderColor: "white",
    borderRadius: 24,
    flexShrink: 0,
    height: 48,
    justifyContent: "center",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    width: 48,
  },
  arrowButtonPressed: {
    backgroundColor: "rgba(235, 235, 235, 0.7)",
    transform: [{ scale: 0.96 }],
  },
  dayLabel: {
    color: theme.primaryTextColor,
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0,
    lineHeight: 24,
    textAlign: "center",
  },
});