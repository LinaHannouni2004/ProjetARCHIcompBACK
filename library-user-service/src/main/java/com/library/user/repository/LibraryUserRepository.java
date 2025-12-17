package com.library.user.repository;

import com.library.user.entity.LibraryUser;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LibraryUserRepository extends MongoRepository<LibraryUser, Long> {
    Optional<LibraryUser> findByEmail(String email);
}
