import { api } from './api';
import { AuthorDTO } from '../types';

const URL = '/api/authors';

export const authorService = {
    getAllAuthors: async () => {
        const response = await api.get<AuthorDTO[]>(URL);
        return response.data;
    },
    getAuthorById: async (id: number) => {
        const response = await api.get<AuthorDTO>(`${URL}/${id}`);
        return response.data;
    },
    createAuthor: async (author: AuthorDTO) => {
        const response = await api.post<AuthorDTO>(URL, author);
        return response.data;
    },
    updateAuthor: async (id: number, author: AuthorDTO) => {
        const response = await api.put<AuthorDTO>(`${URL}/${id}`, author);
        return response.data;
    },
    deleteAuthor: async (id: number) => {
        await api.delete(`${URL}/${id}`);
    },
    searchAuthors: async (name: string) => {
        const response = await api.get<AuthorDTO[]>(`${URL}/search`, { params: { name } });
        return response.data;
    },
};
