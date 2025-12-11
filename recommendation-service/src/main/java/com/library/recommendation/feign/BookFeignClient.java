package com.library.recommendation.feign;

import com.library.recommendation.dto.BookResponseDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "library-book-service")
public interface BookFeignClient {
    @GetMapping("/api/books")
    List<BookResponseDTO> getAllBooks();

    @GetMapping("/api/books/{id}")
    BookResponseDTO getBookById(@PathVariable("id") Long id);
}

