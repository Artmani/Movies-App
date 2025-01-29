import React, { useState, useContext } from 'react'

import { useMovies } from '../hooks/useMovies'
import { useNetworkStatus } from '../hooks/useNetworkStatus'
import { useDebounce } from '../hooks/useDebounce'
import { GuestSessionContext } from '../hooks/GuestSessionContext'

import MovieSearch from './MovieSearch'
import MovieList from './MovieList'
import MoviePagination from './MoviePagination'
import OfflineAlert from './OfflineAlert'
import ErrorAlert from './ErrorAlert'
import LoadingIndicator from './LoadingIndicator'

import '../styles/App.css'

function SearchMovies() {
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY
  const isOffline = useNetworkStatus()
  const { ratedMovies, fetchRatedMovies, updateRatedMovie, removeMovieFromRated } = useContext(GuestSessionContext)

  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const { movies, isLoading, error, totalResults, totalPages } = useMovies(API_KEY, searchQuery, currentPage)

  const handleRatingChange = (movieId, newRating) => {
    if (newRating === null) {
      removeMovieFromRated(movieId)
    } else {
      updateRatedMovie(movieId, newRating)
    }
    fetchRatedMovies()
  }

  const moviesWithRatings = movies.map((movie) => {
    const ratedMovie = ratedMovies.find((rated) => rated.id === movie.id)
    return ratedMovie && ratedMovie.id ? { ...movie, rating: ratedMovie.rating, id: ratedMovie.id } : movie
  })

  const handleSearch = useDebounce((value) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }, 500)

  return (
    <div className="app-container">
      {isOffline && <OfflineAlert />}
      {error && <ErrorAlert message={error} />}
      <MovieSearch onSearch={handleSearch} />
      {isLoading ? <LoadingIndicator /> : <MovieList movies={moviesWithRatings} onRatingChange={handleRatingChange} />}
      {totalResults > 0 && !isLoading && (
        <MoviePagination
          totalResults={totalResults}
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  )
}

export default SearchMovies
