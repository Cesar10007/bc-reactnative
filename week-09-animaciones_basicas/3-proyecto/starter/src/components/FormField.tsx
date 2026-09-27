import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';
import { theme } from '../theme';

interface FormFieldProps extends TextInputProps {
  label: string;
  error?: string;
}

export function FormField({
  label,
  error,
  secureTextEntry = false,
  ...inputProps
}: FormFieldProps): React.JSX.Element {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            secureTextEntry && styles.inputWithAction,
            error ? styles.inputError : null,
          ]}
          placeholderTextColor={theme.colors.textMuted}
          secureTextEntry={secureTextEntry && !passwordVisible}
          {...inputProps}
        />
        {secureTextEntry && (
          <Pressable
            style={styles.visibilityButton}
            onPress={() => setPasswordVisible((visible) => !visible)}
            accessibilityRole="button"
            accessibilityLabel={passwordVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            <Text style={styles.visibilityText}>
              {passwordVisible ? 'Ocultar' : 'Ver'}
            </Text>
          </Pressable>
        )}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 6 },
  label: { fontSize: theme.fontSize.sm, fontWeight: '600', color: theme.colors.textSecondary },
  inputContainer: { position: 'relative', justifyContent: 'center' },
  input: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 12,
    color: theme.colors.text,
    fontSize: theme.fontSize.md,
  },
  inputWithAction: { paddingRight: 72 },
  inputError: { borderColor: theme.colors.danger },
  visibilityButton: {
    position: 'absolute',
    right: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  visibilityText: { color: theme.colors.brand, fontSize: theme.fontSize.sm, fontWeight: '700' },
  errorText: { fontSize: theme.fontSize.xs, color: theme.colors.danger },
});
