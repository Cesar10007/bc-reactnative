// src/screens/EditScreen.tsx
import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';

import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';
import type { RootStackParamList } from '../navigation/types';
import { PizzaFormField } from '../components/PizzaFormField';
import { FormSelectField } from '../components/FormSelectField';
import { itemSchema, type ItemFormData } from '../schemas/itemSchema';
import { useItemById, useUpdateItem } from '../hooks/useItems';
import { useSavedStore } from '../stores/savedStore';

type EditNavProp = NativeStackNavigationProp<RootStackParamList, 'Edit'>;
type EditRouteProp = RouteProp<RootStackParamList, 'Edit'>;

export function EditScreen(): React.JSX.Element {
  const navigation = useNavigation<EditNavProp>();
  const route = useRoute<EditRouteProp>();
  const { id } = route.params;

  const { data: item, isLoading } = useItemById(id);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ItemFormData>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      name: '',
      description: '',
      price: '',
      flavor: '',
      doughType: 'delgada',
    },
  });

  useEffect(() => {
    if (item) {
      reset({
        name: item.name,
        description: item.description ?? '',
        price: String(item.price),
        flavor: item.flavor,
        doughType: item.doughType,
      });
    }
  }, [item, reset]);

  const { mutate: updateItem, isPending } = useUpdateItem();
  const updateFavorite = useSavedStore((state) => state.updateItem);

  const onSubmit: SubmitHandler<ItemFormData> = (data) => {
    updateItem(
      {
        id,
        name: data.name,
        description: data.description ?? '',
        price: Number(data.price),
        flavor: data.flavor,
        doughType: data.doughType,
        image: item?.image ?? 'https://picsum.photos/id/292/300/200',
      },
      {
        onSuccess: (updatedItem) => {
          updateFavorite(updatedItem);
          navigation.goBack();
        },
      },
    );
  };

  const submitting = isSubmitting || isPending;
  const canSubmit = !submitting && isDirty;

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 24}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        automaticallyAdjustKeyboardInsets
      >
        <Text style={styles.hint}>
          Los campos se rellenan automáticamente con los datos actuales de la pizza.
          Modifica lo que necesites y guarda.
        </Text>

        <PizzaFormField<ItemFormData>
          control={control}
          name="name"
          label="Nombre de la pizza *"
          placeholder="Ej. Pizza Ranchera"
          returnKeyType="next"
          errorMessage={errors.name?.message}
        />

        <PizzaFormField<ItemFormData>
          control={control}
          name="flavor"
          label="Sabor *"
          placeholder="Ej. Pollo, tocineta y maíz"
          returnKeyType="next"
          errorMessage={errors.flavor?.message}
        />

        <PizzaFormField<ItemFormData>
          control={control}
          name="price"
          label="Precio *"
          placeholder="Ej. 32000"
          keyboardType="numeric"
          returnKeyType="next"
          errorMessage={errors.price?.message}
        />

        <FormSelectField<ItemFormData>
          control={control}
          name="doughType"
          label="Tipo de masa *"
          options={[
            { label: 'Delgada', value: 'delgada' },
            { label: 'Gruesa', value: 'gruesa' },
          ]}
          errorMessage={errors.doughType?.message}
        />

        <PizzaFormField<ItemFormData>
          control={control}
          name="description"
          label="Descripción"
          placeholder="Describe los ingredientes de la pizza..."
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          errorMessage={errors.description?.message}
        />

        <View style={styles.actions}>
          <Pressable
            style={[styles.button, !canSubmit && styles.buttonDisabled]}
            onPress={handleSubmit(onSubmit)}
            disabled={!canSubmit}
            accessibilityRole="button"
            accessibilityLabel="Guardar cambios"
          >
            {submitting ? (
              <ActivityIndicator size="small" color={COLORS.background} />
            ) : (
              <Text style={styles.buttonText}>Guardar cambios</Text>
            )}
          </Pressable>

          <Pressable
            style={styles.cancel}
            onPress={() => navigation.goBack()}
            disabled={submitting}
          >
            <Text style={styles.cancelText}>Cancelar</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1 },
  content: { padding: SPACING.lg, gap: SPACING.md, paddingBottom: 180 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  hint: { ...TYPOGRAPHY.caption, fontStyle: 'italic' },
  actions: { gap: SPACING.sm, marginTop: SPACING.sm },
  button: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.sm,
    padding: SPACING.md,
    alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.45 },
  buttonText: { ...TYPOGRAPHY.body, fontWeight: '700', color: COLORS.background },
  cancel: { alignItems: 'center', padding: SPACING.sm },
  cancelText: { ...TYPOGRAPHY.body, color: COLORS.textMuted },
});