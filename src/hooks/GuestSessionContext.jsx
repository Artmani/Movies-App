import React, { createContext, useState, useEffect } from 'react'

export const GuestSessionContext = createContext()

export function GuestSessionProvider({ children }) {
  const [guestSessionId, setGuestSessionId] = useState(null)
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY

  useEffect(() => {
    const storedSessionId = localStorage.getItem('guest_session_id')
    if (storedSessionId) {
      setGuestSessionId(storedSessionId)
    } else {
      const createGuestSession = async () => {
        try {
          const response = await fetch(
            `https://api.themoviedb.org/3/authentication/guest_session/new?api_key=${API_KEY}`
          )
          const data = await response.json()
          if (data.success) {
            setGuestSessionId(data.guest_session_id)
            localStorage.setItem('guest_session_id', data.guest_session_id)
          } else {
            console.error('Ошибка при создании гостевой сессии:', data.status_message)
          }
        } catch (error) {
          console.error('Ошибка при создании гостевой сессии:', error)
        }
      }
      createGuestSession()
    }
  }, [])

  return <GuestSessionContext.Provider value={guestSessionId}>{children}</GuestSessionContext.Provider>
}
