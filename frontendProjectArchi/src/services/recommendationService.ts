import { api } from './api';
import { RecommendationResponseDTO } from '../types';

const URL = '/api/recommendations';

export const recommendationService = {
    getMostBorrowedBooks: async (limit: number = 10) => {
        const response = await api.get<RecommendationResponseDTO[]>(`${URL}/most-borrowed`, {
            params: { limit },
        });
        return response.data;
    },

    getRecommendationsForUser: async (userId: number) => {
        const response = await api.get<RecommendationResponseDTO[]>(`${URL}/user/${userId}`);
        return response.data;
    },
};
