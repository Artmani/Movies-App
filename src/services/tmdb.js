export async function getMoviesBySearch(query) {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Ошибка при загрузке фильмов')
  }

  const data = await response.json()
  return data.results
}
