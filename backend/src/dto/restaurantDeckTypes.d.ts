export type RestaurantDeckCreationBody = {
    zipcode: number
    quantity: number
    title: string
    friends: number[]
}

export type RestaurantData = {
    name: string
    price_level: number
    rating: number
    user_ratings_total: number
    vicinity: string
}