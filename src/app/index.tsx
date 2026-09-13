import { ActivityIndicator, FlatList, StyleSheet, Text } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import DashboardHeader from "@/components/DashboardHeader";
import PerformedExerciseCard from "@/components/PerformedExerciseCard";
import { theme } from "@/design/theme";
import { useGetSession } from "@/services/sessionService";
import { useCurrentDay } from "@/hooks/CurrentDayProvider";

export default function Index() {
  const { currentDay } = useCurrentDay();
  const insets = useSafeAreaInsets();
  const localDate = currentDay.format("YYYY-MM-DD");
  const { data: session, isLoading } = useGetSession(localDate);
  const topBuffer = insets.top + 57 + 12;

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
          data={session.performedExercises}
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
