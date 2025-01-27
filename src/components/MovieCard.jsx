import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { Rate } from 'antd'

import { truncateText } from '../utils/truncateText'
import '../styles/MovieCard.css'

function MovieCard({ movie }) {
  const { title, release_date: releaseDate, overview, poster_path: posterPath, vote_average: rating } = movie
  const formattedDate = releaseDate ? format(new Date(releaseDate), 'd MMM yyyy', { locale: ru }) : 'Неизвестно'

  const posterUrl = posterPath ? `https://image.tmdb.org/t/p/w300/${posterPath}` : null

  const getRatingColor = (value) => {
    if (value >= 7) return '#66E900'
    if (value >= 5) return '#E9D100'
    if (value >= 3) return '#E97E00'
    return '#E90000'
  }

  const [userRating, setUserRating] = useState(null)

  const handleRateChange = (value) => {
    setUserRating(value)
    console.log(`Рейтинг фильма "${title}" установлен на ${value}`)
  }

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
        <div className="movie-card__zag">
          <h3 className="movie-card__title">{title}</h3>
          <div
            className="movie-card__rating"
            style={{
              borderColor: getRatingColor(rating),
            }}
          >
            {rating || 'N/A'}
          </div>
        </div>
        <p className="movie-card__date">{formattedDate}</p>
        <div className="movie-card__overview">{truncateText(overview, 120)}</div>
        <Rate className="movie-card__rate" count={10} value={userRating} onChange={handleRateChange} />
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
    vote_average: PropTypes.number,
  }).isRequired,
}

export default MovieCard
