package com.library.book.repository;

import com.library.book.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    Optional<Book> findByIsbn(String isbn);

    @Query("SELECT b FROM Book b WHERE LOWER(b.title) LIKE LOWER(CONCAT('%', :title, '%'))")
    List<Book> searchByTitle(@Param("title") String title);

    @Query("SELECT b FROM Book b WHERE LOWER(b.category) LIKE LOWER(CONCAT('%', :category, '%'))")
    List<Book> searchByCategory(@Param("category") String category);

    @Query("SELECT b FROM Book b WHERE b.isbn = :isbn")
    List<Book> searchByIsbn(@Param("isbn") String isbn);
}


