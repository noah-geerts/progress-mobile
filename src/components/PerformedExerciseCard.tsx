import { StyleSheet, Text, View } from "react-native";
import type { PerformedExercise } from "@/domain/PerformedExercise/PerformedExercise";
import { theme } from "@/common/theme";

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
      <Text style={styles.text}>{performedExercise.exercise.name}</Text>
      {sets.map((set, index) => (
        <Text key={set.id} style={styles.text}>
          Set {index + 1}: {set.reps} reps, weight: {set.weight}
        </Text>
      ))}
      {sets.length === 0 && <Text style={styles.text}>No sets recorded.</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.backgroundColor,
    borderColor: theme.borderColor,
    borderRadius: 8,
    borderWidth: 1,

    gap: 6,
    padding: 20,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  text: {
    color: theme.primaryTextColor,
    fontSize: 14,
    lineHeight: 21,
  },
});