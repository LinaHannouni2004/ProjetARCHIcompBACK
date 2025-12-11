package com.library.book.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookDTO {
    private Long id;

    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must not exceed 200 characters")
    private String title;

    @NotBlank(message = "ISBN is required")
    @Size(max = 20, message = "ISBN must not exceed 20 characters")
    private String isbn;

    @Size(max = 2000, message = "Description must not exceed 2000 characters")
    private String description;

    private LocalDate publicationDate;

    @Size(max = 100, message = "Category must not exceed 100 characters")
    private String category;

    @NotNull(message = "Available copies is required")
    @PositiveOrZero(message = "Available copies must be positive or zero")
    private Integer availableCopies;

    @NotNull(message = "Total copies is required")
    @PositiveOrZero(message = "Total copies must be positive or zero")
    private Integer totalCopies;

    private Long authorId;
}


