import React, { useReducer, useContext } from 'react'

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

const initialState = {
  searchQuery: '',
  currentPage: 1,
  isLoading: false,
  error: null,
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload, currentPage: 1 }
    case 'SET_CURRENT_PAGE':
      return { ...state, currentPage: action.payload }
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    default:
      throw new Error()
  }
}

function SearchMovies() {
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY
  const isOffline = useNetworkStatus()
  const { ratedMovies, updateRatedMovie, removeMovieFromRated } = useContext(GuestSessionContext)

  const [state, dispatch] = useReducer(reducer, initialState)
  const { searchQuery, currentPage } = state

  const { movies, isLoading, error, totalResults, totalPages } = useMovies(API_KEY, searchQuery, currentPage)
  const handleRatingChange = (movieId, newRating) => {
    if (newRating === null) {
      removeMovieFromRated(movieId)
    } else {
      updateRatedMovie(movieId, newRating)
    }
  }

  const moviesWithRatings = movies.map((movie) => {
    const ratedMovie = ratedMovies.find((rated) => rated.id === movie.id)
    return ratedMovie && ratedMovie.id ? { ...movie, rating: ratedMovie.rating, id: ratedMovie.id } : movie
  })

  const handleSearch = useDebounce((value) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: value })
  }, 1)

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
          onPageChange={(page) => dispatch({ type: 'SET_CURRENT_PAGE', payload: page })}
        />
      )}
    </div>
  )
}

export default SearchMovies
