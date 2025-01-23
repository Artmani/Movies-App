import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'antd'

import MovieCard from './MovieCard'

function MovieList({ movies }) {
  return (
    <Row gutter={[0, 30]}>
      {movies.map((movie) => (
        <Col key={movie.id} span={12} className="app-col">
          <MovieCard movie={movie} />
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
}

export default MovieList
