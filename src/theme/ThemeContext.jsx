import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { DEFAULT_THEME_ID, THEMES, getTheme } from './themes.js'

const STORAGE_KEY = 'molkky_theme_id'
const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [themeId, setThemeId] = useState(() => localStorage.getItem(STORAGE_KEY) || DEFAULT_THEME_ID)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, themeId)
  }, [themeId])

  const theme = useMemo(() => getTheme(themeId), [themeId])

  const value = useMemo(() => ({ theme, themeId, setThemeId, themes: THEMES }), [theme, themeId])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider')
  return ctx
}
