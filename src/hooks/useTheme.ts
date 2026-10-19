import { useSyncExternalStore } from 'react'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'everly-theme'

function initial(): Theme {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'light' || saved === 'dark') return saved
  } catch {
    // хадгалсан сонголтгүй бол төхөөрөмжийн тохиргоог дагана
  }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

let theme: Theme = initial()
const listeners = new Set<() => void>()

const apply = () => {
  document.documentElement.dataset.theme = theme
}
apply()

export function toggleTheme() {
  theme = theme === 'dark' ? 'light' : 'dark'
  apply()
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // хадгалж чадахгүй бол энэ удаад л үйлчилнэ
  }
  listeners.forEach((l) => l())
}

const subscribe = (l: () => void) => {
  listeners.add(l)
  return () => listeners.delete(l)
}

export const useTheme = () => useSyncExternalStore(subscribe, () => theme)
