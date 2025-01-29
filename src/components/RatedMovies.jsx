import React, { useContext, useEffect, useState } from 'react'

import { GuestSessionContext } from '../hooks/GuestSessionContext'
import { useNetworkStatus } from '../hooks/useNetworkStatus'

import MovieList from './MovieList'
import OfflineAlert from './OfflineAlert'
import ErrorAlert from './ErrorAlert'
import LoadingIndicator from './LoadingIndicator'

function RatedMovies() {
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY
  const guestSessionId = useContext(GuestSessionContext)
  const isOffline = useNetworkStatus()

  const [ratedMovies, setRatedMovies] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchRatedMovies = async () => {
    if (!guestSessionId) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/guest_session/${guestSessionId}/rated/movies?api_key=${API_KEY}&language=ru-RU`
      )
      if (!response.ok) {
        setError(`Ошибка: ${response.status} ${response.statusText}`)
        return
      }

      const data = await response.json()
      setRatedMovies(data.results || [])
    } catch (err) {
      setError(`Ошибка загрузки: ${err.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRatedMovies()
  }, [guestSessionId])

  const handleRatingChange = (movieId, newRating) => {
    if (newRating === null) {
      setRatedMovies((prevMovies) => prevMovies.filter((movie) => movie.id !== movieId))
    } else {
      setRatedMovies((prevMovies) =>
        prevMovies.map((movie) => (movie.id === movieId ? { ...movie, rating: newRating } : movie))
      )
    }
  }

  return (
    <div className="app-container">
      {isOffline && <OfflineAlert />}
      {error && <ErrorAlert message={error} />}
      {isLoading ? <LoadingIndicator /> : <MovieList movies={ratedMovies} onRatingChange={handleRatingChange} />}
    </div>
  )
}

export default RatedMovies
