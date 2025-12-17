import React, { useEffect, useState } from 'react';
import { authorService } from '../services/authorService';
import { AuthorDTO } from '../types';
import { Plus, Search, Edit2, Trash2, User, Feather, Calendar } from 'lucide-react';
import { Modal } from '../components/Modal';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { EmptyState } from '../components/EmptyState';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { SkeletonCard } from '../components/Skeleton';
import { showToast } from '../utils/toast';
import { motion } from 'framer-motion';

export const Authors: React.FC = () => {
    const [authors, setAuthors] = useState<AuthorDTO[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; authorId?: number; authorName?: string }>({
        isOpen: false,
    });

    const [currentAuthor, setCurrentAuthor] = useState<Partial<AuthorDTO>>({});
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchAuthors();
    }, []);

    const fetchAuthors = async () => {
        try {
            const data = await authorService.getAllAuthors();
            setAuthors(data);
        } catch (error) {
            console.error('Failed to fetch authors', error);
            showToast.error('Failed to load authors');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);
            if (isEditing && currentAuthor.id) {
                await authorService.updateAuthor(currentAuthor.id, currentAuthor as AuthorDTO);
                showToast.success('Author updated successfully!');
            } else {
                await authorService.createAuthor(currentAuthor as AuthorDTO);
                showToast.success('Author created successfully!');
            }
            setIsModalOpen(false);
            setCurrentAuthor({});
            fetchAuthors();
        } catch (error) {
            console.error('Failed to save author', error);
            showToast.error('Failed to save author');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteConfirm.authorId) return;

        try {
            await authorService.deleteAuthor(deleteConfirm.authorId);
            showToast.success('Author deleted successfully!');
            fetchAuthors();
            setDeleteConfirm({ isOpen: false });
        } catch (error) {
            console.error('Failed to delete author', error);
            showToast.error('Failed to delete author');
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

    const openDeleteConfirm = (author: AuthorDTO) => {
        setDeleteConfirm({
            isOpen: true,
            authorId: author.id,
            authorName: `${author.firstName} ${author.lastName}`,
        });
    };

    const filteredAuthors = authors.filter(author =>
        `${author.firstName} ${author.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName[0]}${lastName[0]}`.toUpperCase();
    };

    const getRandomGradient = (id: number) => {
        const gradients = [
            'from-purple-500 to-pink-500',
            'from-blue-500 to-cyan-500',
            'from-green-500 to-teal-500',
            'from-orange-500 to-red-500',
            'from-indigo-500 to-purple-500',
            'from-pink-500 to-rose-500',
        ];
        return gradients[id % gradients.length];
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Authors</h1>
                    <p className="text-gray-500 mt-1">Manage book authors and contributors</p>
                </div>
                <Button onClick={() => openModal()} icon={Plus}>
                    Add Author
                </Button>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
                <Search className="text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Search authors by name..."
                    className="flex-1 outline-none text-gray-700 placeholder-gray-400"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} />)}
                </div>
            ) : filteredAuthors.length === 0 ? (
                <EmptyState
                    icon={Feather}
                    title={searchQuery ? 'No authors found' : 'No authors yet'}
                    description={
                        searchQuery
                            ? `No authors match "${searchQuery}". Try a different search term.`
                            : 'Start building your author database by adding your first author.'
                    }
                    action={
                        !searchQuery
                            ? {
                                label: 'Add First Author',
                                onClick: () => openModal(),
                                icon: Plus,
                            }
                            : undefined
                    }
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAuthors.map((author, index) => (
                        <motion.div
                            layout
                            key={author.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ y: -4 }}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${getRandomGradient(author.id!)} flex items-center justify-center text-white font-bold text-lg shadow-md`}>
                                    {getInitials(author.firstName, author.lastName)}
                                </div>
                                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => openModal(author)}
                                        className="p-2 hover:bg-gray-100 rounded-full text-gray-500 hover:text-indigo-600 transition-colors"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => openDeleteConfirm(author)}
                                        className="p-2 hover:bg-gray-100 rounded-full text-gray-500 hover:text-red-600 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 mb-1">
                                {author.firstName} {author.lastName}
                            </h3>

                            {author.birthDate && (
                                <div className="flex items-center text-sm text-gray-500 mb-3">
                                    <Calendar className="w-4 h-4 mr-1" />
                                    Born: {author.birthDate}
                                </div>
                            )}

                            <p className="text-sm text-gray-600 line-clamp-3 min-h-[60px]">
                                {author.bio || 'No biography available for this author.'}
                            </p>
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
                            placeholder="John"
                            required
                        />
                        <Input
                            label="Last Name"
                            value={currentAuthor.lastName || ''}
                            onChange={(e) => setCurrentAuthor({ ...currentAuthor, lastName: e.target.value })}
                            placeholder="Doe"
                            required
                        />
                    </div>

                    <Input
                        label="Birth Date (Optional)"
                        type="date"
                        value={currentAuthor.birthDate || ''}
                        onChange={(e) => setCurrentAuthor({ ...currentAuthor, birthDate: e.target.value })}
                    />

                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">Biography (Optional)</label>
                        <textarea
                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm resize-none"
                            rows={4}
                            value={currentAuthor.bio || ''}
                            onChange={(e) => setCurrentAuthor({ ...currentAuthor, bio: e.target.value })}
                            placeholder="Write a brief biography about the author..."
                        />
                    </div>

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
                title="Delete Author"
                message={`Are you sure you want to delete "${deleteConfirm.authorName}"? This action cannot be undone.`}
                confirmText="Delete"
                variant="danger"
            />
        </div>
    );
};

export default Authors;
