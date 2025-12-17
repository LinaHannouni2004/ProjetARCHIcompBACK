package com.library.loan.repository;

import com.library.loan.entity.Loan;
import com.library.loan.entity.LoanStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LoanRepository extends MongoRepository<Loan, Long> {
    List<Loan> findByUserId(Long userId);

    List<Loan> findByBookId(Long bookId);

    List<Loan> findByStatus(LoanStatus status);

    List<Loan> findByUserIdAndStatus(Long userId, LoanStatus status);
}
