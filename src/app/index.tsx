import { ActivityIndicator, FlatList, StyleSheet, Text } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import DashboardHeader from "@/components/DashboardHeader";
import PerformedExerciseCard from "@/components/PerformedExerciseCard";
import { theme } from "@/design/theme";
import { useGetSession } from "@/services/sessionService";
import { useCurrentDay } from "@/hooks/CurrentDayProvider";
import { useEffect, useEffectEvent, useRef } from "react";
import { useIsFocused, useLocalSearchParams, useRouter } from "expo-router";
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
  const topBuffer = insets.top + 57 + 12;

  function scrollToListBottom() {
    if (isFocused && listSize.current.height > 0) {
      listRef.current?.scrollToOffset({
        offset: Math.max(0, listSize.current.contentHeight - listSize.current.height),
        animated: false,
      });
    }
  }

  const scrollOnRequest = useEffectEvent(scrollToListBottom);

  useEffect(() => {
    if (!isFocused || scrollToBottom !== "true") return;

    scrollOnRequest();
    router.setParams({ scrollToBottom: undefined });
  }, [scrollToBottom, isFocused, localDate, router]);

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      {isLoading ? (
        <ActivityIndicator
          accessibilityLabel="Loading session"
          color={theme.primaryColor}
          style={{marginTop: topBuffer}}
        />
      ) : session === undefined ? (
        <Text style={[styles.statusText, {marginTop: topBuffer}]}>no session</Text>
      ) : (
        <FlatList
          key={localDate}
          ref={listRef}
          data={session.performedExercises}
          onLayout={({ nativeEvent }) => {
            listSize.current.height = nativeEvent.layout.height;
            scrollToListBottom();
          }}
          onContentSizeChange={(_, height) => {
            listSize.current.contentHeight = height;
            scrollToListBottom();
          }}
          keyExtractor={(performedExercise) => performedExercise.id}
          renderItem={({ item }) => (
            <PerformedExerciseCard performedExercise={item} />
          )}
          style={styles.list}
          contentContainerStyle={[
            styles.content,
            {paddingTop: topBuffer}
          ]}
          contentInsetAdjustmentBehavior="never"
          showsVerticalScrollIndicator={false}
        />
      )}
      <DashboardHeader/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.surfaceColor,
    flex: 1,
  },
  list: {
    flex: 1,
  },
  content: {
    gap: 16,
    paddingHorizontal: "5%",
    paddingTop: 57 + 24,
    paddingBottom: 108,
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
