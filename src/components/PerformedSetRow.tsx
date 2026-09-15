import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { theme } from "@/design/theme";
import type { PerformedSet } from "@/domain/PerformedSet/PerformedSet";
import { useCurrentDay } from "@/hooks/CurrentDayProvider";
import { useDeleteSet, useUpdateSet } from "@/services/setService";
import SwipeToDelete from "@/components/SwipeToDelete";
import { TextInput } from "react-native";

type PerformedSetRowProps = {
  set: PerformedSet;
};

export default function PerformedSetRow({ set }: PerformedSetRowProps) {
  const { currentDay } = useCurrentDay();
  const { mutateAsync: updateSet } = useUpdateSet(set.id, currentDay.format("YYYY-MM-DD"));
  const { mutateAsync: deleteSet } = useDeleteSet(set.id, currentDay.format("YYYY-MM-DD"));

  const [reps, setReps] = useState(String(set.reps));
  const [weight, setWeight] = useState(String(set.weight));

  function handleBlur() {
    let repsValue = parseNumber(reps);
    let weightValue = parseNumber(weight);

    if (Number.isNaN(repsValue) || !Number.isInteger(repsValue)) {
      setReps(String(set.reps));
      repsValue = set.reps;
    } else {
      setReps(String(repsValue)); // normalize the text input to what gets sent to the backend
    }

    if (Number.isNaN(weightValue)) {
      setWeight(String(set.weight));
      weightValue = set.weight;
    } else {
      setWeight(String(weightValue)); // normalize the text input to what gets sent to the backend
    }

    updateSet(
      { reps: repsValue, weight: weightValue },
      {
        onError: () => Alert.alert("set failed to save"),
      },
    );
  }

  function parseNumber(number: string) {
    number = number.replace(",", ".");
    return Number(number);
  }

  return (
    <SwipeToDelete onDelete={() => deleteSet()} onDeleteError={() => Alert.alert("set failed to delete")}>
      <View style={styles.row}>
        <View style={styles.metric}>
          <Text style={styles.label}>reps</Text>
          <TextInput
            accessibilityLabel={"reps"}
            value={reps}
            onChangeText={(s) => setReps(s)}
            keyboardType="number-pad"
            style={styles.input}
            onBlur={handleBlur}
          />
        </View>
        <View style={[styles.metric, styles.weightMetric]}>
          <Text style={styles.label}>weight</Text>
          <TextInput
            accessibilityLabel={"weight"}
            value={weight}
            onChangeText={(s) => setWeight(s)}
            keyboardType="decimal-pad"
            style={styles.input}
            onBlur={handleBlur}
          />
        </View>
      </View>
    </SwipeToDelete>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 24,
    paddingRight: 24,
    columnGap: 16,
  },
  metric: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  weightMetric: {
    flex: 1.3,
  },
  label: {
    color: theme.primarySelected,
    fontSize: 13,
    fontWeight: "500",
    flexShrink: 1,
  },
  input: {
    textAlign: "center",
    fontVariant: ["tabular-nums"],
    flex: 1,
    minWidth: 0,
    backgroundColor: theme.surfaceColor,
    borderRadius: 999,
    minHeight: 36,
    color: theme.primaryTextColor,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 16,
  },
});
