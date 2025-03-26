import React from 'react'

// Define the shape of your context data
interface GlobalContextType {
    isDarkMode: boolean
    history: string[]
    captures: { white: (string | undefined)[], black: (string | undefined)[] }
    setCaptures: (captures: { white: (string | undefined)[], black: (string | undefined)[] }) => void
    setHistory: (history: string[]) => void
    toggleDarkMode: () => void
}

// Create the context with a default value
const GlobalContext = React.createContext<GlobalContextType | undefined>(undefined)

// Provider component
interface GlobalProviderProps {
    children: React.ReactNode
}

export const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = React.useState(false)
    const [history, setHistory] = React.useState<string[]>([])
    const [captures, setCaptures] = React.useState<{ white: (string | undefined)[], black: (string | undefined)[] }>({ white: [], black: [] })

    const toggleDarkMode = () => {
        setIsDarkMode(prev => !prev)
    }

    const value = {
        isDarkMode,
        toggleDarkMode,
        history,
        setHistory,
        captures,
        setCaptures
    }

    return (
        <GlobalContext.Provider value={value}>
            {children}
        </GlobalContext.Provider>
    )
}

// Custom hook for easy context access
export const useGlobal = () => {
    const context = React.useContext(GlobalContext)
    if (context === undefined) {
        throw new Error('useGlobal must be used within a GlobalProvider')
    }
    return context
}
