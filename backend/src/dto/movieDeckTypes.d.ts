export type MovieDeckCreationBody = {
    services?: number[] | null
    quantity: number
    genres?: number[] | null
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