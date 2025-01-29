import React, { createContext, useState, useEffect, useMemo } from 'react'

export const GuestSessionContext = createContext()

export function GuestSessionProvider({ children }) {
  const [guestSessionId, setGuestSessionId] = useState(null)
  const [ratedMovies, setRatedMovies] = useState([])

  const API_KEY = import.meta.env.VITE_TMDB_API_KEY

  const fetchRatedMovies = async () => {
    if (!guestSessionId) return

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/guest_session/${guestSessionId}/rated/movies?api_key=${API_KEY}&language=ru-RU`
      )

      if (response.status === 404) {
        setRatedMovies([])
        return
      }

      if (!response.ok) {
        console.error(`Ошибка запроса: ${response.status} ${response.statusText}`)
        return
      }

      const data = await response.json()
      setRatedMovies(data.results || [])
    } catch (error) {
      console.error('Ошибка загрузки оценённых фильмов:', error)
    }
  }

  useEffect(() => {
    const storedSessionId = localStorage.getItem('guest_session_id')

    if (storedSessionId) {
      setGuestSessionId(storedSessionId)
      fetchRatedMovies()
    } else {
      const createGuestSession = async () => {
        try {
          const response = await fetch(
            `https://api.themoviedb.org/3/authentication/guest_session/new?api_key=${API_KEY}`
          )

          if (!response.ok) {
            console.error(`Ошибка создания гостевой сессии: ${response.status} ${response.statusText}`)
            return
          }

          const data = await response.json()
          if (data.success && data.guest_session_id) {
            setGuestSessionId(data.guest_session_id)
            localStorage.setItem('guest_session_id', data.guest_session_id)
            fetchRatedMovies()
          }
        } catch (error) {
          console.error('Ошибка при создании гостевой сессии:', error)
        }
      }

      createGuestSession()
    }
  }, [])

  const removeMovieFromRated = (movieId) => {
    setRatedMovies((prev) => prev.filter((movie) => movie.id !== movieId))
  }

  const updateRatedMovie = (movieId, newRating) => {
    setRatedMovies((prevMovies) =>
      prevMovies.map((movie) => (movie.id === movieId ? { ...movie, rating: newRating } : movie))
    )
  }

  const contextValue = useMemo(
    () => ({
      guestSessionId,
      ratedMovies,
      fetchRatedMovies,
      removeMovieFromRated,
      updateRatedMovie,
    }),
    [guestSessionId, ratedMovies]
  )

  return <GuestSessionContext.Provider value={contextValue}>{children}</GuestSessionContext.Provider>
}
