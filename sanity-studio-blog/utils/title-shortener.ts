interface TitleShortenerOptions {
  characters?: number
  ellipsis?: boolean
}

export const titleShortener = (title: string, options: TitleShortenerOptions = {}) => {
  const {characters = 10, ellipsis = true} = options
  return title.length > characters ? `${title.slice(0, characters)}${ellipsis ? '...' : ''}` : title
}
