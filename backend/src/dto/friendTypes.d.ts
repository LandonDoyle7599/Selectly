export type FriendRequestBody = {
    friendEmail: string
}

export type FriendRequestReponseBody = {
    friendRequestId: number
    response: 'accepted' | 'declined'
}

export type UnfriendBody = {
    friendId: number
}

export type CancelRequestBody = {
    friendRequestId: number
}