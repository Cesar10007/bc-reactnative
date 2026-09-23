import {
  useMMKVBoolean,
  useMMKVNumber,
  useMMKVString,
} from 'react-native-mmkv';

import { storage } from '../storage/mmkv';

const PREF_KEYS = {
  SORT_ORDER: 'pref_sortOrder',
  COMPACT_MODE: 'pref_compactMode',
  ITEMS_PER_PAGE: 'pref_itemsPerPage',
} as const;

export type SortOrder = 'asc' | 'desc';

export function usePreferences() {
  const [storedSortOrder, setStoredSortOrder] = useMMKVString(
    PREF_KEYS.SORT_ORDER,
    storage,
  );

  const [compactMode, setCompactMode] = useMMKVBoolean(
    PREF_KEYS.COMPACT_MODE,
    storage,
  );

  const [itemsPerPage, setItemsPerPage] = useMMKVNumber(
    PREF_KEYS.ITEMS_PER_PAGE,
    storage,
  );

  return {
    sortOrder: (storedSortOrder ?? 'asc') as SortOrder,

    setSortOrder: (value: SortOrder) => {
      setStoredSortOrder(value);
    },

    compactMode: compactMode ?? false,

    setCompactMode: (value: boolean) => {
      setCompactMode(value);
    },

    itemsPerPage: itemsPerPage ?? 10,

    setItemsPerPage: (value: number) => {
      setItemsPerPage(value);
    },
  };
}