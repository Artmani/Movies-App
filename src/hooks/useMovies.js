import { useState, useEffect } from 'react'

export const useMovies = (API_KEY, isOffline) => {
  const [movies, setMovies] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isOffline) return

    async function fetchMovies() {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=return&language=ru-RU`
        )

        if (!response.ok) {
          setError(`Ошибка: ${response.status} ${response.statusText}`)
          return
        }

        const data = await response.json()
        if (!data.results || data.results.length === 0) {
          setError('Результаты не найдены')
          return
        }

        setMovies(data.results)
      } catch (err) {
        setError(`Ошибка запроса: ${err.message}`)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMovies()
  }, [API_KEY, isOffline])

  return { movies, isLoading, error }
}
