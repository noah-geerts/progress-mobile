import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Keyboard, Platform, StyleSheet, Text, View, type KeyboardEvent } from "react-native";
import { theme } from "@/design/theme";
import { useGetAllExercises } from "@/services/exerciseService";
import { useCreatePE } from "@/services/performedExerciseService";
import { useCreateSession, useGetSession } from "@/services/sessionService";
import { useCurrentDay } from "../hooks/CurrentDayProvider";
import { usePanel } from "../design/hooks/PanelProvider";
import Button from "../design/components/Button";
import Dropdown, { DropdownOption } from "../design/components/Dropdown";

export default function AddToLogPanel() {
  const { currentDay } = useCurrentDay();
  const { close } = usePanel();
  const router = useRouter();

  const [exerciseId, setExerciseId] = useState<string>();
  const [exerciseSearch, setExerciseSearch] = useState("");
  const [keyboardHeight, setkeyboardHeight] = useState<number>(0);

  const exercises = useGetAllExercises();
  const session = useGetSession(currentDay.format("YYYY-MM-DD"));
  const { mutateAsync: createSession } = useCreateSession(currentDay.format("YYYY-MM-DD"));
  const { mutateAsync: createPE } = useCreatePE(currentDay.format("YYYY-MM-DD"));

  const localDate = currentDay.format("YYYY-MM-DD");
  const isKeyboardVisible = keyboardHeight !== 0;
  const options: DropdownOption[] =
    exercises.data
      ?.filter((exercise) => exercise.name.toLowerCase().includes(exerciseSearch.toLowerCase()))
      .map((exercise) => ({ label: exercise.name, value: exercise.id })) ?? [];

  // Used to set keyboardTop to the y coordinate of the top of the keyboard
  useEffect(() => {
    const showSubscription = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillChangeFrame" : "keyboardDidShow",
      (event: KeyboardEvent) => {
        Keyboard.scheduleLayoutAnimation(event);
        setkeyboardHeight(event.endCoordinates.height);
      },
    );
    const hideSubscription = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      (event: KeyboardEvent) => {
        Keyboard.scheduleLayoutAnimation(event);
        setkeyboardHeight(0);
      },
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const addToLog = useMutation({
    mutationFn: async (selectedExerciseId: string) => {
      const result = await session.refetch();
      if (result.error && result.error.response?.status !== 404) {
        throw result.error;
      }

      const targetSession = result.error?.response?.status === 404 ? await createSession({ name: localDate }) : result.data;

      if (!targetSession) {
        throw new Error("Session could not be loaded");
      }

      const performedExercises = targetSession.performedExercises;
      const lastExercise = performedExercises[performedExercises.length - 1];
      await createPE({
        exerciseId: selectedExerciseId,
        sessionId: targetSession.id,
        position: lastExercise ? lastExercise.position + 1 : 0,
      });
    },
  });

  return (
    <View style={[styles.content, { marginBottom: keyboardHeight - 30 }]}>
      <Dropdown
        options={options}
        value={exerciseId}
        onChange={setExerciseId}
        searchable
        query={exerciseSearch}
        onChangeQuery={setExerciseSearch}
        placeholder="Select an exercise"
        emptyMessage={exercises.data?.length ? "No matching exercises" : "Exercises failed to load"}
        loading={exercises.isFetching}
        disabled={addToLog.isPending || exercises.isError}
      />
      {!isKeyboardVisible && (
        <>
          {addToLog.isError && (
            <Text accessibilityRole="alert" style={styles.errorText}>
              Could not add the exercise to your log. Please try again.
            </Text>
          )}
          <Button
            label="add to log"
            disabled={!exerciseId || exercises.isError}
            loading={addToLog.isPending}
            onPress={() => {
              if (!exerciseId || addToLog.isPending) return;
              Keyboard.dismiss();
              addToLog.mutate(exerciseId, {
                onSuccess: () => {
                  close();
                  router.navigate("/");
                },
              });
            }}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flexShrink: 1,
    gap: 16,
  },
  errorText: {
    color: theme.dangerColor,
    fontSize: 14,
    lineHeight: 21,
  },
});
