export type MovieDeckCreationBody = {
    services?: number[]
    quantity: number
    genres?: number[]
    title: string
    friends: number[]
}

export type MovieData = {
    title: string
    year: number
    imdb_id: string
    us_rating: string
    poster: string
}