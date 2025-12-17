import { api } from './api';
import { LibraryUserDTO } from '../types';

const URL = '/api/users';

export const userService = {
    getAllUsers: async () => {
        const response = await api.get<LibraryUserDTO[]>(URL);
        return response.data;
    },
    getUserById: async (id: number) => {
        const response = await api.get<LibraryUserDTO>(`${URL}/${id}`);
        return response.data;
    },
    createUser: async (user: LibraryUserDTO) => {
        const response = await api.post<LibraryUserDTO>(URL, user);
        return response.data;
    },
    updateUser: async (id: number, user: LibraryUserDTO) => {
        const response = await api.put<LibraryUserDTO>(`${URL}/${id}`, user);
        return response.data;
    },
    deleteUser: async (id: number) => {
        await api.delete(`${URL}/${id}`);
    },
};
