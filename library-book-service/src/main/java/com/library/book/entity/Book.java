package com.library.book.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Document(collection = "books")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Book {
    @Id
    private Long id;

    @Indexed
    private String title;

    @Indexed(unique = true)
    private String isbn;

    private String description;

    private LocalDate publicationDate;

    private String category;

    private Integer availableCopies;

    private Integer totalCopies;

    @Indexed
    private Long authorId;
}
