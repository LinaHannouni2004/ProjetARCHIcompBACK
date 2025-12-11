package com.library.book.service;

import com.library.book.dto.AuthorResponseDTO;
import com.library.book.dto.BookDTO;
import com.library.book.dto.BookWithAuthorDTO;
import com.library.book.entity.Book;
import com.library.book.feign.AuthorFeignClient;
import com.library.book.mapper.BookMapper;
import com.library.book.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class BookService {

    private final BookRepository bookRepository;
    private final BookMapper bookMapper;
    private final AuthorFeignClient authorFeignClient;

    public BookDTO createBook(BookDTO bookDTO) {
        if (bookDTO.getAvailableCopies() == null) {
            bookDTO.setAvailableCopies(bookDTO.getTotalCopies());
        }
        Book book = bookMapper.toEntity(bookDTO);
        Book saved = bookRepository.save(book);
        return bookMapper.toDTO(saved);
    }

    @Transactional(readOnly = true)
    public BookDTO getBookById(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found with id: " + id));
        return bookMapper.toDTO(book);
    }

    @Transactional(readOnly = true)
    public BookWithAuthorDTO getBookWithAuthorById(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found with id: " + id));
        BookWithAuthorDTO dto = bookMapper.toBookWithAuthorDTO(book);
        if (book.getAuthorId() != null) {
            try {
                AuthorResponseDTO author = authorFeignClient.getAuthorById(book.getAuthorId());
                dto.setAuthorName(author.getFirstName() + " " + author.getLastName());
            } catch (Exception e) {
                dto.setAuthorName("Unknown Author");
            }
        }
        return dto;
    }

    @Transactional(readOnly = true)
    public List<BookDTO> getAllBooks() {
        return bookRepository.findAll().stream()
                .map(bookMapper::toDTO)
                .collect(Collectors.toList());
    }

    public BookDTO updateBook(Long id, BookDTO bookDTO) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found with id: " + id));
        book.setTitle(bookDTO.getTitle());
        book.setIsbn(bookDTO.getIsbn());
        book.setDescription(bookDTO.getDescription());
        book.setPublicationDate(bookDTO.getPublicationDate());
        book.setCategory(bookDTO.getCategory());
        book.setTotalCopies(bookDTO.getTotalCopies());
        book.setAvailableCopies(bookDTO.getAvailableCopies());
        book.setAuthorId(bookDTO.getAuthorId());
        Book updated = bookRepository.save(book);
        return bookMapper.toDTO(updated);
    }

    public void deleteBook(Long id) {
        if (!bookRepository.existsById(id)) {
            throw new RuntimeException("Book not found with id: " + id);
        }
        bookRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<BookDTO> searchBooks(String title, String isbn, String category) {
        if (title != null && !title.isEmpty()) {
            return bookRepository.searchByTitle(title).stream()
                    .map(bookMapper::toDTO)
                    .collect(Collectors.toList());
        }
        if (isbn != null && !isbn.isEmpty()) {
            return bookRepository.searchByIsbn(isbn).stream()
                    .map(bookMapper::toDTO)
                    .collect(Collectors.toList());
        }
        if (category != null && !category.isEmpty()) {
            return bookRepository.searchByCategory(category).stream()
                    .map(bookMapper::toDTO)
                    .collect(Collectors.toList());
        }
        return getAllBooks();
    }

    public void decreaseAvailableCopies(Long bookId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found with id: " + bookId));
        if (book.getAvailableCopies() > 0) {
            book.setAvailableCopies(book.getAvailableCopies() - 1);
            bookRepository.save(book);
        } else {
            throw new RuntimeException("No available copies for book with id: " + bookId);
        }
    }

    public void increaseAvailableCopies(Long bookId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found with id: " + bookId));
        if (book.getAvailableCopies() < book.getTotalCopies()) {
            book.setAvailableCopies(book.getAvailableCopies() + 1);
            bookRepository.save(book);
        }
    }

    @Transactional(readOnly = true)
    public boolean isBookAvailable(Long bookId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found with id: " + bookId));
        return book.getAvailableCopies() > 0;
    }
}


