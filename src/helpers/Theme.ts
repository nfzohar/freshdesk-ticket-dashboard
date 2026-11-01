import { reactive } from 'vue'

export type ThemePreference = 'system' | 'light' | 'dark'

// Keep in sync with the inline script in index.html.
const storageKey = 'theme_preference'
const preferences: ThemePreference[] = ['system', 'light', 'dark']
const darkQuery = window.matchMedia('(prefers-color-scheme: dark)')

export const theme = reactive({
  preference: readPreference(),
  dark: false
})

function readPreference(): ThemePreference {
  try {
    const stored = localStorage.getItem(storageKey) as ThemePreference
    return preferences.includes(stored) ? stored : 'system'
  } catch {
    return 'system'
  }
}

function applyTheme() {
  theme.dark = theme.preference == 'dark' || (theme.preference == 'system' && darkQuery.matches)
  document.documentElement.classList.toggle('dark', theme.dark)
}

export function setThemePreference(preference: ThemePreference) {
  theme.preference = preference

  try {
    localStorage.setItem(storageKey, preference)
  } catch {
    // Storage unavailable (private mode): the choice lasts for this session only.
  }
  applyTheme()
}

export function initTheme() {
  applyTheme()
  darkQuery.addEventListener('change', applyTheme)
}
