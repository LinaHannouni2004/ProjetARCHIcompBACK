package com.library.book.mapper;

import com.library.book.dto.BookDTO;
import com.library.book.dto.BookWithAuthorDTO;
import com.library.book.entity.Book;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface BookMapper {
    BookMapper INSTANCE = Mappers.getMapper(BookMapper.class);

    BookDTO toDTO(Book book);
    Book toEntity(BookDTO bookDTO);
    List<BookDTO> toDTOList(List<Book> books);
    
    @org.mapstruct.Mapping(target = "authorName", ignore = true)
    BookWithAuthorDTO toBookWithAuthorDTO(Book book);
}


