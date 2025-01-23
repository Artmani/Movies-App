import React, { useState } from 'react'

import { useMovies } from './hooks/useMovies'
import { useNetworkStatus } from './hooks/useNetworkStatus'
import { useDebounce } from './hooks/useDebounce'
import MovieSearch from './components/MovieSearch'
import MovieList from './components/MovieList'
import MoviePagination from './components/MoviePagination'
import OfflineAlert from './components/OfflineAlert'
import ErrorAlert from './components/ErrorAlert'
import LoadingIndicator from './components/LoadingIndicator'

import './styles/App.css'

function App() {
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY
  const isOffline = useNetworkStatus()

  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const { movies, isLoading, error, totalResults, totalPages } = useMovies(API_KEY, searchQuery, currentPage)

  const handleSearch = useDebounce((value) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }, 500)

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  return (
    <div className="app-container">
      {isOffline && <OfflineAlert />}
      {error && <ErrorAlert message={error} />}
      <MovieSearch onSearch={handleSearch} />
      {isLoading ? <LoadingIndicator /> : <MovieList movies={movies} />}
      {totalResults > 0 && !isLoading && (
        <MoviePagination
          totalResults={totalResults}
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  )
}

export default App
