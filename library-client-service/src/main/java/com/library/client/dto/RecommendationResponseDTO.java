package com.library.client.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecommendationResponseDTO {
    private Long bookId;
    private String title;
    private String isbn;
    private String category;
    private Integer borrowCount;
    private String reason;
}


