import React, { useState, useEffect } from 'react'
import { Row, Col } from 'antd'

import MovieCard from './components/MovieCard'
import './styles/App.css'

function App() {
  const [movies, setMovies] = useState([])

  const API_KEY = import.meta.env.VITE_TMDB_API_KEY

  useEffect(() => {
    async function fetchMovies() {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=return&language=ru-RU`
        )
        const data = await response.json()
        if (data.results) {
          setMovies(data.results)
        }
      } catch (err) {
        console.error('Ошибка при запросе фильмов:', err)
      }
    }

    fetchMovies()
  }, [])

  return (
    <div className="app-container">
      <Row gutter={[0, 30]}>
        {movies.map((movie) => (
          <Col key={movie.id} span={12} className="app-col">
            <MovieCard movie={movie} />
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default App
