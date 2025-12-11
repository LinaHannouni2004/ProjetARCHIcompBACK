package com.library.book.controller;

import com.library.book.dto.BookDTO;
import com.library.book.dto.BookWithAuthorDTO;
import com.library.book.service.BookService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
@Tag(name = "Book Controller", description = "API for managing books")
public class BookController {

    private final BookService bookService;

    @PostMapping
    @Operation(summary = "Create a new book")
    public ResponseEntity<BookDTO> createBook(@Valid @RequestBody BookDTO bookDTO) {
        BookDTO created = bookService.createBook(bookDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get book by ID")
    public ResponseEntity<BookDTO> getBookById(@PathVariable("id") Long id) {
        BookDTO book = bookService.getBookById(id);
        return ResponseEntity.ok(book);
    }

    @GetMapping("/{id}/with-author")
    @Operation(summary = "Get book by ID with author information")
    public ResponseEntity<BookWithAuthorDTO> getBookWithAuthorById(@PathVariable("id") Long id) {
        BookWithAuthorDTO book = bookService.getBookWithAuthorById(id);
        return ResponseEntity.ok(book);
    }

    @GetMapping
    @Operation(summary = "Get all books")
    public ResponseEntity<List<BookDTO>> getAllBooks() {
        List<BookDTO> books = bookService.getAllBooks();
        return ResponseEntity.ok(books);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update book")
    public ResponseEntity<BookDTO> updateBook(
            @PathVariable("id") Long id,
            @Valid @RequestBody BookDTO bookDTO
    ) {
        BookDTO updated = bookService.updateBook(id, bookDTO);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete book")
    public ResponseEntity<Void> deleteBook(@PathVariable("id") Long id) {
        bookService.deleteBook(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    @Operation(summary = "Search books by title, ISBN, or category")
    public ResponseEntity<List<BookDTO>> searchBooks(
            @RequestParam(name = "title", required = false) String title,
            @RequestParam(name = "isbn", required = false) String isbn,
            @RequestParam(name = "category", required = false) String category
    ) {
        List<BookDTO> books = bookService.searchBooks(title, isbn, category);
        return ResponseEntity.ok(books);
    }

    @PutMapping("/{id}/decrease-copies")
    @Operation(summary = "Decrease available copies (internal use)")
    public ResponseEntity<Void> decreaseAvailableCopies(@PathVariable("id") Long id) {
        bookService.decreaseAvailableCopies(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/increase-copies")
    @Operation(summary = "Increase available copies (internal use)")
    public ResponseEntity<Void> increaseAvailableCopies(@PathVariable("id") Long id) {
        bookService.increaseAvailableCopies(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/check-availability")
    @Operation(summary = "Check if book is available (internal use)")
    public ResponseEntity<Boolean> checkAvailability(@PathVariable("id") Long id) {
        boolean available = bookService.isBookAvailable(id);
        return ResponseEntity.ok(available);
    }
}
