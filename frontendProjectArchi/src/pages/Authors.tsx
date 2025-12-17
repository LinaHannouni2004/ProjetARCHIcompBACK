import React, { useEffect, useState } from 'react';
import { authorService } from '../services/authorService';
import { AuthorDTO } from '../types';
import { Plus, Search, Edit2, Trash2, User } from 'lucide-react';
import { Modal } from '../components/Modal';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { motion } from 'framer-motion';

export const Authors: React.FC = () => {
    const [authors, setAuthors] = useState<AuthorDTO[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const [currentAuthor, setCurrentAuthor] = useState<Partial<AuthorDTO>>({});
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchAuthors();
    }, []);

    const fetchAuthors = async () => {
        try {
            const data = await authorService.getAllAuthors();
            setAuthors(data);
        } catch (error) {
            console.error('Failed to fetch authors', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            if (isEditing && currentAuthor.id) {
                await authorService.updateAuthor(currentAuthor.id, currentAuthor as AuthorDTO);
            } else {
                await authorService.createAuthor(currentAuthor as AuthorDTO);
            }
            setIsModalOpen(false);
            fetchAuthors();
        } catch (error) {
            console.error('Failed to save author', error);
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this author?')) {
            try {
                await authorService.deleteAuthor(id);
                fetchAuthors();
            } catch (error) {
                console.error('Failed to delete author', error);
            }
        }
    };

    const openModal = (author?: AuthorDTO) => {
        if (author) {
            setIsEditing(true);
            setCurrentAuthor(author);
        } else {
            setIsEditing(false);
            setCurrentAuthor({});
        }
        setIsModalOpen(true);
    };

    const filteredAuthors = authors.filter(author =>
        `${author.firstName} ${author.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Authors</h1>
                    <p className="text-gray-500 mt-1">Manage book authors</p>
                </div>
                <Button onClick={() => openModal()} icon={Plus}>
                    Add Author
                </Button>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
                <Search className="text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Search authors..."
                    className="flex-1 outline-none text-gray-700 placeholder-gray-400"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {isLoading ? (
                <div className="text-center py-10">Loading authors...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAuthors.map((author) => (
                        <motion.div
                            layout
                            key={author.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
                                    <User className="w-6 h-6" />
                                </div>
                                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => openModal(author)}
                                        className="p-2 hover:bg-gray-100 rounded-full text-gray-500 hover:text-indigo-600"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(author.id!)}
                                        className="p-2 hover:bg-gray-100 rounded-full text-gray-500 hover:text-red-600"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">{author.firstName} {author.lastName}</h3>
                            <p className="text-sm text-gray-500 line-clamp-2">{author.bio || 'No biography available'}</p>
                        </motion.div>
                    ))}
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={isEditing ? 'Edit Author' : 'Add New Author'}
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="First Name"
                            value={currentAuthor.firstName || ''}
                            onChange={(e) => setCurrentAuthor({ ...currentAuthor, firstName: e.target.value })}
                        />
                        <Input
                            label="Last Name"
                            value={currentAuthor.lastName || ''}
                            onChange={(e) => setCurrentAuthor({ ...currentAuthor, lastName: e.target.value })}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">Biography</label>
                        <textarea
                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            rows={3}
                            value={currentAuthor.bio || ''}
                            onChange={(e) => setCurrentAuthor({ ...currentAuthor, bio: e.target.value })}
                        />
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                        <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave}>{isEditing ? 'Update' : 'Create'}</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Authors;
