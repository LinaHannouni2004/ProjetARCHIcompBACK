import React, { useEffect, useState } from 'react';
import { loanService } from '../services/loanService';
import { bookService } from '../services/bookService';
import { userService } from '../services/userService';
import { LoanDTO, BookDTO, LibraryUserDTO, BorrowRequestDTO } from '../types';
import { Plus, Search, CheckCircle, Calendar, Bookmark, AlertCircle, Clock } from 'lucide-react';
import { Modal } from '../components/Modal';
import { Button } from '../components/Button';
import { EmptyState } from '../components/EmptyState';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { SkeletonCard } from '../components/Skeleton';
import { showToast } from '../utils/toast';
import { motion } from 'framer-motion';
import { format, isAfter, parseISO } from 'date-fns';

export const Loans: React.FC = () => {
    const [loans, setLoans] = useState<LoanDTO[]>([]);
    const [books, setBooks] = useState<BookDTO[]>([]);
    const [users, setUsers] = useState<LibraryUserDTO[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('ALL');
    const [returnConfirm, setReturnConfirm] = useState<{ isOpen: boolean; loanId?: number }>({
        isOpen: false,
    });

    const [borrowRequest, setBorrowRequest] = useState<Partial<BorrowRequestDTO>>({});
    const [isSaving, setIsSaving] = useState(false);

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
            showToast.error('Failed to load loans');
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
            setBooks(booksData.filter(b => (b.availableCopies || 0) > 0));
            setUsers(usersData);
        } catch (error) {
            console.error('Failed to fetch books or users', error);
            showToast.error('Failed to load books and users');
        }
    };

    const handleBorrow = async () => {
        try {
            setIsSaving(true);
            await loanService.borrowBook(borrowRequest as BorrowRequestDTO);
            showToast.success('Book borrowed successfully!');
            setIsModalOpen(false);
            setBorrowRequest({});
            fetchLoans();
        } catch (error) {
            console.error('Failed to borrow book', error);
            showToast.error('Failed to borrow book. Is it available?');
        } finally {
            setIsSaving(false);
        }
    };

    const handleReturn = async () => {
        if (!returnConfirm.loanId) return;

        try {
            await loanService.returnBook(returnConfirm.loanId);
            showToast.success('Book returned successfully!');
            fetchLoans();
            setReturnConfirm({ isOpen: false });
        } catch (error) {
            console.error('Failed to return book', error);
            showToast.error('Failed to return book');
        }
    };

    const openReturnConfirm = (loanId: number) => {
        setReturnConfirm({ isOpen: true, loanId });
    };

    const isOverdue = (dueDate: string | undefined) => {
        if (!dueDate) return false;
        try {
            return isAfter(new Date(), parseISO(dueDate));
        } catch {
            return false;
        }
    };

    const filteredLoans = loans.filter(loan => {
        const matchesSearch = loan.id!.toString().includes(searchQuery) ||
            loan.bookId.toString().includes(searchQuery) ||
            loan.userId.toString().includes(searchQuery);

        const matchesFilter = filterStatus === 'ALL' || loan.status === filterStatus;

        return matchesSearch && matchesFilter;
    });

    const stats = {
        total: loans.length,
        active: loans.filter(l => l.status === 'ACTIVE').length,
        returned: loans.filter(l => l.status === 'RETURNED').length,
        overdue: loans.filter(l => l.status === 'OVERDUE' || (l.status === 'ACTIVE' && isOverdue(l.dueDate))).length,
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Loans</h1>
                    <p className="text-gray-500 mt-1">Track and manage book loans</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)} icon={Plus}>
                    New Loan
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total', value: stats.total, color: 'indigo', icon: Bookmark },
                    { label: 'Active', value: stats.active, color: 'blue', icon: Clock },
                    { label: 'Returned', value: stats.returned, color: 'green', icon: CheckCircle },
                    { label: 'Overdue', value: stats.overdue, color: 'red', icon: AlertCircle },
                ].map((stat) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">{stat.label}</p>
                                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                            </div>
                            <div className={`p-2 bg-${stat.color}-50 rounded-lg`}>
                                <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
                    <Search className="text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by Loan ID, Book ID, or User ID..."
                        className="flex-1 outline-none text-gray-700 placeholder-gray-400"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                    <option value="ALL">All Status</option>
                    <option value="ACTIVE">Active</option>
                    <option value="RETURNED">Returned</option>
                    <option value="OVERDUE">Overdue</option>
                </select>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} />)}
                </div>
            ) : filteredLoans.length === 0 ? (
                <EmptyState
                    icon={Bookmark}
                    title={searchQuery || filterStatus !== 'ALL' ? 'No loans found' : 'No loans yet'}
                    description={
                        searchQuery || filterStatus !== 'ALL'
                            ? 'No loans match your search criteria. Try adjusting your filters.'
                            : 'Start tracking book loans by creating your first loan.'
                    }
                    action={
                        !searchQuery && filterStatus === 'ALL'
                            ? {
                                label: 'Create First Loan',
                                onClick: () => setIsModalOpen(true),
                                icon: Plus,
                            }
                            : undefined
                    }
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredLoans.map((loan) => {
                        const overdueStatus = loan.status === 'ACTIVE' && isOverdue(loan.dueDate);
                        const displayStatus = overdueStatus ? 'OVERDUE' : loan.status;

                        return (
                            <motion.div
                                layout
                                key={loan.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileHover={{ y: -4 }}
                                transition={{ duration: 0.2 }}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-3 rounded-lg ${displayStatus === 'ACTIVE' ? 'bg-blue-50 text-blue-600' :
                                            displayStatus === 'OVERDUE' ? 'bg-red-50 text-red-600' :
                                                'bg-green-50 text-green-600'
                                        }`}>
                                        <Bookmark className="w-6 h-6" />
                                    </div>
                                    <span className={`px-2 py-1 text-xs rounded-full font-semibold ${displayStatus === 'ACTIVE' ? 'bg-blue-100 text-blue-800' :
                                            displayStatus === 'OVERDUE' ? 'bg-red-100 text-red-800' :
                                                'bg-green-100 text-green-800'
                                        }`}>
                                        {displayStatus}
                                    </span>
                                </div>

                                <div className="space-y-2 mb-4">
                                    <p className="text-sm"><span className="font-semibold text-gray-700">Loan ID:</span> <span className="text-gray-600">#{loan.id}</span></p>
                                    <p className="text-sm"><span className="font-semibold text-gray-700">Book ID:</span> <span className="text-gray-600">#{loan.bookId}</span></p>
                                    <p className="text-sm"><span className="font-semibold text-gray-700">User ID:</span> <span className="text-gray-600">#{loan.userId}</span></p>
                                    {loan.dueDate && (
                                        <div className={`flex items-center text-sm ${overdueStatus ? 'text-red-600' : 'text-gray-500'}`}>
                                            <Calendar className="w-4 h-4 mr-1" />
                                            Due: {loan.dueDate}
                                        </div>
                                    )}
                                </div>

                                {loan.status === 'ACTIVE' && (
                                    <Button
                                        className="w-full"
                                        variant="secondary"
                                        icon={CheckCircle}
                                        onClick={() => openReturnConfirm(loan.id!)}
                                    >
                                        Return Book
                                    </Button>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Create New Loan"
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
                                    {book.title} (Available: {book.availableCopies})
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
                                    {user.fullName} ({user.email})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                        <Button variant="secondary" onClick={() => setIsModalOpen(false)} disabled={isSaving}>
                            Cancel
                        </Button>
                        <Button onClick={handleBorrow} disabled={isSaving}>
                            {isSaving ? 'Creating...' : 'Confirm Loan'}
                        </Button>
                    </div>
                </div>
            </Modal>

            <ConfirmDialog
                isOpen={returnConfirm.isOpen}
                onClose={() => setReturnConfirm({ isOpen: false })}
                onConfirm={handleReturn}
                title="Return Book"
                message="Are you sure you want to mark this book as returned?"
                confirmText="Return"
                variant="info"
            />
        </div>
    );
};

export default Loans;
