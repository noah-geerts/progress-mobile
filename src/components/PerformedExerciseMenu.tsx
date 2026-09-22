import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text } from "react-native";
import { Ellipsis, Plus, Trash2 } from "lucide-react-native";
import type { PerformedExercise } from "@/domain/PerformedExercise/PerformedExercise";
import { theme } from "@/design/theme";
import FloatingModal from "@/design/components/FloatingModal";
import { useCurrentDay } from "@/hooks/CurrentDayProvider";
import { useCreateSet } from "@/services/setService";
import { useDeletePE } from "@/services/performedExerciseService";

type PerformedExerciseMenuProps = {
  performedExercise: PerformedExercise;
  onAddSet: () => void;
};

export default function PerformedExerciseMenu({ performedExercise, onAddSet }: PerformedExerciseMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const { currentDay } = useCurrentDay();
  const { mutate: createSet, isPending: isSetCreationPending } = useCreateSet(currentDay.format("YYYY-MM-DD"));
  const { mutate: deletePE, isPending: isExerciseDeletionPending } = useDeletePE(performedExercise.id, currentDay.format("YYYY-MM-DD"));

  function close() {
    setIsOpen(false);
    setIsConfirmingDelete(false);
  }

  function deleteExercise() {
    if (isExerciseDeletionPending) return;

    deletePE(undefined, {
      onError: () => {
        Alert.alert("Exercise failed to delete");
      },
    });
  }

  function addSet() {
    if (isSetCreationPending) return;

    const lastPosition = performedExercise.sets.reduce((position, set) => Math.max(position, set.position), -1);

    createSet(
      { performedExerciseId: performedExercise.id, position: lastPosition + 1, reps: 1, weight: 0 },
      {
        onError: (error) => {
          Alert.alert("Set failed to create");
          console.log(error);
        },
        onSuccess: () => {
          onAddSet();
        }
      },
    );
  }

  return (
    <FloatingModal
      accessibilityLabel={`Options for ${performedExercise.exercise.name}`}
      button={<Ellipsis size={24} color={theme.primaryTextColor} />}
      position="topRight"
      isOpen={isOpen}
      onOpen={() => setIsOpen(true)}
      onClose={close}
    >
      {isConfirmingDelete ? (
        <>
          <Text style={styles.confirmationText}>Are you sure you want to delete this exercise and all of its sets?</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              close();
              deleteExercise();
            }}
            style={({ pressed }) => [styles.deleteButton, pressed && styles.pressed]}
          >
            <Text style={[styles.menuLabel, styles.deleteLabel]}>Delete Exercise</Text>
          </Pressable>
        </>
      ) : (
        <>
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              close();
              addSet();
            }}
            style={({ pressed }) => [styles.menuOption, pressed && styles.pressed]}
          >
            <Plus size={20} color={theme.primaryTextColor} />
            <Text style={styles.menuLabel}>Add new set</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => setIsConfirmingDelete(true)}
            style={({ pressed }) => [styles.menuOption, pressed && styles.pressed]}
          >
            <Trash2 size={20} color={theme.dangerColor} />
            <Text style={[styles.menuLabel, { color: theme.dangerColor }]}>Delete exercise</Text>
          </Pressable>
        </>
      )}
    </FloatingModal>
  );
}

const styles = StyleSheet.create({
  menuOption: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 44,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 12,
  },
  menuLabel: {
    flex: 1,
    color: theme.primaryTextColor,
    fontSize: 16,
    fontWeight: "500",
  },
  confirmationText: {
    color: theme.primaryTextColor,
    fontSize: 16,
    lineHeight: 22,
    padding: 12,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 44,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "rgba(225, 225, 225, 0.6)",
  },
  deleteLabel: {
    color: theme.dangerColor,
    textAlign: "center",
  },
  pressed: {
    backgroundColor: theme.backgroundPressed,
  },
});
