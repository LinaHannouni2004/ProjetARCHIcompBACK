package com.library.client.feign;

import com.library.client.dto.RecommendationResponseDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name = "recommendation-service")
public interface RecommendationFeignClient {

    @GetMapping("/api/recommendations/user/{userId}")
    List<RecommendationResponseDTO> getRecommendationsForUser(@PathVariable("userId") Long userId);

    @GetMapping("/api/recommendations/most-borrowed")
    List<RecommendationResponseDTO> getMostBorrowedBooks(
            @RequestParam(name = "limit", defaultValue = "10") int limit
    );
}
