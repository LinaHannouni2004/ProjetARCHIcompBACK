package com.library.author.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Document(collection = "authors")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Author {
    @Id
    private Long id;

    @Indexed
    private String firstName;

    private String lastName;

    private String bio;

    private LocalDate birthDate;
}
