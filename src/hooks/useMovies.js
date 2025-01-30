import { useState, useEffect } from 'react'

export const useMovies = (API_KEY, searchQuery, page) => {
  const [movies, setMovies] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [totalResults, setTotalResults] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    if (!searchQuery.trim()) {
      setMovies([])
      setTotalResults(0)
      setTotalPages(0)
      setIsLoading(false)
      setError(null)
      return
    }

    async function fetchMovies() {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${searchQuery}&page=${page}&language=ru-RU`
        )

        if (!response.ok) {
          setMovies([])
          setError(`Ошибка: ${response.status} ${response.statusText}`)
          return
        }

        const data = await response.json()
        if (!data.results || data.results.length === 0) {
          setMovies([])
          setError('Результаты не найдены')
          setTotalResults(0)
          setTotalPages(0)
          return
        }

        setMovies(data.results)
        setTotalResults(data.total_results)
        setTotalPages(data.total_pages)
      } catch (err) {
        setError(`Ошибка запроса: ${err.message}`)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMovies()
  }, [API_KEY, searchQuery, page])

  return { movies, isLoading, error, totalResults, totalPages }
}
