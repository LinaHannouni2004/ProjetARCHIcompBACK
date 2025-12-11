package com.library.recommendation.feign;

import com.library.recommendation.dto.LoanResponseDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "library-loan-service")
public interface LoanFeignClient {
    @GetMapping("/api/loans/user/{userId}")
    List<LoanResponseDTO> getLoansByUserId(@PathVariable("userId") Long userId);

    @GetMapping("/api/loans/book/{bookId}")
    List<LoanResponseDTO> getLoansByBookId(@PathVariable("bookId") Long bookId);
}

