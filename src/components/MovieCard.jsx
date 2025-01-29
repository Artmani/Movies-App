import React, { useContext, useState } from 'react'
import PropTypes from 'prop-types'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { Rate, Tag } from 'antd'

import { GenresContext } from '../hooks/GenresContext'
import { truncateText } from '../utils/truncateText'
import { GuestSessionContext } from '../hooks/GuestSessionContext'
import '../styles/MovieCard.css'

function MovieCard({ movie }) {
  const guestSessionId = useContext(GuestSessionContext)
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY
  const {
    title,
    release_date: releaseDate,
    overview,
    poster_path: posterPath,
    vote_average: rating,
    genre_ids: genreIds,
  } = movie
  const formattedDate = releaseDate ? format(new Date(releaseDate), 'd MMM yyyy', { locale: ru }) : 'Неизвестно'
  const posterUrl = posterPath ? `https://image.tmdb.org/t/p/w300/${posterPath}` : null
  const genres = useContext(GenresContext)

  const getRatingColor = (value) => {
    if (value >= 7) return '#66E900'
    if (value >= 5) return '#E9D100'
    if (value >= 3) return '#E97E00'
    return '#E90000'
  }

  const [userRating, setUserRating] = useState(null)

  const handleRateChange = async (value) => {
    setUserRating(value)
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movie.id}/rating?api_key=${API_KEY}&guest_session_id=${guestSessionId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ value }),
        }
      )
      const data = await response.json()
      if (data.success) {
        console.log(`Рейтинг фильма "${movie.title}" установлен на ${value}`)
      } else {
        console.error('Ошибка при оценке фильма:', data.status_message)
      }
    } catch (error) {
      console.error('Ошибка при оценке фильма:', error)
    }
  }

  const movieGenres = genres.filter((genre) => genreIds.includes(genre.id))

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
          <div className="movie-card__rating" style={{ borderColor: getRatingColor(rating) }}>
            {rating || 'N/A'}
          </div>
        </div>
        <p className="movie-card__date">{formattedDate}</p>
        <div className="movie-card__genres">
          {movieGenres.map((genre) => (
            <Tag key={genre.id}>{genre.name}</Tag>
          ))}
        </div>
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
    genre_ids: PropTypes.arrayOf(PropTypes.number).isRequired,
  }).isRequired,
}

export default MovieCard
