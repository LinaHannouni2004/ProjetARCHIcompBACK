package com.library.client.service;

import com.library.client.dto.AuthorResponseDTO;
import com.library.client.dto.BookResponseDTO;
import com.library.client.dto.BookWithAuthorDTO;
import com.library.client.dto.RecommendationResponseDTO;
import com.library.client.feign.AuthorFeignClient;
import com.library.client.feign.BookFeignClient;
import com.library.client.feign.RecommendationFeignClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ClientService {

    private final BookFeignClient bookFeignClient;
    private final AuthorFeignClient authorFeignClient;
    private final RecommendationFeignClient recommendationFeignClient;

    public List<BookWithAuthorDTO> getAllBooksWithAuthors() {
        try {
            List<BookResponseDTO> books = bookFeignClient.getAllBooks();
            List<BookWithAuthorDTO> result = new ArrayList<>();

            for (BookResponseDTO book : books) {
                BookWithAuthorDTO dto = new BookWithAuthorDTO();
                dto.setId(book.getId());
                dto.setTitle(book.getTitle());
                dto.setIsbn(book.getIsbn());
                dto.setDescription(book.getDescription());
                dto.setPublicationDate(book.getPublicationDate());
                dto.setCategory(book.getCategory());
                dto.setAvailableCopies(book.getAvailableCopies());
                dto.setTotalCopies(book.getTotalCopies());
                dto.setAuthorId(book.getAuthorId());

                if (book.getAuthorId() != null) {
                    try {
                        AuthorResponseDTO author = authorFeignClient.getAuthorById(book.getAuthorId());
                        dto.setAuthorFirstName(author.getFirstName());
                        dto.setAuthorLastName(author.getLastName());
                        dto.setAuthorBio(author.getBio());
                    } catch (Exception e) {
                        dto.setAuthorFirstName("Unknown");
                        dto.setAuthorLastName("Author");
                    }
                }

                result.add(dto);
            }

            return result;
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    public List<RecommendationResponseDTO> getRecommendationsForUser(Long userId) {
        try {
            return recommendationFeignClient.getRecommendationsForUser(userId);
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    public List<RecommendationResponseDTO> getMostBorrowedBooks(int limit) {
        try {
            return recommendationFeignClient.getMostBorrowedBooks(limit);
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }
}


