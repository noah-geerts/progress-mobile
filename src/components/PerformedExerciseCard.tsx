import { StyleSheet, Text, View } from "react-native";
import type { PerformedExercise } from "@/domain/PerformedExercise/PerformedExercise";
import { theme } from "@/design/theme";

type PerformedExerciseCardProps = {
  performedExercise: PerformedExercise;
};

export default function PerformedExerciseCard({
  performedExercise,
}: PerformedExerciseCardProps) {
  const sets = [...performedExercise.sets].sort(
    (first, second) => first.position - second.position
  );

  return (
    <View style={styles.card}>
      <Text accessibilityRole="header" style={styles.title}>{performedExercise.exercise.name}</Text>
      {sets.map((set, index) => (
        <View key={set.id} style={styles.setRow}>
          <Text style={styles.setLabel}>Set {index + 1}</Text>
          <Text style={styles.metric}>
            {set.reps} <Text style={styles.metricLabel}>reps</Text>
          </Text>
          <Text style={styles.metric}>
            {set.weight} <Text style={styles.metricLabel}>weight</Text>
          </Text>
        </View>
      ))}
      {sets.length === 0 && <Text style={styles.emptyText}>No sets recorded.</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.backgroundColor,
    borderRadius: 28,
    gap: 16,
    padding: 24,
  },
  title: {
    color: theme.primaryTextColor,
    fontSize: 20,
    fontWeight: "700",
    lineHeight: 28,
  },
  setRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "baseline",
    columnGap: 16,
    rowGap: 8,
  },
  setLabel: {
    color: theme.primarySelected,
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 24,
    minWidth: 48,
  },
  metric: {
    flexGrow: 1,
    flexBasis: 80,
    color: theme.primaryTextColor,
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 26,
    fontVariant: ["tabular-nums"],
  },
  metricLabel: {
    color: theme.primarySelected,
    fontSize: 13,
    fontWeight: "500",
  },
  emptyText: {
    color: theme.primarySelected,
    fontSize: 14,
    lineHeight: 21,
  },
});