import { useRef, useState, type ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Trash2 } from "lucide-react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { theme } from "@/design/theme";

type SwipeToDeleteProps = {
  children: ReactNode;
  onDelete: () => Promise<unknown>;
  onDeleteError: () => void;
};

const REVEAL_THRESHOLD = 0.2;
const DELETE_THRESHOLD = 0.75;
const ACTION_PADDING = 16;
const ACTION_GAP = 8;
const SETTLE_ANIMATION = { damping: 24, stiffness: 260, overshootClamping: true };

export default function SwipeToDelete({ children, onDelete, onDeleteError }: SwipeToDeleteProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteRequested = useRef(false);
  const rowWidth = useSharedValue(0);
  const rowHeight = useSharedValue(0);
  const labelWidth = useSharedValue(80);
  const labelHeight = useSharedValue(20);
  const distance = useSharedValue(0);
  const startDistance = useSharedValue(0);
  const revealed = useSharedValue(false);
  const locked = useSharedValue(false);

  const revealWidth = useDerivedValue(() =>
    Math.min(rowWidth.value, Math.max(rowWidth.value * REVEAL_THRESHOLD, labelWidth.value + ACTION_PADDING * 2 + ACTION_GAP * 2)),
  );
  const actionWidth = useDerivedValue(() => Math.max(0, distance.value - ACTION_GAP * 2));
  const actionProgress = useDerivedValue(() =>
    Math.min(1, Math.max(0, (distance.value - rowWidth.value * 0.1) / Math.max(1, rowWidth.value * 0.1))),
  );
  const labelAlignment = useDerivedValue(() =>
    withTiming(locked.value || (rowWidth.value > 0 && distance.value >= rowWidth.value * DELETE_THRESHOLD) ? 1 : 0, { duration: 120 }),
  );

  async function handleDelete() {
    if (deleteRequested.current) return;

    deleteRequested.current = true;
    locked.value = true;
    setIsDeleting(true);
    distance.value = withTiming(rowWidth.value, { duration: 160 });

    try {
      await onDelete();
    } catch {
      distance.value = withSpring(0, SETTLE_ANIMATION);
      revealed.value = false;
      locked.value = false;
      deleteRequested.current = false;
      setIsRevealed(false);
      setIsDeleting(false);
      onDeleteError();
    }
  }

  const pan = Gesture.Pan()
    .enabled(!isDeleting)
    .activeOffsetX([-10, 10])
    .failOffsetY([-10, 10])
    .onStart(() => {
      if (locked.value) return;
      cancelAnimation(distance);
      startDistance.value = distance.value;
    })
    .onUpdate((event) => {
      if (locked.value) return;
      distance.value = Math.min(rowWidth.value, Math.max(0, startDistance.value - event.translationX));
    })
    .onFinalize((_event, success) => {
      if (locked.value || rowWidth.value <= 0) return;

      if (success && distance.value >= rowWidth.value * DELETE_THRESHOLD) {
        locked.value = true;
        distance.value = withTiming(rowWidth.value, { duration: 160 });
        scheduleOnRN(handleDelete);
        return;
      }

      const shouldReveal = success ? distance.value >= rowWidth.value * REVEAL_THRESHOLD : revealed.value;
      revealed.value = shouldReveal;
      distance.value = withSpring(shouldReveal ? revealWidth.value : 0, SETTLE_ANIMATION);
      scheduleOnRN(setIsRevealed, shouldReveal);
    });

  const contentViewportStyle = useAnimatedStyle(() => ({
    marginLeft: Math.min(ACTION_GAP, distance.value),
    marginRight: Math.min(distance.value, Math.max(0, rowWidth.value - ACTION_GAP)),
  }));
  const contentStyle = useAnimatedStyle(() => ({
    marginLeft: -Math.min(ACTION_GAP, distance.value),
    marginRight: -Math.min(distance.value, Math.max(0, rowWidth.value - ACTION_GAP)),
    transform: [{ translateX: -distance.value }],
  }));
  const backgroundStyle = useAnimatedStyle(() => ({
    width: Math.max(0, rowWidth.value - distance.value - ACTION_GAP),
    opacity: distance.value >= rowWidth.value - ACTION_GAP ? 0 : Math.min(1, distance.value / Math.max(1, rowWidth.value * 0.1)),
  }));
  const actionStyle = useAnimatedStyle(() => ({
    width: actionWidth.value,
    opacity: actionProgress.value,
    transform: [{ scale: actionProgress.value }],
  }));
  const labelStyle = useAnimatedStyle(() => {
    const scale = Math.min(
      1,
      actionWidth.value / (labelWidth.value + ACTION_PADDING * 2),
      rowHeight.value / (labelHeight.value + ACTION_GAP * 2),
    );
    const centeredLeft = (actionWidth.value - labelWidth.value * scale) / 2;

    return {
      left: centeredLeft + (ACTION_PADDING * scale - centeredLeft) * labelAlignment.value,
      width: rowWidth.value,
      transform: [{ scale }],
    };
  });

  return (
    <GestureDetector gesture={pan}>
      <Animated.View
        style={styles.container}
        onLayout={({ nativeEvent }) => {
          rowWidth.value = nativeEvent.layout.width;
          rowHeight.value = nativeEvent.layout.height;
          if (locked.value) {
            distance.value = rowWidth.value;
          } else if (revealed.value) {
            distance.value = Math.min(
              rowWidth.value,
              Math.max(rowWidth.value * REVEAL_THRESHOLD, labelWidth.value + ACTION_PADDING * 2 + ACTION_GAP * 2),
            );
          }
        }}
      >
        <Animated.View pointerEvents="none" style={[styles.background, backgroundStyle]} />
        <Animated.View style={[styles.contentViewport, contentViewportStyle]}>
          <Animated.View
            style={[styles.content, contentStyle]}
            pointerEvents={isDeleting ? "none" : "auto"}
            accessibilityElementsHidden={isDeleting}
            importantForAccessibility={isDeleting ? "no-hide-descendants" : "auto"}
          >
            {children}
          </Animated.View>
        </Animated.View>
        <Animated.View
          style={[styles.action, actionStyle]}
          accessibilityElementsHidden={!isRevealed || isDeleting}
          importantForAccessibility={!isRevealed || isDeleting ? "no-hide-descendants" : "auto"}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Delete"
            disabled={!isRevealed || isDeleting}
            onPress={handleDelete}
            style={styles.button}
          >
            <Animated.View pointerEvents="none" style={[styles.labelPosition, labelStyle]}>
              <View
                onLayout={({ nativeEvent }) => {
                  labelWidth.value = nativeEvent.layout.width;
                  labelHeight.value = nativeEvent.layout.height;
                }}
                style={styles.actionLabel}
              >
                <Trash2 size={20} color={theme.backgroundColor} />
                <Text numberOfLines={1} style={styles.actionText}>
                  Delete
                </Text>
              </View>
            </Animated.View>
          </Pressable>
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    borderRadius: 24,
  },
  contentViewport: {
    overflow: "hidden",
    borderRadius: 24,
  },
  content: {
    minHeight: 44,
    paddingVertical: 4,
    justifyContent: "center",
    borderRadius: 24,
    overflow: "hidden",
  },
  background: {
    position: "absolute",
    left: ACTION_GAP,
    top: 0,
    bottom: 0,
    backgroundColor: theme.backgroundSelected,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: theme.borderColor,
  },
  action: {
    position: "absolute",
    right: ACTION_GAP,
    top: 0,
    bottom: 0,
    borderRadius: 24,
    backgroundColor: theme.dangerColor,
    overflow: "hidden",
  },
  button: {
    flex: 1,
    justifyContent: "center",
  },
  labelPosition: {
    position: "absolute",
    transformOrigin: "left center",
  },
  actionLabel: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  actionText: {
    color: theme.backgroundColor,
    fontSize: 14,
    fontWeight: "600",
    flexShrink: 0,
  },
});
