package com.library.book.repository;

import com.library.book.entity.Book;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookRepository extends MongoRepository<Book, Long> {
    Optional<Book> findByIsbn(String isbn);

    @Query("{'title': {$regex: ?0, $options: 'i'}}")
    List<Book> searchByTitle(String title);

    @Query("{'category': {$regex: ?0, $options: 'i'}}")
    List<Book> searchByCategory(String category);

    List<Book> findByAuthorId(Long authorId);
}
