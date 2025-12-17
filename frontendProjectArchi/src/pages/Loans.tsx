import React, { useEffect, useState } from 'react';
import { loanService } from '../services/loanService';
import { bookService } from '../services/bookService';
import { userService } from '../services/userService';
import { LoanDTO, BookDTO, LibraryUserDTO, BorrowRequestDTO } from '../types';
import { Plus, Search, CheckCircle, Calendar, Bookmark } from 'lucide-react';
import { Modal } from '../components/Modal';
import { Button } from '../components/Button';
import { motion } from 'framer-motion';

export const Loans: React.FC = () => {
    const [loans, setLoans] = useState<LoanDTO[]>([]);
    const [books, setBooks] = useState<BookDTO[]>([]);
    const [users, setUsers] = useState<LibraryUserDTO[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const [borrowRequest, setBorrowRequest] = useState<Partial<BorrowRequestDTO>>({});

    useEffect(() => {
        fetchLoans();
    }, []);

    useEffect(() => {
        if (isModalOpen) {
            fetchBooksAndUsers();
        }
    }, [isModalOpen]);

    const fetchLoans = async () => {
        try {
            const data = await loanService.getAllLoans();
            setLoans(data);
        } catch (error) {
            console.error('Failed to fetch loans', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchBooksAndUsers = async () => {
        try {
            const [booksData, usersData] = await Promise.all([
                bookService.getAllBooks(),
                userService.getAllUsers()
            ]);
            setBooks(booksData.filter(b => (b.availableCopies || 0) > 0)); // Only show available books
            setUsers(usersData);
        } catch (error) {
            console.error('Failed to fetch books or users', error);
        }
    };

    const handleBorrow = async () => {
        try {
            await loanService.borrowBook(borrowRequest as BorrowRequestDTO);
            setIsModalOpen(false);
            fetchLoans();
        } catch (error) {
            console.error('Failed to borrow book', error);
            alert('Failed to borrow book. Is it available?');
        }
    };

    const handleReturn = async (id: number) => {
        if (confirm('Are you sure you want to return this book?')) {
            try {
                await loanService.returnBook(id);
                fetchLoans();
            } catch (error) {
                console.error('Failed to return book', error);
            }
        }
    };

    const filteredLoans = loans.filter(loan =>
        loan.id!.toString().includes(searchQuery) ||
        loan.bookId.toString().includes(searchQuery) ||
        loan.userId.toString().includes(searchQuery)
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Loans</h1>
                    <p className="text-gray-500 mt-1">Track borrowed books</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)} icon={Plus}>
                    New Loan
                </Button>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
                <Search className="text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Search by Loan ID, Book ID, or User ID..."
                    className="flex-1 outline-none text-gray-700 placeholder-gray-400"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {isLoading ? (
                <div className="text-center py-10">Loading loans...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredLoans.map((loan) => (
                        <motion.div
                            layout
                            key={loan.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-lg ${loan.status === 'ACTIVE' ? 'bg-indigo-50 text-indigo-600' : 'bg-green-50 text-green-600'}`}>
                                    <Bookmark className="w-6 h-6" />
                                </div>
                                <div className="text-right">
                                    <span className={`px-2 py-1 text-xs rounded-full font-semibold ${loan.status === 'ACTIVE' ? 'bg-indigo-100 text-indigo-800' :
                                        loan.status === 'OVERDUE' ? 'bg-red-100 text-red-800' :
                                            'bg-green-100 text-green-800'
                                        }`}>
                                        {loan.status}
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-2 mb-4">
                                <p className="text-sm"><span className="font-semibold">Book ID:</span> {loan.bookId}</p>
                                <p className="text-sm"><span className="font-semibold">User ID:</span> {loan.userId}</p>
                                <div className="flex items-center text-sm text-gray-500">
                                    <Calendar className="w-4 h-4 mr-1" />
                                    Due: {loan.dueDate}
                                </div>
                            </div>

                            {loan.status === 'ACTIVE' && (
                                <Button
                                    className="w-full"
                                    variant="secondary"
                                    icon={CheckCircle}
                                    onClick={() => handleReturn(loan.id!)}
                                >
                                    Return Book
                                </Button>
                            )}
                        </motion.div>
                    ))}
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Borrow Book"
            >
                <div className="space-y-4">
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">Book</label>
                        <select
                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={borrowRequest.bookId || ''}
                            onChange={(e) => setBorrowRequest({ ...borrowRequest, bookId: Number(e.target.value) })}
                        >
                            <option value="">Select Available Book</option>
                            {books.map(book => (
                                <option key={book.id} value={book.id}>
                                    {book.title} (ID: {book.id})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">User</label>
                        <select
                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={borrowRequest.userId || ''}
                            onChange={(e) => setBorrowRequest({ ...borrowRequest, userId: Number(e.target.value) })}
                        >
                            <option value="">Select User</option>
                            {users.map(user => (
                                <option key={user.id} value={user.id}>
                                    {user.fullName} (ID: {user.id})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                        <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleBorrow}>Confirm Loan</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Loans;
