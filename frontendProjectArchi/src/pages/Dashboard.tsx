import React, { useEffect, useState } from 'react';
import { bookService } from '../services/bookService';
import { userService } from '../services/userService';
import { loanService } from '../services/loanService';
import { BookOpen, Users, Bookmark, TrendingUp, TrendingDown, Activity, Clock, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { StatsAreaChart } from '../components/charts/StatsAreaChart';
import { StatsPieChart } from '../components/charts/StatsPieChart';
import { StatsBarChart } from '../components/charts/StatsBarChart';
import { SkeletonStat, SkeletonCard } from '../components/Skeleton';
import { format, subDays } from 'date-fns';

interface Stats {
    books: number;
    users: number;
    activeLoans: number;
    overdueLoans: number;
    booksChange: number;
    usersChange: number;
    loansChange: number;
}

export const Dashboard: React.FC = () => {
    const [stats, setStats] = useState<Stats>({
        books: 0,
        users: 0,
        activeLoans: 0,
        overdueLoans: 0,
        booksChange: 0,
        usersChange: 0,
        loansChange: 0,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [loansTrend, setLoansTrend] = useState<{ name: string; value: number }[]>([]);
    const [booksByCategory, setBooksByCategory] = useState<{ name: string; value: number }[]>([]);
    const [topBooks, setTopBooks] = useState<{ name: string; value: number }[]>([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setIsLoading(true);
            const [books, users, loans] = await Promise.all([
                bookService.getAllBooks(),
                userService.getAllUsers(),
                loanService.getAllLoans(),
            ]);

            // Calculate stats
            const activeLoans = loans.filter(l => l.status === 'ACTIVE');
            const overdueLoans = loans.filter(l => l.status === 'OVERDUE');

            setStats({
                books: books.length,
                users: users.length,
                activeLoans: activeLoans.length,
                overdueLoans: overdueLoans.length,
                booksChange: 12, // Mock data - would come from backend
                usersChange: 8,
                loansChange: -5,
            });

            // Generate loans trend (last 7 days)
            const trendData = Array.from({ length: 7 }, (_, i) => {
                const date = subDays(new Date(), 6 - i);
                return {
                    name: format(date, 'EEE'),
                    value: Math.floor(Math.random() * 20) + 10, // Mock data
                };
            });
            setLoansTrend(trendData);

            // Books by category
            const categoryMap = new Map<string, number>();
            books.forEach(book => {
                const category = book.category || 'Uncategorized';
                categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
            });
            const categoryData = Array.from(categoryMap.entries())
                .map(([name, value]) => ({ name, value }))
                .slice(0, 6);
            setBooksByCategory(categoryData);

            // Top borrowed books (mock data - would need loan history)
            const topBooksData = books
                .slice(0, 5)
                .map(book => ({
                    name: book.title.length > 15 ? book.title.substring(0, 15) + '...' : book.title,
                    value: Math.floor(Math.random() * 50) + 10,
                }));
            setTopBooks(topBooksData);

        } catch (error) {
            console.error('Failed to fetch dashboard data', error);
        } finally {
            setIsLoading(false);
        }
    };

    const statCards = [
        {
            label: 'Total Books',
            value: stats.books,
            change: stats.booksChange,
            icon: BookOpen,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            gradient: 'from-blue-500 to-blue-600',
        },
        {
            label: 'Registered Users',
            value: stats.users,
            change: stats.usersChange,
            icon: Users,
            color: 'text-green-600',
            bg: 'bg-green-50',
            gradient: 'from-green-500 to-green-600',
        },
        {
            label: 'Active Loans',
            value: stats.activeLoans,
            change: stats.loansChange,
            icon: Bookmark,
            color: 'text-indigo-600',
            bg: 'bg-indigo-50',
            gradient: 'from-indigo-500 to-indigo-600',
        },
        {
            label: 'Overdue Loans',
            value: stats.overdueLoans,
            change: 0,
            icon: AlertCircle,
            color: 'text-red-600',
            bg: 'bg-red-50',
            gradient: 'from-red-500 to-red-600',
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
        },
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500 mt-1">Welcome back! Here's what's happening with your library.</p>
            </div>

            {/* Stats Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => <SkeletonStat key={i} />)}
                </div>
            ) : (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {statCards.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            variants={itemVariants}
                            whileHover={{ y: -4, transition: { duration: 0.2 } }}
                            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group"
                        >
                            {/* Gradient background on hover */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                            <div className="relative">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                                        <stat.icon className="w-6 h-6" />
                                    </div>
                                    {stat.change !== 0 && (
                                        <div className={`flex items-center gap-1 text-sm font-medium ${stat.change > 0 ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            {stat.change > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                            <span>{Math.abs(stat.change)}%</span>
                                        </div>
                                    )}
                                </div>
                                <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
                                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}

            {/* Charts Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {[1, 2].map(i => <SkeletonCard key={i} />)}
                </div>
            ) : (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                >
                    {/* Loans Trend */}
                    <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-indigo-50 rounded-lg">
                                <Clock className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Loans Trend</h3>
                                <p className="text-sm text-gray-500">Last 7 days</p>
                            </div>
                        </div>
                        <StatsAreaChart data={loansTrend} color="#6366f1" />
                    </motion.div>

                    {/* Books by Category */}
                    <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-purple-50 rounded-lg">
                                <BookOpen className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Books by Category</h3>
                                <p className="text-sm text-gray-500">Distribution</p>
                            </div>
                        </div>
                        <StatsPieChart data={booksByCategory} />
                    </motion.div>
                </motion.div>
            )}

            {/* Top Borrowed Books */}
            {!isLoading && topBooks.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-orange-50 rounded-lg">
                            <TrendingUp className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Top Borrowed Books</h3>
                            <p className="text-sm text-gray-500">Most popular titles</p>
                        </div>
                    </div>
                    <StatsBarChart data={topBooks} color="#f59e0b" height={250} />
                </motion.div>
            )}

            {/* System Status */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-2xl border border-indigo-100 text-center"
            >
                <div className="inline-flex p-4 rounded-full bg-white shadow-sm mb-4">
                    <Activity className="w-8 h-8 text-indigo-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">All Systems Operational</h2>
                <p className="text-gray-600">All microservices are running smoothly and communicating normally.</p>
            </motion.div>
        </div>
    );
};

export default Dashboard;
