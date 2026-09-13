import dayjs from "dayjs";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";
import { theme } from "@/design/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCurrentDay } from "../hooks/CurrentDayProvider";

const buttonPressed = "rgba(235, 235, 235, 0.8)";
const buttonBackground = "rgba(255, 255, 255, 0.9)";
const background = theme.surfaceColor;
const buttonSize = 48;
const backgroundExtension = 25;

export default function DashboardHeader() {
  const { currentDay, setCurrentDay } = useCurrentDay();
  const dayLabel = currentDay.isSame(dayjs(), "day")
    ? "Today"
    : currentDay.format("ddd, MMM D");
  const insets = useSafeAreaInsets();
  const containerHeight = insets.top + buttonSize + backgroundExtension;

  return (
    <View pointerEvents="box-none" style={[styles.container, { height: containerHeight }]}>
      <Svg pointerEvents="none" width="100%" height={containerHeight} style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="headerFade" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={background} stopOpacity={0.8} />
            <Stop offset="65%" stopColor={background} stopOpacity={0.8} />
            <Stop offset="75%" stopColor={background} stopOpacity={0.773} />
            <Stop offset="82%" stopColor={background} stopOpacity={0.693} />
            <Stop offset="88%" stopColor={background} stopOpacity={0.533} />
            <Stop offset="93%" stopColor={background} stopOpacity={0.293} />
            <Stop offset="97%" stopColor={background} stopOpacity={0.08} />
            <Stop offset="100%" stopColor={background} stopOpacity={0} />
          </LinearGradient>
        </Defs>
        <Rect width="100%" height={containerHeight} fill="url(#headerFade)" />
      </Svg>
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
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    zIndex: 1,
  },
  header: {
    height: buttonSize,
    flexShrink: 0,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%"
  },
  arrowButton: {
    alignItems: "center",
    backgroundColor: buttonBackground,
    borderWidth: 0.7,
    borderColor: "white",
    borderRadius: 24,
    flexShrink: 0,
    height: buttonSize,
    justifyContent: "center",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    width: buttonSize,
  },
  arrowButtonPressed: {
    backgroundColor: buttonPressed,
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