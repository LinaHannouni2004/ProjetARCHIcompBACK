import { api } from './api';
import { BookDTO, BookWithAuthorDTO } from '../types';

const URL = '/api/books';

export const bookService = {
    getAllBooks: async () => {
        const response = await api.get<BookDTO[]>(URL);
        return response.data;
    },
    getBookById: async (id: number) => {
        const response = await api.get<BookDTO>(`${URL}/${id}`);
        return response.data;
    },
    getBookWithAuthor: async (id: number) => {
        const response = await api.get<BookWithAuthorDTO>(`${URL}/${id}/with-author`);
        return response.data;
    },
    createBook: async (book: BookDTO) => {
        const response = await api.post<BookDTO>(URL, book);
        return response.data;
    },
    updateBook: async (id: number, book: BookDTO) => {
        const response = await api.put<BookDTO>(`${URL}/${id}`, book);
        return response.data;
    },
    deleteBook: async (id: number) => {
        await api.delete(`${URL}/${id}`);
    },
    searchBooks: async (params: { title?: string; isbn?: string; category?: string }) => {
        const response = await api.get<BookDTO[]>(`${URL}/search`, { params });
        return response.data;
    },
};
