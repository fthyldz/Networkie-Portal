export interface Result<T, TE> {
    message: string;
    data?: T;
    errors?: TE;
}