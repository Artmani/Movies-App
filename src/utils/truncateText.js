export function truncateText(text, maxLength) {
  if (!text) return ''
  if (text.length <= maxLength) return text

  const words = text.split(' ')
  let truncated = ''

  for (let i = 0; i < words.length; i += 1) {
    if ((truncated + words[i]).length > maxLength) {
      break
    }
    truncated += `${words[i]} `
  }

  return `${truncated.trim()} ...`
}
