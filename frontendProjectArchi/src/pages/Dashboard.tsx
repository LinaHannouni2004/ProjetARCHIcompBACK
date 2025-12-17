import React, { useEffect, useState } from 'react';
import { bookService } from '../services/bookService';
import { userService } from '../services/userService';
import { loanService } from '../services/loanService';
import { BookOpen, Users, Bookmark, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export const Dashboard: React.FC = () => {
    const [stats, setStats] = useState({
        books: 0,
        users: 0,
        activeLoans: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [books, users, loans] = await Promise.all([
                    bookService.getAllBooks(),
                    userService.getAllUsers(),
                    loanService.getAllLoans()
                ]);
                setStats({
                    books: books.length,
                    users: users.length,
                    activeLoans: loans.filter(l => l.status === 'ACTIVE').length
                });
            } catch (error) {
                console.error('Failed to fetch stats', error);
            }
        };
        fetchStats();
    }, []);

    const statCards = [
        { label: 'Total Books', value: stats.books, icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Registered Users', value: stats.users, icon: Users, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Active Loans', value: stats.activeLoans, icon: Bookmark, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500 mt-1">Overview of your library system</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {statCards.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4"
                    >
                        <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
                            <stat.icon className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center py-16">
                <div className="inline-flex p-4 rounded-full bg-indigo-50 text-indigo-600 mb-4">
                    <Activity className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">System Status</h2>
                <p className="text-gray-500">All microservices are communicating normally.</p>
            </div>
        </div>
    );
};

export default Dashboard;
