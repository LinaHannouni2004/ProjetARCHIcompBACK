import React, { useEffect, useState } from 'react';
import { bookService } from '../services/bookService';
import { authorService } from '../services/authorService';
import { BookDTO, AuthorDTO } from '../types';
import { Plus, Search, Edit2, Trash2, Book } from 'lucide-react';
import { Modal } from '../components/Modal';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { motion } from 'framer-motion';

export const Books: React.FC = () => {
    const [books, setBooks] = useState<BookDTO[]>([]);
    const [authors, setAuthors] = useState<AuthorDTO[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Form State
    const [currentBook, setCurrentBook] = useState<Partial<BookDTO>>({});
    const [isEditing, setIsEditing] = useState(false);

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
            if (isEditing && currentBook.id) {
                await bookService.updateBook(currentBook.id, currentBook as BookDTO);
            } else {
                await bookService.createBook(currentBook as BookDTO);
            }
            setIsModalOpen(false);
            fetchBooks();
        } catch (error) {
            console.error('Failed to save book', error);
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this book?')) {
            try {
                await bookService.deleteBook(id);
                fetchBooks();
            } catch (error) {
                console.error('Failed to delete book', error);
            }
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
                <div className="text-center py-10">Loading books...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredBooks.map((book) => (
                        <motion.div
                            layout
                            key={book.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
                                    <Book className="w-6 h-6" />
                                </div>
                                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => openModal(book)}
                                        className="p-2 hover:bg-gray-100 rounded-full text-gray-500 hover:text-indigo-600"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(book.id!)}
                                        className="p-2 hover:bg-gray-100 rounded-full text-gray-500 hover:text-red-600"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">{book.title}</h3>
                            <p className="text-sm text-gray-500 mb-4">{book.isbn} • {book.category || 'Uncategorized'}</p>

                            <div className="flex items-center justify-between text-sm">
                                <span className={`px-2 py-1 rounded-full ${(book.availableCopies || 0) > 0
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
                    />
                    <Input
                        label="ISBN"
                        value={currentBook.isbn || ''}
                        onChange={(e) => setCurrentBook({ ...currentBook, isbn: e.target.value })}
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
                        />
                        <Input
                            type="number"
                            label="Available Copies"
                            value={currentBook.availableCopies || 0}
                            onChange={(e) => setCurrentBook({ ...currentBook, availableCopies: Number(e.target.value) })}
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

export default Books;
