import { StyleSheet, Text, View } from "react-native";
import type { PerformedExercise } from "@/domain/PerformedExercise/PerformedExercise";
import { theme } from "@/design/theme";
import PerformedSetRow from "@/components/PerformedSetRow";

type PerformedExerciseCardProps = {
  performedExercise: PerformedExercise;
};

export default function PerformedExerciseCard({ performedExercise }: PerformedExerciseCardProps) {
  return (
    <View style={styles.card}>
      <Text accessibilityRole="header" style={styles.title}>
        {performedExercise.exercise.name}
      </Text>
      <View style={styles.sets}>
        {performedExercise.sets.map((set) => (
          <PerformedSetRow key={set.id} set={set} />
        ))}
      </View>
      {performedExercise.sets.length === 0 && <Text style={styles.emptyText}>No sets recorded.</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.backgroundColor,
    borderRadius: 0,
    paddingTop: 24,
    paddingBottom: 24,
  },
  title: {
    color: theme.primaryTextColor,
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 24,
    marginLeft: 24,
    marginBottom: 12,
  },
  emptyText: {
    color: theme.primarySelected,
    fontSize: 14,
    lineHeight: 21,
    marginLeft: 24,
  },
  sets: {
    gap: 4,
  },
});
