import React from 'react'
import { Row, Col } from 'antd'

import { useMovies } from './hooks/useMovies'
import { useNetworkStatus } from './hooks/useNetworkStatus'
import MovieCard from './components/MovieCard'
import OfflineAlert from './components/OfflineAlert'
import ErrorAlert from './components/ErrorAlert'
import LoadingIndicator from './components/LoadingIndicator'

import './styles/App.css'

function App() {
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY
  const isOffline = useNetworkStatus()
  const { movies, isLoading, error } = useMovies(API_KEY, isOffline)

  return (
    <div className="app-container">
      {isOffline && <OfflineAlert />}
      {error && <ErrorAlert message={error} />}
      {isLoading ? (
        <Col span={24} className="app-col">
          <LoadingIndicator />
        </Col>
      ) : (
        <Row gutter={[0, 30]}>
          {movies.map((movie) => (
            <Col key={movie.id} span={12} className="app-col">
              <MovieCard movie={movie} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  )
}

export default App
