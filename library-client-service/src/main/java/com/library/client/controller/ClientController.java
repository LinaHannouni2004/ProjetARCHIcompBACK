package com.library.client.controller;

import com.library.client.dto.BookWithAuthorDTO;
import com.library.client.dto.RecommendationResponseDTO;
import com.library.client.service.ClientService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/client")
@RequiredArgsConstructor
@Tag(name = "Client Controller", description = "Aggregated API endpoints")
public class ClientController {

    private final ClientService clientService;

    @GetMapping("/books/with-authors")
    @Operation(summary = "Get all books with author information")
    public ResponseEntity<List<BookWithAuthorDTO>> getAllBooksWithAuthors() {
        List<BookWithAuthorDTO> books = clientService.getAllBooksWithAuthors();
        return ResponseEntity.ok(books);
    }

    @GetMapping("/recommendations/user/{userId}")
    @Operation(summary = "Get recommendations for a specific user")
    public ResponseEntity<List<RecommendationResponseDTO>> getRecommendationsForUser(
            @PathVariable("userId") Long userId
    ) {
        List<RecommendationResponseDTO> recommendations = clientService.getRecommendationsForUser(userId);
        return ResponseEntity.ok(recommendations);
    }

    @GetMapping("/recommendations/most-borrowed")
    @Operation(summary = "Get most borrowed books")
    public ResponseEntity<List<RecommendationResponseDTO>> getMostBorrowedBooks(
            @RequestParam(name = "limit", defaultValue = "10") int limit
    ) {
        List<RecommendationResponseDTO> recommendations = clientService.getMostBorrowedBooks(limit);
        return ResponseEntity.ok(recommendations);
    }
}
