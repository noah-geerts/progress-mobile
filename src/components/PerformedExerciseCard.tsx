import { StyleSheet, Text, View } from "react-native";
import type { PerformedExercise } from "@/domain/PerformedExercise/PerformedExercise";
import { theme } from "@/design/theme";
import PerformedSetRow from "@/components/PerformedSetRow";
import PerformedExerciseMenu from "@/components/PerformedExerciseMenu";

type PerformedExerciseCardProps = {
  performedExercise: PerformedExercise;
  onAddSet: () => void;
};

export default function PerformedExerciseCard({ performedExercise, onAddSet }: PerformedExerciseCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text accessibilityRole="header" style={styles.title}>
          {performedExercise.exercise.name}
        </Text>
        <PerformedExerciseMenu performedExercise={performedExercise} onAddSet={onAddSet} />
      </View>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 12,
    gap: 12,
  },
  title: {
    flex: 1,
    minWidth: 0,
    color: theme.primaryTextColor,
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 24,
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
