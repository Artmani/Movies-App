import React, { useState, useEffect } from 'react'
import { Row, Col, Alert, Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

import MovieCard from './components/MovieCard'
import './styles/App.css'

function App() {
  const [movies, setMovies] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isOffline, setIsOffline] = useState(!navigator.onLine)

  const API_KEY = import.meta.env.VITE_TMDB_API_KEY

  useEffect(() => {
    function handleOffline() {
      setIsOffline(true)
    }

    function handleOnline() {
      setIsOffline(false)
    }

    window.addEventListener('offline', handleOffline)
    window.addEventListener('online', handleOnline)

    return () => {
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('online', handleOnline)
    }
  }, [])

  useEffect(() => {
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
  }, [isOffline])

  return (
    <div className="app-container">
      {isOffline && (
        <Alert
          message="Нет подключения к сети"
          description="Проверьте подключение к Интернету."
          type="warning"
          showIcon
          style={{ marginBottom: 20 }}
        />
      )}
      {error && (
        <Alert message="Ошибка загрузки" description={error} type="error" showIcon style={{ marginBottom: 20 }} />
      )}
      <Row gutter={[0, 30]}>
        {isLoading ? (
          <Col span={24} className="app-col">
            <Spin indicator={<LoadingOutlined spin />} size="large" />
          </Col>
        ) : (
          movies.map((movie) => (
            <Col key={movie.id} span={12} className="app-col">
              <MovieCard movie={movie} />
            </Col>
          ))
        )}
      </Row>
    </div>
  )
}

export default App
