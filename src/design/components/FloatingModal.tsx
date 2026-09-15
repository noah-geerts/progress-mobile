import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Modal, Pressable, StyleSheet, View, useWindowDimensions } from "react-native";
import { theme } from "@/design/theme";

export type MenuPosition = "topRight" | "topLeft" | "bottomRight" | "bottomLeft";

type FloatingModalProps = {
  accessibilityLabel: string;
  button: ReactNode;
  children: ReactNode;
  position: MenuPosition;
  isOpen: boolean;
  onOpen?: () => void;
  onClose?: () => void;
};

export default function FloatingModal({ accessibilityLabel, button, children, position, isOpen, onOpen, onClose }: FloatingModalProps) {
  const triggerRef = useRef<View>(null);
  const overlayRef = useRef<View>(null);
  const [anchor, setAnchor] = useState<{ top: number; right: number; bottom: number; left: number } | null>(null);
  const { width } = useWindowDimensions();

  useEffect(() => {
    if (!isOpen) setAnchor(null);
  }, [isOpen]);

  function positionModal() {
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
        onPress={onOpen}
        style={({ pressed }) => [styles.trigger, pressed && styles.pressed]}
      >
        {button}
      </Pressable>
      <Modal transparent visible={isOpen} animationType="none" onRequestClose={onClose}>
        <View ref={overlayRef} collapsable={false} style={styles.overlay} onLayout={positionModal}>
          <Pressable accessibilityRole="button" accessibilityLabel="Close modal" onPress={onClose} style={StyleSheet.absoluteFill} />
          {anchor && (
            <View
              accessibilityViewIsModal
              onAccessibilityEscape={onClose}
              style={[
                styles.modal,
                position === "topRight" || position === "topLeft" ? { top: anchor.top } : { bottom: anchor.bottom },
                position === "topRight" || position === "bottomRight" ? { right: anchor.right } : { left: anchor.left },
                { width: Math.min(240, width - 48) },
              ]}
            >
              {children}
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
  modal: {
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
  pressed: {
    backgroundColor: theme.backgroundPressed,
  },
});
