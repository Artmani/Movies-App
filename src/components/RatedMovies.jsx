import React, { useContext, useEffect, useState } from 'react'

import { GuestSessionContext } from '../hooks/GuestSessionContext'
import { useNetworkStatus } from '../hooks/useNetworkStatus'

import MovieList from './MovieList'
import OfflineAlert from './OfflineAlert'
import ErrorAlert from './ErrorAlert'
import LoadingIndicator from './LoadingIndicator'

function RatedMovies() {
  const { ratedMovies, fetchRatedMovies } = useContext(GuestSessionContext)
  const isOffline = useNetworkStatus()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    setIsLoading(true)
    fetchRatedMovies()
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false))
  }, [])

  if (isLoading) {
    return <LoadingIndicator />
  }

  return (
    <div className="app-container">
      {isOffline && <OfflineAlert />}
      {error && <ErrorAlert message={error} />}
      {ratedMovies.length === 0 ? (
        <p style={{ textAlign: 'center', fontSize: '18px', color: '#999' }}>Оценённых фильмов нет</p>
      ) : (
        <MovieList movies={ratedMovies} onRatingChange={fetchRatedMovies} />
      )}
    </div>
  )
}

export default RatedMovies
