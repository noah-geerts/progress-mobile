import { useRef, useState } from "react";
import { Check, ChevronDown, ChevronUp } from "lucide-react-native";
import { ActivityIndicator, FlatList, Keyboard, Pressable, StyleSheet, Text, TextInput, View, useWindowDimensions } from "react-native";
import { theme } from "@/design/theme";

export type DropdownOption = {
  label: string;
  value: string;
};

export type DropdownProps = {
  options: DropdownOption[];
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  loading?: boolean;
  disabled?: boolean;
  searchable?: boolean;
  query: string;
  onChangeQuery: (query: string) => void;
  placeholder?: string;
  emptyMessage?: string;
};

export default function Dropdown({
  options,
  value,
  onChange,
  loading = false,
  disabled = false,
  searchable = false,
  query,
  onChangeQuery,
  placeholder = "Select an option",
  emptyMessage = "No options provided",
}: DropdownProps) {
  const { height } = useWindowDimensions();

  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const selectedOption = options.find((option) => option.value === value);
  const Chevron = isExpanded ? ChevronUp : ChevronDown;
  const indicator = loading ? <ActivityIndicator color={theme.primaryTextColor} /> : <Chevron color={theme.primaryTextColor} size={20} />;

  const resetSearch = () => {
    if (searchable) onChangeQuery("");
  };

  const toggleOptions = () => {
    if (isExpanded) {
      setIsExpanded(false);
      inputRef.current?.blur();
      resetSearch();
    } else if (searchable) {
      inputRef.current?.focus();
    } else {
      setIsExpanded(true);
    }
  };

  return (
    <View style={[styles.container, disabled && styles.disabled]}>
      {searchable ? (
        <View style={styles.inputRow}>
          <TextInput
            ref={inputRef}
            accessibilityLabel={placeholder}
            accessibilityState={{ disabled, expanded: isExpanded }}
            autoCapitalize="none"
            autoCorrect={false}
            editable={!disabled}
            placeholder={placeholder}
            placeholderTextColor={theme.secondaryTextColor}
            value={isExpanded ? query : (selectedOption?.label ?? query)}
            onFocus={() => {
              resetSearch();
              setIsExpanded(true);
            }}
            onChangeText={(text) => {
              onChange(undefined);
              onChangeQuery(text);
              setIsExpanded(true);
            }}
            style={styles.input}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={isExpanded ? "Close options" : "Show options"}
            accessibilityState={{ disabled, expanded: isExpanded }}
            disabled={disabled}
            onPress={toggleOptions}
            style={({ pressed }) => [styles.toggle, pressed && styles.togglePressed]}
          >
            {indicator}
          </Pressable>
        </View>
      ) : (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={selectedOption?.label ?? placeholder}
          accessibilityState={{ disabled, expanded: isExpanded }}
          disabled={disabled}
          onPress={toggleOptions}
          style={({ pressed }) => [styles.inputRow, pressed && styles.pressed]}
        >
          <Text style={[styles.input, !selectedOption && styles.placeholder]}>{selectedOption?.label ?? placeholder}</Text>
          <View style={styles.toggle}>{indicator}</View>
        </Pressable>
      )}
      {isExpanded && (
        <FlatList
          data={options}
          keyExtractor={(option) => option.value}
          keyboardShouldPersistTaps="handled"
          style={[styles.options, { maxHeight: Math.min(240, height * 0.3) }]}
          contentContainerStyle={styles.optionsContent}
          renderItem={({ item }) => (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: item.value === value, disabled }}
              disabled={disabled}
              onPress={() => {
                onChange(item.value);
                resetSearch();
                setIsExpanded(false);
                if (searchable) {
                  inputRef.current?.blur();
                  Keyboard.dismiss();
                }
              }}
              style={({ pressed }) => [styles.option, pressed && styles.pressed, item.value === value && styles.selected]}
            >
              <Text style={[styles.optionLabel, item.value === value && styles.selectedLabel]}>{item.label}</Text>
              {item.value === value && <Check color={theme.primaryTextColor} size={20} />}
            </Pressable>
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>{loading ? "Loading..." : emptyMessage}</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexShrink: 1,
    backgroundColor: theme.surfaceColor,
    borderRadius: 28,
    overflow: "hidden",
  },
  disabled: {
    opacity: 0.4,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 60,
    paddingRight: 8,
  },
  input: {
    flex: 1,
    minWidth: 0,
    color: theme.primaryTextColor,
    fontSize: 16,
    fontWeight: "600",
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  placeholder: {
    color: theme.secondaryTextColor,
  },
  toggle: {
    width: 44,
    height: 44,
    flexShrink: 0,
    borderRadius: 22,
    backgroundColor: theme.backgroundSelected,
    alignItems: "center",
    justifyContent: "center",
  },
  togglePressed: {
    backgroundColor: theme.backgroundColor,
  },
  options: {
    flexGrow: 0,
    flexShrink: 1,
  },
  optionsContent: {
    padding: 8,
    gap: 2,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 44,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 12,
  },
  optionLabel: {
    flex: 1,
    color: theme.primaryTextColor,
    fontSize: 16,
    fontWeight: "500",
  },
  selected: {
    backgroundColor: theme.backgroundSelected,
  },
  selectedLabel: {
    color: theme.primaryTextColor,
    fontWeight: "600",
  },
  pressed: {
    backgroundColor: theme.backgroundSelected,
  },
  emptyText: {
    color: theme.secondaryTextColor,
    padding: 14,
    fontSize: 14,
  },
});
