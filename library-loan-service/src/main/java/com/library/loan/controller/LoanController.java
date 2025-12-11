package com.library.loan.controller;

import com.library.loan.dto.BorrowRequestDTO;
import com.library.loan.dto.LoanDTO;
import com.library.loan.service.LoanService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/loans")
@RequiredArgsConstructor
@Tag(name = "Loan Controller", description = "API for managing book loans")
public class LoanController {

    private final LoanService loanService;

    @PostMapping("/borrow")
    @Operation(summary = "Borrow a book")
    public ResponseEntity<LoanDTO> borrowBook(@Valid @RequestBody BorrowRequestDTO request) {
        LoanDTO loan = loanService.borrowBook(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(loan);
    }

    @PutMapping("/{id}/return")
    @Operation(summary = "Return a book")
    public ResponseEntity<LoanDTO> returnBook(@PathVariable("id") Long id) {
        LoanDTO loan = loanService.returnBook(id);
        return ResponseEntity.ok(loan);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get loan by ID")
    public ResponseEntity<LoanDTO> getLoanById(@PathVariable("id") Long id) {
        LoanDTO loan = loanService.getLoanById(id);
        return ResponseEntity.ok(loan);
    }

    @GetMapping
    @Operation(summary = "Get all loans")
    public ResponseEntity<List<LoanDTO>> getAllLoans() {
        List<LoanDTO> loans = loanService.getAllLoans();
        return ResponseEntity.ok(loans);
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get all loans for a user")
    public ResponseEntity<List<LoanDTO>> getLoansByUserId(@PathVariable("userId") Long userId) {
        List<LoanDTO> loans = loanService.getLoansByUserId(userId);
        return ResponseEntity.ok(loans);
    }

    @GetMapping("/book/{bookId}")
    @Operation(summary = "Get all loans for a book")
    public ResponseEntity<List<LoanDTO>> getLoansByBookId(@PathVariable("bookId") Long bookId) {
        List<LoanDTO> loans = loanService.getLoansByBookId(bookId);
        return ResponseEntity.ok(loans);
    }

    @GetMapping("/user/{userId}/active")
    @Operation(summary = "Get active loans for a user")
    public ResponseEntity<List<LoanDTO>> getActiveLoansByUserId(@PathVariable("userId") Long userId) {
        List<LoanDTO> loans = loanService.getActiveLoansByUserId(userId);
        return ResponseEntity.ok(loans);
    }
}
