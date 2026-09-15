import { Alert, StyleSheet, Text, View } from "react-native";
import { Ellipsis, Plus, Trash2 } from "lucide-react-native";
import type { PerformedExercise } from "@/domain/PerformedExercise/PerformedExercise";
import { theme } from "@/design/theme";
import PerformedSetRow from "@/components/PerformedSetRow";
import FloatingMenu from "../design/components/FloatingMenu";
import { useCurrentDay } from "@/hooks/CurrentDayProvider";
import { useCreateSet } from "@/services/setService";

type PerformedExerciseCardProps = {
  performedExercise: PerformedExercise;
};

export default function PerformedExerciseCard({ performedExercise }: PerformedExerciseCardProps) {
  const { currentDay } = useCurrentDay();
  const { mutate: createSet, isPending } = useCreateSet(currentDay.format("YYYY-MM-DD"));

  function addSet() {
    if (isPending) return;

    const lastPosition = performedExercise.sets.reduce((position, set) => Math.max(position, set.position), -1);

    createSet(
      { performedExerciseId: performedExercise.id, position: lastPosition + 1, reps: 1, weight: 0 },
      {
        onError: (e) => {
          Alert.alert("Set failed to create");
          console.log(e);
        },
      },
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text accessibilityRole="header" style={styles.title}>
          {performedExercise.exercise.name}
        </Text>
        <FloatingMenu
          accessibilityLabel={`Options for ${performedExercise.exercise.name}`}
          position="topRight"
          options={[
            { label: "Add new set", icon: Plus, onPress: addSet, disabled: isPending },
            { label: "Delete exercise", icon: Trash2, color: theme.dangerColor },
          ]}
        >
          <Ellipsis size={24} color={theme.primaryTextColor} />
        </FloatingMenu>
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
