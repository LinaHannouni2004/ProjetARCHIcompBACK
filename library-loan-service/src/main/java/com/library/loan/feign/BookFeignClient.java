package com.library.loan.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;

@FeignClient(name = "library-book-service")
public interface BookFeignClient {
    @PutMapping("/api/books/{id}/decrease-copies")
    void decreaseAvailableCopies(@PathVariable("id") Long id);

    @PutMapping("/api/books/{id}/increase-copies")
    void increaseAvailableCopies(@PathVariable("id") Long id);

    @GetMapping("/api/books/{id}/check-availability")
    boolean isBookAvailable(@PathVariable("id") Long id);
}

