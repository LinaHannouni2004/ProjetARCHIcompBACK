import React, { useEffect, useState } from 'react';
import { bookService } from '../services/bookService';
import { authorService } from '../services/authorService';
import { BookDTO, AuthorDTO } from '../types';
import { Plus, Search, Edit2, Trash2, Book } from 'lucide-react';
import { Modal } from '../components/Modal';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { EmptyState } from '../components/EmptyState';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { SkeletonCard } from '../components/Skeleton';
import { showToast } from '../utils/toast';
import { motion } from 'framer-motion';

export const Books: React.FC = () => {
    const [books, setBooks] = useState<BookDTO[]>([]);
    const [authors, setAuthors] = useState<AuthorDTO[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; bookId?: number; bookTitle?: string }>({
        isOpen: false,
    });

    // Form State
    const [currentBook, setCurrentBook] = useState<Partial<BookDTO>>({});
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchBooks();
        fetchAuthors();
    }, []);

    const fetchBooks = async () => {
        try {
            const data = await bookService.getAllBooks();
            setBooks(data);
        } catch (error) {
            console.error('Failed to fetch books', error);
            showToast.error('Failed to load books');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAuthors = async () => {
        try {
            const data = await authorService.getAllAuthors();
            setAuthors(data);
        } catch (error) {
            console.error('Failed to fetch authors', error);
        }
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);
            if (isEditing && currentBook.id) {
                await bookService.updateBook(currentBook.id, currentBook as BookDTO);
                showToast.success('Book updated successfully!');
            } else {
                await bookService.createBook(currentBook as BookDTO);
                showToast.success('Book created successfully!');
            }
            setIsModalOpen(false);
            fetchBooks();
        } catch (error) {
            console.error('Failed to save book', error);
            showToast.error('Failed to save book');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteConfirm.bookId) return;

        try {
            await bookService.deleteBook(deleteConfirm.bookId);
            showToast.success('Book deleted successfully!');
            fetchBooks();
            setDeleteConfirm({ isOpen: false });
        } catch (error) {
            console.error('Failed to delete book', error);
            showToast.error('Failed to delete book');
        }
    };

    const openModal = (book?: BookDTO) => {
        if (book) {
            setIsEditing(true);
            setCurrentBook(book);
        } else {
            setIsEditing(false);
            setCurrentBook({ totalCopies: 0, availableCopies: 0 });
        }
        setIsModalOpen(true);
    };

    const openDeleteConfirm = (book: BookDTO) => {
        setDeleteConfirm({
            isOpen: true,
            bookId: book.id,
            bookTitle: book.title,
        });
    };

    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.isbn.includes(searchQuery)
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Books</h1>
                    <p className="text-gray-500 mt-1">Manage your library collection</p>
                </div>
                <Button onClick={() => openModal()} icon={Plus}>
                    Add Book
                </Button>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
                <Search className="text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Search by title or ISBN..."
                    className="flex-1 outline-none text-gray-700 placeholder-gray-400"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} />)}
                </div>
            ) : filteredBooks.length === 0 ? (
                <EmptyState
                    icon={Book}
                    title={searchQuery ? 'No books found' : 'No books yet'}
                    description={
                        searchQuery
                            ? `No books match "${searchQuery}". Try a different search term.`
                            : 'Get started by adding your first book to the library.'
                    }
                    action={
                        !searchQuery
                            ? {
                                label: 'Add First Book',
                                onClick: () => openModal(),
                                icon: Plus,
                            }
                            : undefined
                    }
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredBooks.map((book) => (
                        <motion.div
                            layout
                            key={book.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            whileHover={{ y: -4 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
                                    <Book className="w-6 h-6" />
                                </div>
                                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => openModal(book)}
                                        className="p-2 hover:bg-gray-100 rounded-full text-gray-500 hover:text-indigo-600 transition-colors"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => openDeleteConfirm(book)}
                                        className="p-2 hover:bg-gray-100 rounded-full text-gray-500 hover:text-red-600 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2">{book.title}</h3>
                            <p className="text-sm text-gray-500 mb-4">{book.isbn} • {book.category || 'Uncategorized'}</p>

                            <div className="flex items-center justify-between text-sm">
                                <span className={`px-2 py-1 rounded-full font-medium ${(book.availableCopies || 0) > 0
                                    ? 'bg-green-50 text-green-700'
                                    : 'bg-red-50 text-red-700'
                                    }`}>
                                    {(book.availableCopies || 0) > 0 ? 'Available' : 'Out of Stock'}
                                </span>
                                <span className="text-gray-400">
                                    {book.availableCopies}/{book.totalCopies} copies
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={isEditing ? 'Edit Book' : 'Add New Book'}
            >
                <div className="space-y-4">
                    <Input
                        label="Title"
                        value={currentBook.title || ''}
                        onChange={(e) => setCurrentBook({ ...currentBook, title: e.target.value })}
                        required
                    />
                    <Input
                        label="ISBN"
                        value={currentBook.isbn || ''}
                        onChange={(e) => setCurrentBook({ ...currentBook, isbn: e.target.value })}
                        required
                    />
                    <Input
                        label="Category"
                        value={currentBook.category || ''}
                        onChange={(e) => setCurrentBook({ ...currentBook, category: e.target.value })}
                        placeholder="Fiction, Science, etc."
                    />
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">Author</label>
                        <select
                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={currentBook.authorId || ''}
                            onChange={(e) => setCurrentBook({ ...currentBook, authorId: Number(e.target.value) })}
                        >
                            <option value="">Select Author</option>
                            {authors.map(author => (
                                <option key={author.id} value={author.id}>
                                    {author.firstName} {author.lastName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            type="number"
                            label="Total Copies"
                            value={currentBook.totalCopies || 0}
                            onChange={(e) => setCurrentBook({ ...currentBook, totalCopies: Number(e.target.value) })}
                            required
                        />
                        <Input
                            type="number"
                            label="Available Copies"
                            value={currentBook.availableCopies || 0}
                            onChange={(e) => setCurrentBook({ ...currentBook, availableCopies: Number(e.target.value) })}
                            required
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
                title="Delete Book"
                message={`Are you sure you want to delete "${deleteConfirm.bookTitle}"? This action cannot be undone.`}
                confirmText="Delete"
                variant="danger"
            />
        </div>
    );
};

export default Books;
