import { useState } from "react";
import dayjs, { type Dayjs } from "dayjs";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DashboardHeader from "@/components/DashboardHeader";
import { theme } from "@/common/theme";

export default function Index() {
  const [currentDay, setCurrentDay] = useState<Dayjs>(() => dayjs().startOf("day"));

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <DashboardHeader currentDay={currentDay} setCurrentDay={setCurrentDay} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.backgroundColor,
    flex: 1,
  },
});
