import { StyleSheet, View } from "react-native";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";
import { theme } from "@/design/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ReactNode } from "react";

export default function Header({ children }: { children: ReactNode }) {
  const insets = useSafeAreaInsets();
  const containerHeight = insets.top + 65;

  return (
    <View pointerEvents="box-none" style={[styles.container, { height: containerHeight }]}>
      <Svg pointerEvents="none" width="100%" height={containerHeight} style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="headerFade" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={theme.backgroundColor} stopOpacity={0.9} />
            <Stop offset="65%" stopColor={theme.backgroundColor} stopOpacity={0.9} />
            <Stop offset="75%" stopColor={theme.backgroundColor} stopOpacity={0.8} />
            <Stop offset="82%" stopColor={theme.backgroundColor} stopOpacity={0.66} />
            <Stop offset="88%" stopColor={theme.backgroundColor} stopOpacity={0.48} />
            <Stop offset="93%" stopColor={theme.backgroundColor} stopOpacity={0.3} />
            <Stop offset="97%" stopColor={theme.backgroundColor} stopOpacity={0.14} />
            <Stop offset="100%" stopColor={theme.backgroundColor} stopOpacity={0} />
          </LinearGradient>
        </Defs>
        <Rect width="100%" height={containerHeight} fill="url(#headerFade)" />
      </Svg>
      <View style={[styles.header, { marginTop: insets.top }]}>{children}</View>
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
    flexShrink: 0,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    height: theme.roundButtonSize,
  },
});
