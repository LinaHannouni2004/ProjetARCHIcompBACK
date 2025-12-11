package com.library.loan.service;

import com.library.loan.dto.BorrowRequestDTO;
import com.library.loan.dto.LoanDTO;
import com.library.loan.entity.Loan;
import com.library.loan.entity.LoanStatus;
import com.library.loan.feign.BookFeignClient;
import com.library.loan.feign.UserFeignClient;
import com.library.loan.mapper.LoanMapper;
import com.library.loan.repository.LoanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class LoanService {

    private final LoanRepository loanRepository;
    private final LoanMapper loanMapper;
    private final BookFeignClient bookFeignClient;
    private final UserFeignClient userFeignClient;

    public LoanDTO borrowBook(BorrowRequestDTO request) {
        // Verify user exists
        try {
            userFeignClient.getUserById(request.getUserId());
        } catch (Exception e) {
            throw new RuntimeException("User not found with id: " + request.getUserId());
        }

        // Check book availability
        try {
            boolean available = bookFeignClient.isBookAvailable(request.getBookId());
            if (!available) {
                throw new RuntimeException("Book is not available");
            }
        } catch (Exception e) {
            throw new RuntimeException("Book not found or not available: " + e.getMessage());
        }

        // Decrease available copies
        try {
            bookFeignClient.decreaseAvailableCopies(request.getBookId());
        } catch (Exception e) {
            throw new RuntimeException("Failed to update book availability: " + e.getMessage());
        }

        // Create loan
        Loan loan = new Loan();
        loan.setUserId(request.getUserId());
        loan.setBookId(request.getBookId());
        loan.setBorrowDate(LocalDate.now());
        loan.setDueDate(LocalDate.now().plusDays(14)); // 14 days loan period
        loan.setStatus(LoanStatus.ACTIVE);

        Loan saved = loanRepository.save(loan);
        return loanMapper.toDTO(saved);
    }

    public LoanDTO returnBook(Long loanId) {
        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found with id: " + loanId));

        if (loan.getStatus() == LoanStatus.RETURNED) {
            throw new RuntimeException("Loan already returned");
        }

        // Increase available copies
        try {
            bookFeignClient.increaseAvailableCopies(loan.getBookId());
        } catch (Exception e) {
            throw new RuntimeException("Failed to update book availability: " + e.getMessage());
        }

        loan.setReturnDate(LocalDate.now());
        loan.setStatus(LoanStatus.RETURNED);

        Loan updated = loanRepository.save(loan);
        return loanMapper.toDTO(updated);
    }

    @Transactional(readOnly = true)
    public LoanDTO getLoanById(Long id) {
        Loan loan = loanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Loan not found with id: " + id));
        return loanMapper.toDTO(loan);
    }

    @Transactional(readOnly = true)
    public List<LoanDTO> getAllLoans() {
        return loanRepository.findAll().stream()
                .map(loanMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<LoanDTO> getLoansByUserId(Long userId) {
        return loanRepository.findByUserId(userId).stream()
                .map(loanMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<LoanDTO> getLoansByBookId(Long bookId) {
        return loanRepository.findByBookId(bookId).stream()
                .map(loanMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<LoanDTO> getActiveLoansByUserId(Long userId) {
        return loanRepository.findByUserIdAndStatus(userId, LoanStatus.ACTIVE).stream()
                .map(loanMapper::toDTO)
                .collect(Collectors.toList());
    }
}


