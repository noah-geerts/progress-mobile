import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { theme } from "@/design/theme";

type ButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
};

export default function Button({ label, onPress, disabled = false, loading = false }: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
        disabled && !loading && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={theme.backgroundColor} />
      ) : (
        <Text style={styles.label}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.primaryColor,
    borderRadius: 24,
    minHeight: 50,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  pressed: {
    backgroundColor: theme.primaryPressed,
  },
  disabled: {
    opacity: 0.4,
  },
  label: {
    color: theme.backgroundColor,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});