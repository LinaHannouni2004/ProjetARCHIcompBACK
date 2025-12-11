package com.library.client.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookWithAuthorDTO {
    private Long id;
    private String title;
    private String isbn;
    private String description;
    private LocalDate publicationDate;
    private String category;
    private Integer availableCopies;
    private Integer totalCopies;
    private Long authorId;
    private String authorFirstName;
    private String authorLastName;
    private String authorBio;
}


