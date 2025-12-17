import { api } from './api';
import { BookWithAuthorDTO, RecommendationResponseDTO } from '../types';

const URL = '/api/client';

export const clientService = {
    getAllBooksWithAuthors: async () => {
        const response = await api.get<BookWithAuthorDTO[]>(`${URL}/books/with-authors`);
        return response.data;
    },
    getRecommendationsForUser: async (userId: number) => {
        const response = await api.get<RecommendationResponseDTO[]>(`${URL}/recommendations/user/${userId}`);
        return response.data;
    },
    getMostBorrowedBooks: async (limit: number = 10) => {
        const response = await api.get<RecommendationResponseDTO[]>(`${URL}/recommendations/most-borrowed`, {
            params: { limit },
        });
        return response.data;
    },
};
