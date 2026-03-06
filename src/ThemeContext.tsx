import { createContext, useContext, useState, useEffect } from 'react'

type Theme = 'light' | 'dark'

const ThemeContext = createContext({
  theme: 'light' as Theme,
  toggleTheme: () => {},
  t: (light: string, _dark: string) => light,
})

export function useTheme() {
  return useContext(ThemeContext)
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    document.body.style.background = theme === 'light' ? '#FDF8F3' : '#0F1117'
  }, [theme])

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light')
  const t = (light: string, dark: string) => theme === 'light' ? light : dark

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, t }}>
      {children}
    </ThemeContext.Provider>
  )
}