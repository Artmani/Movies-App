import React from 'react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import PropTypes from 'prop-types'

import { truncateText } from '../utils/truncateText'
import '../styles/MovieCard.css'

function MovieCard({ movie }) {
  const { title, release_date: releaseDate, overview, poster_path: posterPath } = movie
  const formattedDate = releaseDate ? format(new Date(releaseDate), 'd MMM yyyy', { locale: ru }) : 'Неизвестно'

  const posterUrl = posterPath ? `https://image.tmdb.org/t/p/w300/${posterPath}` : null

  return (
    <div className="movie-card">
      <div className="movie-card__poster">
        {posterUrl ? (
          <img src={posterUrl} alt={title} className="movie-card__img" />
        ) : (
          <div className="movie-card__no-image">Нет изображения</div>
        )}
      </div>

      <div className="movie-card__content">
        <h3 className="movie-card__title">{title}</h3>
        <p className="movie-card__date">{formattedDate}</p>
        <div className="movie-card__overview">{truncateText(overview, 120)}</div>
      </div>
    </div>
  )
}

MovieCard.propTypes = {
  movie: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    release_date: PropTypes.string,
    overview: PropTypes.string,
    poster_path: PropTypes.string,
  }).isRequired,
}

export default MovieCard
