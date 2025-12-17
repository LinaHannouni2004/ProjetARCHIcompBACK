package com.library.user.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Document(collection = "library_users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LibraryUser {
    @Id
    private Long id;

    private String fullName;

    @Indexed(unique = true)
    private String email;

    private String phone;

    private LocalDateTime createdAt;
}
