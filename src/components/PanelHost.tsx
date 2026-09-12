import { Pressable, StyleSheet, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { theme } from "@/common/theme";
import { usePanel } from "./PanelProvider";

export default function PanelHost() {
  const insets = useSafeAreaInsets();
  const { height, width } = useWindowDimensions();
  const { content, isOpen, close } = usePanel();

  if (!isOpen) return null;

  return (
    <Pressable style={[styles.container, { height, width }]} onPress={close}>
      <Pressable
        onPress={(event) => event.stopPropagation()}
        style={[
          styles.panel,
          {
            paddingBottom: insets.bottom + 16,
            paddingLeft: insets.left + 16,
            paddingRight: insets.right + 16,
          },
        ]}
      >
        {content}
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    justifyContent: "flex-end",
    zIndex: 999,
  },
  panel: {
    width: "100%",
    backgroundColor: theme.backgroundColor,
    paddingTop: 16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderColor: theme.backgroundColor,
    borderWidth: 0.7,
    shadowColor: theme.primaryColor,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },
});
