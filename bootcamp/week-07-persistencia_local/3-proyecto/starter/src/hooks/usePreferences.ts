import { useEffect, useState } from 'react'
import { storage } from '../storage/mmkv'

const SORT_ORDER_KEY = 'sortOrder'
const COMPACT_MODE_KEY = 'compactMode'
const ITEMS_PER_PAGE_KEY = 'itemsPerPage'

export function usePreferences() {
  const [sortOrder, setSortOrderState] = useState('asc')
  const [compactMode, setCompactModeState] = useState(false)
  const [itemsPerPage, setItemsPerPageState] = useState(10)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadPreferences() {
      try {
        const storedSortOrder = await storage.getString(SORT_ORDER_KEY)
        const storedCompactMode = await storage.getString(COMPACT_MODE_KEY)
        const storedItemsPerPage = await storage.getString(ITEMS_PER_PAGE_KEY)

        if (storedSortOrder) {
          setSortOrderState(storedSortOrder)
        }

        if (storedCompactMode !== undefined) {
          setCompactModeState(storedCompactMode === 'true')
        }

        if (storedItemsPerPage) {
          setItemsPerPageState(Number(storedItemsPerPage))
        }
      } catch (error) {
        console.error('Error cargando preferencias:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadPreferences()
  }, [])

  async function setSortOrder(value: string) {
    setSortOrderState(value)
    await storage.set(SORT_ORDER_KEY, value)
  }

  async function setCompactMode(value: boolean) {
    setCompactModeState(value)
    await storage.set(COMPACT_MODE_KEY, value)
  }

  async function setItemsPerPage(value: number) {
    setItemsPerPageState(value)
    await storage.set(ITEMS_PER_PAGE_KEY, value)
  }

  return {
    sortOrder,
    setSortOrder,
    compactMode,
    setCompactMode,
    itemsPerPage,
    setItemsPerPage,
    isLoading,
  }
}