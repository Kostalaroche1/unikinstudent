"use client"

import React, { createContext, useContext, useState } from 'react'

const AuthUserContext = createContext()

export const ContextProvide = ({ children }) => {
    const [user, setUser] = useState(null)
    const [book, setBook] = useState([])
    return (
        <AuthUserContext.Provider value={{ user, setUser, book, setBook }}>
            {children}
        </AuthUserContext.Provider>
    )
}

export const useUserContext = () => useContext(AuthUserContext)