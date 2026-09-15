import { useRef, useState } from "react";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react-native";
import { Modal, Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { theme } from "@/design/theme";

export type MenuPosition = "topRight" | "topLeft" | "bottomRight" | "bottomLeft";

export type FloatingMenuOption = {
  label: string;
  icon: LucideIcon;
  onPress?: () => void;
  color?: string;
  disabled?: boolean;
};

type FloatingMenuProps = {
  accessibilityLabel: string;
  options: FloatingMenuOption[];
  children: ReactNode;
  position: MenuPosition;
};

export default function FloatingMenu({ accessibilityLabel, options, children, position }: FloatingMenuProps) {
  const triggerRef = useRef<View>(null);
  const overlayRef = useRef<View>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [anchor, setAnchor] = useState<{ top: number; right: number; bottom: number; left: number } | null>(null);
  const { width } = useWindowDimensions();

  function close() {
    setIsOpen(false);
    setAnchor(null);
  }

  function positionMenu() {
    overlayRef.current?.measureInWindow((overlayX, overlayY, overlayWidth, overlayHeight) => {
      triggerRef.current?.measureInWindow((triggerX, triggerY, triggerWidth, triggerHeight) => {
        setAnchor({
          top: triggerY - overlayY,
          right: overlayX + overlayWidth - triggerX - triggerWidth,
          bottom: overlayY + overlayHeight - triggerY - triggerHeight,
          left: triggerX - overlayX,
        });
      });
    });
  }

  return (
    <>
      <Pressable
        ref={triggerRef}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ expanded: isOpen }}
        onPress={() => setIsOpen(true)}
        style={({ pressed }) => [styles.trigger, pressed && styles.pressed]}
      >
        {children}
      </Pressable>
      <Modal transparent visible={isOpen} animationType="none" onRequestClose={close}>
        <View ref={overlayRef} collapsable={false} style={styles.overlay} onLayout={positionMenu}>
          <Pressable accessibilityRole="button" accessibilityLabel="Close menu" onPress={close} style={StyleSheet.absoluteFill} />
          {anchor && (
            <View
              accessibilityViewIsModal
              onAccessibilityEscape={close}
              style={[
                styles.menu,
                position === "topRight" || position === "topLeft" ? { top: anchor.top } : { bottom: anchor.bottom },
                position === "topRight" || position === "bottomRight" ? { right: anchor.right } : { left: anchor.left },
                { width: Math.min(240, width - 48) },
              ]}
            >
              {options.map(({ label, icon: Icon, onPress, color = "black", disabled }) => (
                <Pressable
                  key={label}
                  accessibilityRole="button"
                  accessibilityState={{ disabled: !!disabled }}
                  disabled={disabled}
                  onPress={() => {
                    close();
                    onPress?.();
                  }}
                  style={({ pressed }) => [styles.option, pressed && styles.pressed, disabled && styles.disabled]}
                >
                  <Icon size={20} color={color} />
                  <Text style={[styles.label, { color }]}>{label}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    width: 44,
    height: 44,
    borderRadius: 22,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.backgroundColor,
  },
  overlay: {
    flex: 1,
  },
  menu: {
    position: "absolute",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderColor: theme.backgroundColor,
    borderWidth: 0.7,
    borderRadius: 28,
    padding: 8,
    gap: 4,
    shadowColor: theme.primaryColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 44,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 12,
  },
  label: {
    flex: 1,
    color: theme.primaryTextColor,
    fontSize: 16,
    fontWeight: "500",
  },
  pressed: {
    backgroundColor: theme.backgroundPressed,
  },
  disabled: {
    opacity: 0.4,
  },
});
