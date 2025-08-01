"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  email: string
  password: any
  name?: string
  avatar?: string
  phone?: string
  location?: string
  bio?: string
  birthDate?: string
  occupation?: string
}

interface AuthContextType {
  user: User | null
  signIn: (user: User) => void
  signOut: () => void
  updateUser: (updates: Partial<User>) => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Check for stored user data on mount
    const storedUser = localStorage.getItem("ayurveda-user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const signIn = (userData: User) => {
    setUser(userData)
    localStorage.setItem("ayurveda-user", JSON.stringify(userData))
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem("ayurveda-user")
  }

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)
      localStorage.setItem("ayurveda-user", JSON.stringify(updatedUser))
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signOut,
        updateUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
