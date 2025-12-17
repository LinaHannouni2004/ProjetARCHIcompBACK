import React, { useEffect, useState } from 'react';
import { userService } from '../services/userService';
import { LibraryUserDTO } from '../types';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { Modal } from '../components/Modal';
import { Button } from '../components/Button';
import { Input } from '../components/Input';


export const Users: React.FC = () => {
    const [users, setUsers] = useState<LibraryUserDTO[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const [currentUser, setCurrentUser] = useState<Partial<LibraryUserDTO>>({});
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await userService.getAllUsers();
            setUsers(data);
        } catch (error) {
            console.error('Failed to fetch users', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            if (isEditing && currentUser.id) {
                await userService.updateUser(currentUser.id, currentUser as LibraryUserDTO);
            } else {
                await userService.createUser(currentUser as LibraryUserDTO);
            }
            setIsModalOpen(false);
            fetchUsers();
        } catch (error) {
            console.error('Failed to save user', error);
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this user?')) {
            try {
                await userService.deleteUser(id);
                fetchUsers();
            } catch (error) {
                console.error('Failed to delete user', error);
            }
        }
    };

    const openModal = (user?: LibraryUserDTO) => {
        if (user) {
            setIsEditing(true);
            setCurrentUser(user);
        } else {
            setIsEditing(false);
            setCurrentUser({});
        }
        setIsModalOpen(true);
    };

    const filteredUsers = users.filter(user =>
        user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Users</h1>
                    <p className="text-gray-500 mt-1">Manage library members</p>
                </div>
                <Button onClick={() => openModal()} icon={Plus}>
                    Add User
                </Button>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
                <Search className="text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Search users..."
                    className="flex-1 outline-none text-gray-700 placeholder-gray-400"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {isLoading ? (
                <div className="text-center py-10">Loading users...</div>
            ) : (
                <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                                                    {user.fullName[0].toUpperCase()}
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900 text-left">{user.fullName}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-left">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-left">{user.phone || '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => openModal(user)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                                            <Edit2 className="w-5 h-5 inline" />
                                        </button>
                                        <button onClick={() => handleDelete(user.id!)} className="text-red-600 hover:text-red-900">
                                            <Trash2 className="w-5 h-5 inline" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={isEditing ? 'Edit User' : 'Add New User'}
            >
                <div className="space-y-4">
                    <Input
                        label="Full Name"
                        value={currentUser.fullName || ''}
                        onChange={(e) => setCurrentUser({ ...currentUser, fullName: e.target.value })}
                        placeholder="John Doe"
                    />
                    <Input
                        label="Email"
                        type="email"
                        value={currentUser.email || ''}
                        onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                        placeholder="john.doe@example.com"
                    />
                    <Input
                        label="Phone (Optional)"
                        type="tel"
                        value={currentUser.phone || ''}
                        onChange={(e) => setCurrentUser({ ...currentUser, phone: e.target.value })}
                        placeholder="+1234567890"
                    />

                    <div className="flex justify-end space-x-3 mt-6">
                        <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave}>{isEditing ? 'Update' : 'Create'}</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Users;
