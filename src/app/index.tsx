import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import DashboardHeader from "@/components/DashboardHeader";
import PerformedExerciseCard from "@/components/PerformedExerciseCard";
import { theme } from "@/design/theme";
import { useGetSession } from "@/services/sessionService";
import { useCurrentDay } from "@/hooks/CurrentDayProvider";
import { useEffect, useEffectEvent, useRef } from "react";
import { useFocusEffect, useIsFocused, useLocalSearchParams, useRouter } from "expo-router";
import type { PerformedExercise } from "@/domain/PerformedExercise/PerformedExercise";

export default function Index() {
  const { scrollToBottom } = useLocalSearchParams<{ scrollToBottom?: string }>();
  const router = useRouter();
  const isFocused = useIsFocused();
  const listRef = useRef<FlatList<PerformedExercise>>(null);
  const listSize = useRef({ height: 0, contentHeight: 0 });
  const { currentDay } = useCurrentDay();
  const insets = useSafeAreaInsets();
  const localDate = currentDay.format("YYYY-MM-DD");
  const { data: session, isLoading } = useGetSession(localDate);
  const topBuffer = insets.top + 50;
  const bottomBuffer = insets.bottom + 50;

  useFocusEffect(() => {
    if (scrollToBottom === "true") {
      router.setParams({ scrollToBottom: undefined });
      setTimeout(() => {
        scrollToListBottom();
      }, 200);
    }
  });

  function scrollToListBottom() {
    if (isFocused && listSize.current.height > 0) {
      listRef.current?.scrollToOffset({
        offset: Math.max(0, listSize.current.contentHeight - listSize.current.height),
        animated: false,
      });
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      {isLoading ? (
        <ActivityIndicator accessibilityLabel="Loading session" color={theme.primaryColor} style={{ marginTop: topBuffer }} />
      ) : session === undefined ? (
        <Text style={[styles.statusText, { marginTop: topBuffer }]}>no session</Text>
      ) : (
        <FlatList
          key={localDate}
          ref={listRef}
          data={session.performedExercises}
          onLayout={({ nativeEvent }) => {
            listSize.current.height = nativeEvent.layout.height;
          }}
          onContentSizeChange={(_, height) => {
            listSize.current.contentHeight = height;
          }}
          keyExtractor={(performedExercise) => performedExercise.id}
          renderItem={({ item, index }) => (
            <>
              {index !== 0 && <View style={styles.divider}></View>}
              <PerformedExerciseCard performedExercise={item} />
            </>
          )}
          contentContainerStyle={[styles.content, { paddingTop: topBuffer, paddingBottom: bottomBuffer }]}
          contentInsetAdjustmentBehavior="never"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="never"
          keyboardDismissMode="on-drag"
        />
      )}
      <DashboardHeader />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.backgroundColor,
    flex: 1,
  },
  content: {
    backgroundColor: theme.backgroundColor,
  },
  divider: {
    backgroundColor: theme.surfaceColor,
    height: 8,
  },
  statusText: {
    color: theme.secondaryTextColor,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 57 + 24,
    textAlign: "center",
  },
  loadingIndicator: {
    marginTop: 57 + 24,
  },
});
