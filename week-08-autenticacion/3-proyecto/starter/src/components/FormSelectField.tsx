import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';

import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';

interface SelectOption {
  label: string;
  value: string;
}

interface FormSelectFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  options: SelectOption[];
  errorMessage?: string;
}

export function FormSelectField<T extends FieldValues>({
  control,
  name,
  label,
  options,
  errorMessage,
}: FormSelectFieldProps<T>): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => {
          const selected = options.find((option) => option.value === value);

          return (
            <View>
              <Pressable
                style={[styles.trigger, errorMessage ? styles.inputError : null]}
                onPress={() => setIsOpen((current) => !current)}
                onBlur={onBlur}
                accessibilityRole="button"
                accessibilityState={{ expanded: isOpen }}
              >
                <Text style={styles.triggerText}>
                  {selected?.label ?? 'Selecciona una opción'}
                </Text>
                <Text style={styles.chevron}>{isOpen ? '▲' : '▼'}</Text>
              </Pressable>

              {isOpen && (
                <View style={styles.menu}>
                  {options.map((option) => {
                    const active = option.value === value;
                    return (
                      <Pressable
                        key={option.value}
                        style={[styles.option, active && styles.optionActive]}
                        onPress={() => {
                          onChange(option.value);
                          setIsOpen(false);
                        }}
                      >
                        <Text style={[styles.optionText, active && styles.optionTextActive]}>
                          {option.label}
                        </Text>
                        {active && <Text style={styles.check}>✓</Text>}
                      </Pressable>
                    );
                  })}
                </View>
              )}
            </View>
          );
        }}
      />
      <Text style={styles.error}>{errorMessage ?? ''}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: SPACING.xs },
  label: { ...TYPOGRAPHY.label },
  trigger: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputError: { borderColor: COLORS.danger },
  triggerText: { ...TYPOGRAPHY.body, textTransform: 'capitalize' },
  chevron: { color: COLORS.textMuted, fontSize: 12 },
  menu: {
    marginTop: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.surface,
    overflow: 'hidden',
  },
  option: {
    minHeight: 48,
    paddingHorizontal: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionActive: { backgroundColor: COLORS.surfaceHigh },
  optionText: { ...TYPOGRAPHY.body },
  optionTextActive: { color: COLORS.accent, fontWeight: '700' },
  check: { color: COLORS.accent, fontSize: 18, fontWeight: '700' },
  error: { fontSize: 12, color: COLORS.danger, minHeight: 16 },
});
