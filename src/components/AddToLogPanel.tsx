import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Keyboard, Pressable, ScrollView, StyleSheet, TextInput, Text, View } from "react-native";
import { theme } from "@/design/theme";
import { useGetAllExercises } from "@/services/exerciseService";
import { useCreatePE } from "@/services/performedExerciseService";
import { useCreateSession, useGetSession } from "@/services/sessionService";
import { useCurrentDay } from "../hooks/CurrentDayProvider";
import { usePanel } from "../design/hooks/PanelProvider";
import { X } from "lucide-react-native";

export default function AddToLogPanel() {
  const { currentDay } = useCurrentDay();
  const { close } = usePanel();
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const exercises = useGetAllExercises();
  const session = useGetSession(currentDay.format("YYYY-MM-DD"));
  const { mutateAsync: createSession } = useCreateSession(currentDay.format("YYYY-MM-DD"));
  const { mutateAsync: createPE } = useCreatePE(currentDay.format("YYYY-MM-DD"));

  const localDate = currentDay.format("YYYY-MM-DD");
  const filteredExercises = exercises.data?.filter((exercise) => exercise.name.toLowerCase().includes(query.toLowerCase())) ?? [];

  useEffect(() => {
    const show = Keyboard.addListener("keyboardWillShow", (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });

    const hide = Keyboard.addListener("keyboardWillHide", () => {
      setKeyboardHeight(0);
    });

    return () => {
      show.remove();
      hide.remove();
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

      const performedExercises = targetSession.performedExercises ?? [];
      const lastExercise = performedExercises[performedExercises.length - 1];
      await createPE({
        exerciseId: selectedExerciseId,
        sessionId: targetSession.id,
        position: lastExercise ? lastExercise.position + 1 : 0,
      });
    },
  });

  function handleChooseExercise(exerciseId: string) {
    if (!exerciseId || addToLog.isPending) return;
    addToLog.mutate(exerciseId, {
      onSuccess: () => {
        close();
        router.navigate({ pathname: "/", params: { scrollToBottom: "true" } });
      },
    });
  }

  return (
    <View style={{ paddingBottom: keyboardHeight, gap: 16 }}>
      <View style={styles.searchBar}>
        <TextInput style={styles.searchInput} value={query} onChangeText={setQuery} autoFocus={true} />
        {query !== "" && (
          <Pressable
            style={({ pressed }) => (pressed ? [styles.clearButton, styles.pressed] : styles.clearButton)}
            onPress={() => setQuery("")}
            hitSlop={20}
          >
            <X color={"white"} size={12} strokeWidth={3} />
          </Pressable>
        )}
      </View>
      <ScrollView style={styles.exercises} keyboardShouldPersistTaps="always">
        {filteredExercises.map((exercise, index) => (
          <Pressable
            onPress={() => handleChooseExercise(exercise.id)}
            id={exercise.id}
            style={({ pressed }) => [styles.exercise, pressed && styles.exercisePressed]}
          >
            <Text style={[styles.exerciseName, index > 0 && styles.exerciseBorder]}>{exercise.name}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  errorText: {
    color: theme.dangerColor,
    fontSize: 14,
    lineHeight: 21,
  },
  searchBar: {
    height: 36,
    borderRadius: 24,
    backgroundColor: theme.surfaceColor,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 12,
    paddingRight: 12,
    marginLeft: 16,
    marginRight: 16
  },
  searchInput: {
    flex: 1,
    height: "100%",
  },
  clearButton: {
    backgroundColor: "#707070",
    borderRadius: 12,
    padding: 2,
  },
  pressed: {
    backgroundColor: "#bababa",
  },
  exercises: {
    height: 250,
  },
  exercise: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  exercisePressed: {
    backgroundColor: theme.surfaceColor,
  },
  exerciseBorder: {
    borderTopColor: theme.borderColor,
    borderTopWidth: 1,
  },
  exerciseName: {
    fontSize: 14,
    paddingTop: 12,
    paddingBottom: 12
  },
});
