package com.library.book.feign;

import com.library.book.dto.AuthorResponseDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "library-author-service")
public interface AuthorFeignClient {
    @GetMapping("/api/authors/{id}")
    AuthorResponseDTO getAuthorById(@PathVariable("id") Long id);
}

