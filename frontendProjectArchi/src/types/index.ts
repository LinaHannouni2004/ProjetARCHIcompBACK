export interface BookDTO {
    id?: number;
    title: string;
    isbn: string;
    description?: string;
    publicationDate?: string; // ISO Date
    category?: string;
    availableCopies: number;
    totalCopies: number;
    authorId?: number;
}

export interface AuthorDTO {
    id?: number;
    firstName: string;
    lastName: string;
    bio?: string;
    birthDate?: string; // ISO Date
}

export interface BookWithAuthorDTO extends BookDTO {
    authorName: string;
    authorBiography?: string;
}

export interface LibraryUserDTO {
    id?: number;
    fullName: string;
    email: string;
    phone?: string;
    createdAt?: string; // ISO DateTime
}

export interface BorrowRequestDTO {
    userId: number;
    bookId: number;
}

export interface LoanDTO {
    id?: number;
    userId: number;
    bookId: number;
    borrowDate?: string; // ISO Date
    dueDate?: string; // ISO Date
    returnDate?: string; // ISO Date
    status?: 'ACTIVE' | 'RETURNED' | 'OVERDUE';
}

export interface RecommendationResponseDTO {
    bookId: number;
    title: string;
    author: string;
    relevanceScore: number;
}
