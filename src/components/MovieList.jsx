import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'antd'

import MovieCard from './MovieCard'

function MovieList({ movies, onRatingChange }) {
  return (
    <Row gutter={[0, 20]}>
      {movies.map((movie) => (
        <Col key={movie.id} span={12} className="app-col">
          <MovieCard movie={movie} onRatingChange={onRatingChange} />
        </Col>
      ))}
    </Row>
  )
}

MovieList.propTypes = {
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
    })
  ).isRequired,
  onRatingChange: PropTypes.func.isRequired,
}

export default MovieList
