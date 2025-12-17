import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Star, BookOpen, Sparkles } from 'lucide-react';
import { recommendationService } from '../services/recommendationService';
import { RecommendationResponseDTO } from '../types';

export default function Recommendations() {
    const [mostBorrowed, setMostBorrowed] = useState<RecommendationResponseDTO[]>([]);
    const [personalizedRecs, setPersonalizedRecs] = useState<RecommendationResponseDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedUserId, setSelectedUserId] = useState<number>(1);

    useEffect(() => {
        fetchRecommendations();
    }, [selectedUserId]);

    const fetchRecommendations = async () => {
        try {
            setLoading(true);
            const [borrowed, personalized] = await Promise.all([
                recommendationService.getMostBorrowedBooks(10),
                recommendationService.getRecommendationsForUser(selectedUserId),
            ]);
            setMostBorrowed(borrowed);
            setPersonalizedRecs(personalized);
        } catch (error) {
            console.error('Failed to fetch recommendations:', error);
        } finally {
            setLoading(false);
        }
    };

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

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <Sparkles className="w-8 h-8 text-indigo-600" />
                        Book Recommendations
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Discover your next favorite book based on popularity and your reading history
                    </p>
                </div>

                {/* User Selector */}
                <div className="flex items-center gap-3">
                    <label htmlFor="userId" className="text-sm font-medium text-gray-700">
                        User ID:
                    </label>
                    <input
                        type="number"
                        id="userId"
                        value={selectedUserId}
                        onChange={(e) => setSelectedUserId(Number(e.target.value))}
                        className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        min="1"
                    />
                </div>
            </div>

            {/* Most Borrowed Books */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="bg-white rounded-xl shadow-lg p-6"
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg">
                        <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Most Borrowed Books</h2>
                        <p className="text-gray-600">Popular choices among all readers</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mostBorrowed.map((book, index) => (
                        <motion.div
                            key={book.bookId}
                            variants={itemVariants}
                            className="group relative bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-4 hover:shadow-md transition-all duration-300 border border-orange-200"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center justify-center w-8 h-8 bg-orange-500 text-white rounded-full font-bold text-sm">
                                        #{index + 1}
                                    </div>
                                    <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">
                                        {book.borrowCount} borrows
                                    </span>
                                </div>
                            </div>

                            <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                                {book.title}
                            </h3>

                            <div className="space-y-1 text-sm text-gray-600">
                                <p className="flex items-center gap-2">
                                    <BookOpen className="w-4 h-4" />
                                    <span className="font-mono text-xs">{book.isbn}</span>
                                </p>
                                {book.category && (
                                    <p className="inline-block px-2 py-1 bg-white rounded-md text-xs font-medium">
                                        {book.category}
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {mostBorrowed.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No borrowed books data available</p>
                    </div>
                )}
            </motion.div>

            {/* Personalized Recommendations */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="bg-white rounded-xl shadow-lg p-6"
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg">
                        <Star className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Personalized For You</h2>
                        <p className="text-gray-600">Based on User #{selectedUserId}'s reading history</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {personalizedRecs.map((book) => (
                        <motion.div
                            key={book.bookId}
                            variants={itemVariants}
                            className="group bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-5 hover:shadow-md transition-all duration-300 border border-indigo-200"
                        >
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-12 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-md flex items-center justify-center">
                                    <BookOpen className="w-6 h-6 text-white" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                                        {book.title}
                                    </h3>

                                    <div className="space-y-2 text-sm">
                                        <p className="text-gray-600 font-mono text-xs">{book.isbn}</p>

                                        {book.category && (
                                            <span className="inline-block px-2 py-1 bg-indigo-100 text-indigo-700 rounded-md text-xs font-medium">
                                                {book.category}
                                            </span>
                                        )}

                                        <div className="flex items-start gap-2 mt-3 p-3 bg-white rounded-md">
                                            <Sparkles className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                                            <p className="text-xs text-gray-700 italic">{book.reason}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {personalizedRecs.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        <Star className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No personalized recommendations available for this user</p>
                        <p className="text-sm mt-2">Try a different user ID or add some loan history</p>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
