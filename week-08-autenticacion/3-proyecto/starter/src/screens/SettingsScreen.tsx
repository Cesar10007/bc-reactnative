import React, { useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';

import { clearPizzaRutaLocalData } from '../hooks/useItems';
import { usePreferences } from '../hooks/usePreferences';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';

const SENSITIVE_KEY = 'pizza_ruta/delivery_pin';

export function SettingsScreen(): React.JSX.Element {
  const {
    sortOrder,
    setSortOrder,
    compactMode,
    setCompactMode,
    itemsPerPage,
    setItemsPerPage,
  } = usePreferences();

  const [deliveryPin, setDeliveryPin] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [maskedValue, setMaskedValue] = useState<string | null>(null);

  async function handleSaveSensitive(): Promise<void> {
    if (!/^\d{4,6}$/.test(deliveryPin)) {
      Alert.alert('PIN inválido', 'Escribe un PIN de entrega de 4 a 6 números.');
      return;
    }

    try {
      await SecureStore.setItemAsync(SENSITIVE_KEY, deliveryPin);
      setDeliveryPin('');

      setIsSaved(true);
      setMaskedValue(null);

      Alert.alert(
        'Guardado',
        'El dato sensible fue guardado de forma cifrada.',
      );
    } catch {
      Alert.alert(
        'Error',
        'No fue posible guardar el dato sensible.',
      );
    }
  }

  async function handleReadSensitive(): Promise<void> {
    try {
      const value = await SecureStore.getItemAsync(SENSITIVE_KEY);

      if (!value) {
        setIsSaved(false);
        setMaskedValue(null);

        Alert.alert(
          'No encontrado',
          'No hay dato sensible guardado aún.',
        );

        return;
      }

      const masked = `${value.slice(0, 3)}•••${value.slice(-3)}`;

      setIsSaved(true);
      setMaskedValue(masked);
    } catch {
      Alert.alert(
        'Error',
        'No fue posible leer el dato sensible.',
      );
    }
  }

  async function handleClearCache(): Promise<void> {
    try {
      await clearPizzaRutaLocalData();
      Alert.alert('Caché eliminada', 'El catálogo offline y los datos de sincronización fueron eliminados.');
    } catch {
      Alert.alert('Error', 'No fue posible limpiar la caché.');
    }
  }

  async function handleDeleteSensitive(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(SENSITIVE_KEY);

      setIsSaved(false);
      setMaskedValue(null);

      Alert.alert(
        'Eliminado',
        'El dato sensible fue removido de SecureStore.',
      );
    } catch {
      Alert.alert(
        'Error',
        'No fue posible eliminar el dato sensible.',
      );
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.sectionTitle}>Preferencias de la app</Text>

      <Text style={styles.sectionHint}>
        Estos valores se guardan localmente y cambian en tiempo real.
      </Text>

      <View style={styles.row}>
        <View style={styles.rowInfo}>
          <Text style={styles.rowLabel}>Modo compacto</Text>

          <Text style={styles.rowDesc}>
            Muestra una tarjeta reducida por pizza
          </Text>
        </View>

        <Switch
          value={compactMode}
          onValueChange={setCompactMode}
          trackColor={{
            false: COLORS.border,
            true: COLORS.accent,
          }}
          thumbColor={COLORS.background}
        />
      </View>

      <View style={[styles.row, styles.rowColumn]}>
        <Text style={styles.rowLabel}>Orden de la lista</Text>

        <View style={styles.segmented}>
          {(['asc', 'desc'] as const).map((option) => (
            <Pressable
              key={option}
              style={[
                styles.segment,
                sortOrder === option && styles.segmentActive,
              ]}
              onPress={() => setSortOrder(option)}
            >
              <Text
                style={[
                  styles.segmentText,
                  sortOrder === option && styles.segmentTextActive,
                ]}
              >
                {option === 'asc' ? 'A → Z' : 'Z → A'}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.rowDesc}>
          Valor actual: <Text style={styles.mono}>{sortOrder}</Text>
        </Text>
      </View>

      <View style={[styles.row, styles.rowColumn]}>
        <Text style={styles.rowLabel}>Pizzas por página</Text>

        <View style={styles.segmented}>
          {([5, 10, 20] as const).map((amount) => (
            <Pressable
              key={amount}
              style={[
                styles.segment,
                itemsPerPage === amount && styles.segmentActive,
              ]}
              onPress={() => setItemsPerPage(amount)}
            >
              <Text
                style={[
                  styles.segmentText,
                  itemsPerPage === amount && styles.segmentTextActive,
                ]}
              >
                {amount}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.rowDesc}>
          Valor actual: <Text style={styles.mono}>{itemsPerPage}</Text>
        </Text>
      </View>

      <Text style={[styles.sectionTitle, { marginTop: SPACING.xl }]}>
        Datos sensibles (SecureStore)
      </Text>

      <Text style={styles.sectionHint}>
        SecureStore cifra el valor localmente. La interfaz nunca muestra el
        valor completo.
      </Text>

      <TextInput
        style={styles.secureInput}
        value={deliveryPin}
        onChangeText={setDeliveryPin}
        placeholder="PIN de entrega (4 a 6 números)"
        placeholderTextColor={COLORS.textMuted}
        keyboardType="number-pad"
        secureTextEntry
        maxLength={6}
      />

      {isSaved && (
        <Text style={styles.savedStatus}>Dato sensible guardado.</Text>
      )}

      {maskedValue && (
        <View style={styles.maskedContainer}>
          <Text style={styles.rowLabel}>Valor leído (enmascarado):</Text>

          <Text style={styles.maskedValue}>{maskedValue}</Text>
        </View>
      )}

      <View style={styles.secureActions}>
        <Pressable style={styles.btnSecure} onPress={handleSaveSensitive}>
          <Text style={styles.btnSecureText}>Guardar</Text>
        </Pressable>

        <Pressable
          style={[styles.btnSecure, styles.btnSecureAlt]}
          onPress={handleReadSensitive}
        >
          <Text style={[styles.btnSecureText, { color: COLORS.accent }]}>
            Leer
          </Text>
        </Pressable>

        <Pressable
          style={[styles.btnSecure, styles.btnDanger]}
          onPress={handleDeleteSensitive}
        >
          <Text style={[styles.btnSecureText, { color: '#ef4444'}]}>
            Eliminar
          </Text>
        </Pressable>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          El PIN se guarda cifrado en SecureStore y nunca en AsyncStorage o MMKV.
        </Text>
      </View>

      <Text style={[styles.sectionTitle, { marginTop: SPACING.xl }]}>Caché offline</Text>
      <Text style={styles.sectionHint}>
        El catálogo se guarda con AsyncStorage para poder consultarlo sin conexión.
      </Text>
      <Pressable style={[styles.btnSecure, styles.btnDanger]} onPress={handleClearCache}>
        <Text style={[styles.btnSecureText, { color: '#ef4444' }]}>Limpiar catálogo guardado</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
    gap: SPACING.sm,
  },
  sectionTitle: {
    ...TYPOGRAPHY.heading,
    marginBottom: SPACING.xs,
  },
  sectionHint: {
    ...TYPOGRAPHY.caption,
    marginBottom: SPACING.md,
    fontStyle: 'italic',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.sm,
    padding: SPACING.md,
  },
  rowColumn: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: SPACING.sm,
  },
  rowInfo: {
    flex: 1,
    marginRight: SPACING.md,
  },
  rowLabel: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
  },
  rowDesc: {
    ...TYPOGRAPHY.caption,
    marginTop: 2,
  },
  mono: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  segmented: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  segment: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  segmentActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  segmentText: {
    ...TYPOGRAPHY.caption,
  },
  segmentTextActive: {
    color: COLORS.background,
    fontWeight: '700',
  },
  secureInput: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    padding: SPACING.md,
    ...TYPOGRAPHY.body,
  },
  savedStatus: {
    ...TYPOGRAPHY.caption,
    color: COLORS.accent,
    fontWeight: '600',
  },
  maskedContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.sm,
    padding: SPACING.md,
    gap: SPACING.xs,
  },
  maskedValue: {
    ...TYPOGRAPHY.body,
    fontWeight: '700',
    color: COLORS.accent,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  secureActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  btnSecure: {
    flex: 1,
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
    alignItems: 'center',
  },
  btnSecureAlt: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  btnDanger: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  btnSecureText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '700',
    color: COLORS.background,
  },
  infoBox: {
    backgroundColor: COLORS.surface,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.accent,
    borderRadius: RADIUS.sm,
    padding: SPACING.md,
    marginTop: SPACING.md,
  },
  infoText: {
    ...TYPOGRAPHY.caption,
  },
});