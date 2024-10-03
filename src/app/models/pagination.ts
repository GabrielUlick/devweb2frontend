export interface Paginated<T> {
    results: T[];
    limit: number;
    page: number;
    total_record: number;
    paginable: boolean;
}

export interface NextPage {
    page: number;
    search?: string;
}