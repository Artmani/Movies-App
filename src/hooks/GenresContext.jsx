import React, { createContext, useState, useEffect } from 'react'

export const GenresContext = createContext()

export function GenresProvider({ children }) {
  const [genres, setGenres] = useState([])

  const API_KEY = import.meta.env.VITE_TMDB_API_KEY

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=ru-RU`)
        const data = await response.json()
        setGenres(data.genres || [])
      } catch (error) {
        console.error('Ошибка при загрузке жанров:', error)
      }
    }

    fetchGenres()
  }, [API_KEY])

  return <GenresContext.Provider value={genres}>{children}</GenresContext.Provider>
}
