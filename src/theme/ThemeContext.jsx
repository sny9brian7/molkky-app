import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { DEFAULT_THEME_ID, THEMES, getTheme } from './themes.js'

const STORAGE_KEY = 'molkky_theme_id'
const EFFECTS_STORAGE_KEY = 'molkky_effects_enabled'
const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [themeId, setThemeId] = useState(() => localStorage.getItem(STORAGE_KEY) || DEFAULT_THEME_ID)
  const [effectsEnabled, setEffectsEnabled] = useState(
    () => localStorage.getItem(EFFECTS_STORAGE_KEY) !== 'false',
  )

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, themeId)
  }, [themeId])

  useEffect(() => {
    localStorage.setItem(EFFECTS_STORAGE_KEY, String(effectsEnabled))
  }, [effectsEnabled])

  const theme = useMemo(() => getTheme(themeId), [themeId])

  const value = useMemo(
    () => ({ theme, themeId, setThemeId, themes: THEMES, effectsEnabled, setEffectsEnabled }),
    [theme, themeId, effectsEnabled],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider')
  return ctx
}
