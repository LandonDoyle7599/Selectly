export type MovieSource = {
    source_id: 203 | 157 | 26 | 387 | 372 | 371 | 444 | 389 | 307
    name: string
}

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