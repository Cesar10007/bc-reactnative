import React from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useForm, type SubmitHandler } from 'react-hook-form';

import { FormField } from '../components/FormField';
import { FormSelectField } from '../components/FormSelectField';
import { useCreateItem } from '../hooks/useItems';
import type { RootStackParamList } from '../navigation/types';
import { itemSchema, type ItemFormData } from '../schemas/itemSchema';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';

type CreateNavProp = NativeStackNavigationProp<RootStackParamList, 'Create'>;

export function CreateScreen(): React.JSX.Element {
  const navigation = useNavigation<CreateNavProp>();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
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

  const { mutate: createItem, isPending } = useCreateItem();

  const onSubmit: SubmitHandler<ItemFormData> = (data) => {
    createItem(
      {
        name: data.name,
        description: data.description ?? '',
        price: Number(data.price),
        flavor: data.flavor,
        doughType: data.doughType,
        image: 'https://picsum.photos/id/292/300/200',
      },
      {
        onSuccess: () => navigation.goBack(),
        onError: () => {
          Alert.alert('No se pudo crear', 'Revisa los datos e inténtalo nuevamente.');
        },
      },
    );
  };

  const submitting = isSubmitting || isPending;

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
        <Text style={styles.hint}>
          Completa los datos de la nueva pizza. Los campos marcados con * son obligatorios.
        </Text>

        <FormField<ItemFormData>
          control={control}
          name="name"
          label="Nombre de la pizza *"
          placeholder="Ej. Pizza Ranchera"
          returnKeyType="next"
          errorMessage={errors.name?.message}
        />

        <FormField<ItemFormData>
          control={control}
          name="flavor"
          label="Sabor *"
          placeholder="Ej. Pollo, tocineta y maíz"
          returnKeyType="next"
          errorMessage={errors.flavor?.message}
        />

        <FormField<ItemFormData>
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

        <FormField<ItemFormData>
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
            style={[styles.button, submitting && styles.buttonDisabled]}
            onPress={handleSubmit(onSubmit)}
            disabled={submitting}
            accessibilityRole="button"
            accessibilityLabel="Crear pizza"
          >
            {submitting ? (
              <ActivityIndicator size="small" color={COLORS.background} />
            ) : (
              <Text style={styles.buttonText}>Crear pizza</Text>
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
  flex: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: SPACING.lg,
    gap: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  hint: {
    ...TYPOGRAPHY.caption,
    fontStyle: 'italic',
  },
  actions: {
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  button: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.sm,
    padding: SPACING.md,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.45,
  },
  buttonText: {
    ...TYPOGRAPHY.body,
    fontWeight: '700',
    color: COLORS.background,
  },
  cancel: {
    alignItems: 'center',
    padding: SPACING.sm,
  },
  cancelText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textMuted,
  },
});