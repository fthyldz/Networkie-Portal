export interface ListWithRequiredDto {
    id: string;
    name: string;
    isRequired: boolean | null;
}

export interface ListDto {
    id: string | null;
    name: string;
}