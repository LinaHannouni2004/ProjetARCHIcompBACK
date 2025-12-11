package com.library.recommendation.controller;

import com.library.recommendation.dto.BookRecommendationDTO;
import com.library.recommendation.service.RecommendationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
@Tag(name = "Recommendation Controller", description = "API for book recommendations")
public class RecommendationController {

    private final RecommendationService recommendationService;

    @GetMapping("/most-borrowed")
    @Operation(summary = "Get most borrowed books")
    public ResponseEntity<List<BookRecommendationDTO>> getMostBorrowedBooks(
            @RequestParam(name = "limit", defaultValue = "10") int limit) {
        List<BookRecommendationDTO> recommendations = recommendationService.getMostBorrowedBooks(limit);
        return ResponseEntity.ok(recommendations);
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get personalized recommendations for a user")
    public ResponseEntity<List<BookRecommendationDTO>> getRecommendationsForUser(
            @PathVariable("userId") Long userId) {
        List<BookRecommendationDTO> recommendations = recommendationService.getRecommendationsForUser(userId);
        return ResponseEntity.ok(recommendations);
    }
}
