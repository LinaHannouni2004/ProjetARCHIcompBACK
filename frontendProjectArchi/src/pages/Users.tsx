import React, { useEffect, useState } from 'react';
import { userService } from '../services/userService';
import { LibraryUserDTO } from '../types';
import { Plus, Search, Edit2, Trash2, Users as UsersIcon, Mail, Phone } from 'lucide-react';
import { Modal } from '../components/Modal';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { EmptyState } from '../components/EmptyState';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { SkeletonTable } from '../components/Skeleton';
import { showToast } from '../utils/toast';
import { motion } from 'framer-motion';

export const Users: React.FC = () => {
    const [users, setUsers] = useState<LibraryUserDTO[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; userId?: number; userName?: string }>({
        isOpen: false,
    });

    const [currentUser, setCurrentUser] = useState<Partial<LibraryUserDTO>>({});
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await userService.getAllUsers();
            setUsers(data);
        } catch (error) {
            console.error('Failed to fetch users', error);
            showToast.error('Failed to load users');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);
            if (isEditing && currentUser.id) {
                await userService.updateUser(currentUser.id, currentUser as LibraryUserDTO);
                showToast.success('User updated successfully!');
            } else {
                await userService.createUser(currentUser as LibraryUserDTO);
                showToast.success('User created successfully!');
            }
            setIsModalOpen(false);
            fetchUsers();
        } catch (error) {
            console.error('Failed to save user', error);
            showToast.error('Failed to save user');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteConfirm.userId) return;

        try {
            await userService.deleteUser(deleteConfirm.userId);
            showToast.success('User deleted successfully!');
            fetchUsers();
            setDeleteConfirm({ isOpen: false });
        } catch (error) {
            console.error('Failed to delete user', error);
            showToast.error('Failed to delete user');
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

    const openDeleteConfirm = (user: LibraryUserDTO) => {
        setDeleteConfirm({
            isOpen: true,
            userId: user.id,
            userName: user.fullName,
        });
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
                    placeholder="Search by name or email..."
                    className="flex-1 outline-none text-gray-700 placeholder-gray-400"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {isLoading ? (
                <SkeletonTable rows={8} />
            ) : filteredUsers.length === 0 ? (
                <EmptyState
                    icon={UsersIcon}
                    title={searchQuery ? 'No users found' : 'No users yet'}
                    description={
                        searchQuery
                            ? `No users match "${searchQuery}". Try a different search term.`
                            : 'Start by adding your first library member.'
                    }
                    action={
                        !searchQuery
                            ? {
                                label: 'Add First User',
                                onClick: () => openModal(),
                                icon: Plus,
                            }
                            : undefined
                    }
                />
            ) : (
                <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredUsers.map((user, index) => (
                                <motion.tr
                                    key={user.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                                                    {user.fullName[0].toUpperCase()}
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                                                <div className="text-sm text-gray-500">ID: #{user.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="space-y-1">
                                            <div className="flex items-center text-sm text-gray-900">
                                                <Mail className="w-4 h-4 mr-2 text-gray-400" />
                                                {user.email}
                                            </div>
                                            {user.phone && (
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <Phone className="w-4 h-4 mr-2 text-gray-400" />
                                                    {user.phone}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => openModal(user)}
                                            className="text-indigo-600 hover:text-indigo-900 mr-4 transition-colors"
                                        >
                                            <Edit2 className="w-5 h-5 inline" />
                                        </button>
                                        <button
                                            onClick={() => openDeleteConfirm(user)}
                                            className="text-red-600 hover:text-red-900 transition-colors"
                                        >
                                            <Trash2 className="w-5 h-5 inline" />
                                        </button>
                                    </td>
                                </motion.tr>
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
                        required
                    />
                    <Input
                        label="Email"
                        type="email"
                        value={currentUser.email || ''}
                        onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                        placeholder="john.doe@example.com"
                        required
                    />
                    <Input
                        label="Phone (Optional)"
                        type="tel"
                        value={currentUser.phone || ''}
                        onChange={(e) => setCurrentUser({ ...currentUser, phone: e.target.value })}
                        placeholder="+1234567890"
                    />

                    <div className="flex justify-end space-x-3 mt-6">
                        <Button variant="secondary" onClick={() => setIsModalOpen(false)} disabled={isSaving}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave} disabled={isSaving}>
                            {isSaving ? 'Saving...' : isEditing ? 'Update' : 'Create'}
                        </Button>
                    </div>
                </div>
            </Modal>

            <ConfirmDialog
                isOpen={deleteConfirm.isOpen}
                onClose={() => setDeleteConfirm({ isOpen: false })}
                onConfirm={handleDelete}
                title="Delete User"
                message={`Are you sure you want to delete "${deleteConfirm.userName}"? This action cannot be undone.`}
                confirmText="Delete"
                variant="danger"
            />
        </div>
    );
};

export default Users;
