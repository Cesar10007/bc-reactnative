import {
  useMMKVBoolean,
  useMMKVNumber,
  useMMKVString,
} from 'react-native-mmkv';

import { storage } from '../storage/mmkv';

const PREF_KEYS = {
  SORT_ORDER: 'preferences.sortOrder',
  COMPACT_MODE: 'preferences.compactMode',
  ITEMS_PER_PAGE: 'preferences.itemsPerPage',
} as const;

export type SortOrder = 'asc' | 'desc';

export function usePreferences() {
  const [storedSortOrder, setStoredSortOrder] = useMMKVString(
    PREF_KEYS.SORT_ORDER,
    storage,
  );
  const [storedCompactMode, setCompactMode] = useMMKVBoolean(
    PREF_KEYS.COMPACT_MODE,
    storage,
  );
  const [storedItemsPerPage, setItemsPerPage] = useMMKVNumber(
    PREF_KEYS.ITEMS_PER_PAGE,
    storage,
  );

  const sortOrder: SortOrder =
    storedSortOrder === 'desc' ? 'desc' : 'asc';
  const compactMode = storedCompactMode ?? false;
  const itemsPerPage = storedItemsPerPage ?? 10;

  function setSortOrder(value: SortOrder): void {
    setStoredSortOrder(value);
  }

  return {
    sortOrder,
    setSortOrder,
    compactMode,
    setCompactMode,
    itemsPerPage,
    setItemsPerPage,
    isLoading: false,
  };
}
