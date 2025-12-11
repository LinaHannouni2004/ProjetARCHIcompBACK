package com.library.recommendation.service;

import com.library.recommendation.dto.BookRecommendationDTO;
import com.library.recommendation.dto.BookResponseDTO;
import com.library.recommendation.dto.LoanResponseDTO;
import com.library.recommendation.feign.BookFeignClient;
import com.library.recommendation.feign.LoanFeignClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final LoanFeignClient loanFeignClient;
    private final BookFeignClient bookFeignClient;

    public List<BookRecommendationDTO> getMostBorrowedBooks(int limit) {
        try {
            List<LoanResponseDTO> allLoans = loanFeignClient.getLoansByBookId(0L); // Get all loans
            // Since we can't get all loans directly, we'll use a different approach
            List<BookResponseDTO> allBooks = bookFeignClient.getAllBooks();
            
            Map<Long, Integer> borrowCounts = new HashMap<>();
            
            // Count borrows for each book
            for (BookResponseDTO book : allBooks) {
                try {
                    List<LoanResponseDTO> bookLoans = loanFeignClient.getLoansByBookId(book.getId());
                    borrowCounts.put(book.getId(), bookLoans.size());
                } catch (Exception e) {
                    borrowCounts.put(book.getId(), 0);
                }
            }
            
            return borrowCounts.entrySet().stream()
                    .sorted(Map.Entry.<Long, Integer>comparingByValue().reversed())
                    .limit(limit)
                    .map(entry -> {
                        BookResponseDTO book = allBooks.stream()
                                .filter(b -> b.getId().equals(entry.getKey()))
                                .findFirst()
                                .orElse(null);
                        if (book != null) {
                            BookRecommendationDTO dto = new BookRecommendationDTO();
                            dto.setBookId(book.getId());
                            dto.setTitle(book.getTitle());
                            dto.setIsbn(book.getIsbn());
                            dto.setCategory(book.getCategory());
                            dto.setBorrowCount(entry.getValue());
                            dto.setReason("Most borrowed book");
                            return dto;
                        }
                        return null;
                    })
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }

    public List<BookRecommendationDTO> getRecommendationsForUser(Long userId) {
        try {
            // Get user's loan history
            List<LoanResponseDTO> userLoans = loanFeignClient.getLoansByUserId(userId);
            
            if (userLoans.isEmpty()) {
                // If user has no history, return most borrowed books
                return getMostBorrowedBooks(5);
            }
            
            // Get categories of books user has borrowed
            Set<String> userCategories = new HashSet<>();
            for (LoanResponseDTO loan : userLoans) {
                try {
                    BookResponseDTO book = bookFeignClient.getBookById(loan.getBookId());
                    if (book.getCategory() != null) {
                        userCategories.add(book.getCategory());
                    }
                } catch (Exception e) {
                    // Skip if book not found
                }
            }
            
            // Get all books
            List<BookResponseDTO> allBooks = bookFeignClient.getAllBooks();
            
            // Filter books by user's preferred categories
            List<BookRecommendationDTO> recommendations = allBooks.stream()
                    .filter(book -> {
                        // Exclude books user already borrowed
                        boolean alreadyBorrowed = userLoans.stream()
                                .anyMatch(loan -> loan.getBookId().equals(book.getId()));
                        if (alreadyBorrowed) {
                            return false;
                        }
                        // Include books in user's preferred categories
                        return book.getCategory() != null && userCategories.contains(book.getCategory());
                    })
                    .limit(10)
                    .map(book -> {
                        BookRecommendationDTO dto = new BookRecommendationDTO();
                        dto.setBookId(book.getId());
                        dto.setTitle(book.getTitle());
                        dto.setIsbn(book.getIsbn());
                        dto.setCategory(book.getCategory());
                        dto.setBorrowCount(0);
                        dto.setReason("Based on your reading history in category: " + book.getCategory());
                        return dto;
                    })
                    .collect(Collectors.toList());
            
            // If not enough recommendations, add most borrowed books
            if (recommendations.size() < 5) {
                List<BookRecommendationDTO> mostBorrowed = getMostBorrowedBooks(5);
                for (BookRecommendationDTO dto : mostBorrowed) {
                    if (recommendations.stream().noneMatch(r -> r.getBookId().equals(dto.getBookId()))) {
                        recommendations.add(dto);
                    }
                }
            }
            
            return recommendations.stream().limit(10).collect(Collectors.toList());
        } catch (Exception e) {
            // Fallback to most borrowed books
            return getMostBorrowedBooks(5);
        }
    }
}


