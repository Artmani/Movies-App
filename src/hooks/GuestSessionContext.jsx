import React, { createContext, useEffect, useMemo, useReducer, useCallback } from 'react'

export const GuestSessionContext = createContext()

const initialState = {
  guestSessionId: null,
  ratedMovies: [],
}

function sessionReducer(state, action) {
  switch (action.type) {
    case 'SET_SESSION_ID':
      return { ...state, guestSessionId: action.payload }
    case 'SET_RATED_MOVIES':
      return { ...state, ratedMovies: action.payload }
    case 'REMOVE_MOVIE':
      return { ...state, ratedMovies: state.ratedMovies.filter((movie) => movie.id !== action.payload) }
    case 'UPDATE_MOVIE_RATING':
      return {
        ...state,
        ratedMovies: state.ratedMovies.map((movie) =>
          movie.id === action.payload.movieId ? { ...movie, rating: action.payload.newRating } : movie
        ),
      }
    default:
      return state
  }
}

export function GuestSessionProvider({ children }) {
  const [state, dispatch] = useReducer(sessionReducer, initialState)
  const { guestSessionId, ratedMovies } = state

  const API_KEY = import.meta.env.VITE_TMDB_API_KEY

  const fetchRatedMovies = useCallback(async () => {
    if (!guestSessionId) return

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/guest_session/${guestSessionId}/rated/movies?api_key=${API_KEY}&language=ru-RU`
      )

      if (response.status === 404) {
        dispatch({ type: 'SET_RATED_MOVIES', payload: [] })
        return
      }

      if (!response.ok) {
        console.error(`Ошибка запроса: ${response.status} ${response.statusText}`)
        return
      }

      const data = await response.json()
      dispatch({ type: 'SET_RATED_MOVIES', payload: data.results || [] })
    } catch (error) {
      console.error('Ошибка загрузки оценённых фильмов:', error)
    }
  }, [guestSessionId, API_KEY])

  useEffect(() => {
    const storedSessionId = localStorage.getItem('guest_session_id')

    if (storedSessionId) {
      dispatch({ type: 'SET_SESSION_ID', payload: storedSessionId })
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
            dispatch({ type: 'SET_SESSION_ID', payload: data.guest_session_id })
            localStorage.setItem('guest_session_id', data.guest_session_id)
            fetchRatedMovies()
          }
        } catch (error) {
          console.error('Ошибка при создании гостевой сессии:', error)
        }
      }

      createGuestSession()
    }
  }, [fetchRatedMovies])

  const removeMovieFromRated = (movieId) => {
    dispatch({ type: 'REMOVE_MOVIE', payload: movieId })
  }

  const updateRatedMovie = (movieId, newRating) => {
    dispatch({ type: 'UPDATE_MOVIE_RATING', payload: { movieId, newRating } })
    fetchRatedMovies()
  }

  const contextValue = useMemo(
    () => ({
      guestSessionId,
      ratedMovies,
      fetchRatedMovies,
      removeMovieFromRated,
      updateRatedMovie,
    }),
    [guestSessionId, ratedMovies, fetchRatedMovies]
  )

  return <GuestSessionContext.Provider value={contextValue}>{children}</GuestSessionContext.Provider>
}
