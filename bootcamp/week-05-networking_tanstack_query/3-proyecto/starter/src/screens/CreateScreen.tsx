// src/screens/CreateScreen.tsx
// Pantalla modal para crear un nuevo ítem.
// El aprendiz debe conectar useMutation y manejar el retorno al listado.

import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';
import { useCreateItem } from '../hooks/useItems';
import type { RootStackParamList } from '../navigation/types';

// TODO: importar el hook de creación
// import { useCreateItem } from '../hooks/useItems';

type CreateNavProp = NativeStackNavigationProp<RootStackParamList, 'Create'>;

// ============================================================
// PANTALLA: CreateScreen
// ============================================================

export function CreateScreen(): React.JSX.Element {
  const navigation = useNavigation<CreateNavProp>();

  // Campos del formulario — adapta al dominio asignado
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [price, setPrice] = useState('');

  const { mutate: createItem, isPending } = useCreateItem();

  function handleSubmit(): void {
    if (!title.trim()) return;

    createItem(
      {
        name: title.trim(),
        image: 'https://picsum.photos/id/292/300/200',
        description: body.trim() || 'Pizza artesanal de Pizza Ruta.',
        price: Number(price) || 30000,
        flavor: title.trim(),
        doughType: 'delgada',
      },
      { onSuccess: () => navigation.goBack() },
    );
  }

  const canSubmit = title.trim().length > 0 && !isPending;

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.sectionLabel}>Datos del nuevo ítem</Text>

        {/* Campo nombre / título */}
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>
            Nombre{' '}
            <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Nombre del ítem…"
            placeholderTextColor={COLORS.textMuted}
            returnKeyType="next"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Precio</Text>
          <TextInput
            style={styles.input}
            value={price}
            onChangeText={setPrice}
            placeholder="30000"
            placeholderTextColor={COLORS.textMuted}
            keyboardType="numeric"
          />
        </View>

        {/* Campo descripción / cuerpo (genérico) */}
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Descripción</Text>
          <TextInput
            style={[styles.input, styles.multiline]}
            value={body}
            onChangeText={setBody}
            placeholder="Descripción opcional…"
            placeholderTextColor={COLORS.textMuted}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Botón de envío */}
        <Pressable
          style={[styles.button, !canSubmit && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={!canSubmit}
        >
          {isPending ? (
            <ActivityIndicator size="small" color={COLORS.background} />
          ) : (
            <Text style={styles.buttonText}>Crear ítem</Text>
          )}
        </Pressable>

        {/* Botón cancelar */}
        <Pressable style={styles.cancel} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelText}>Cancelar</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ============================================================
// ESTILOS
// ============================================================

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1 },
  content: { padding: SPACING.lg, gap: SPACING.md, paddingBottom: SPACING.xxl },
  sectionLabel: { ...TYPOGRAPHY.label, textTransform: 'uppercase', letterSpacing: 0.8 },
  field: { gap: SPACING.xs },
  fieldLabel: { ...TYPOGRAPHY.body, fontWeight: '600' },
  required: { color: COLORS.error },
  input: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
  },
  multiline: { minHeight: 96, paddingTop: SPACING.sm },
  button: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.sm,
    padding: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  buttonDisabled: { opacity: 0.45 },
  buttonText: { ...TYPOGRAPHY.body, fontWeight: '700', color: COLORS.background },
  cancel: { alignItems: 'center', padding: SPACING.sm },
  cancelText: { ...TYPOGRAPHY.body, color: COLORS.textMuted },
});
