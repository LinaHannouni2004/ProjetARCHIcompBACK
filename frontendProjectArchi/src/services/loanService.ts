import { api } from './api';
import { LoanDTO, BorrowRequestDTO } from '../types';

const URL = '/api/loans';

export const loanService = {
    getAllLoans: async () => {
        const response = await api.get<LoanDTO[]>(URL);
        return response.data;
    },
    getLoanById: async (id: number) => {
        const response = await api.get<LoanDTO>(`${URL}/${id}`);
        return response.data;
    },
    getLoansByUserId: async (userId: number) => {
        const response = await api.get<LoanDTO[]>(`${URL}/user/${userId}`);
        return response.data;
    },
    getActiveLoansByUserId: async (userId: number) => {
        const response = await api.get<LoanDTO[]>(`${URL}/user/${userId}/active`);
        return response.data;
    },
    borrowBook: async (request: BorrowRequestDTO) => {
        const response = await api.post<LoanDTO>(`${URL}/borrow`, request);
        return response.data;
    },
    returnBook: async (id: number) => {
        const response = await api.put<LoanDTO>(`${URL}/${id}/return`);
        return response.data;
    },
};
