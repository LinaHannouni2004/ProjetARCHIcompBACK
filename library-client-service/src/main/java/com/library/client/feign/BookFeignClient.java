package com.library.client.feign;

import com.library.client.dto.BookResponseDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "library-book-service")
public interface BookFeignClient {
    @GetMapping("/api/books")
    List<BookResponseDTO> getAllBooks();

    @GetMapping("/api/books/{id}/with-author")
    BookResponseDTO getBookWithAuthorById(@PathVariable("id") Long id);
}

