export interface ApiResponse<T> {
    success: boolean
    message: string
    data?: T
    date?: Date | string
    path?: string
    takenTime?: string
}