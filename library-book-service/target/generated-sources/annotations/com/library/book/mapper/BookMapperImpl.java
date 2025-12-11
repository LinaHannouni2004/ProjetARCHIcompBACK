package com.library.book.mapper;

import com.library.book.dto.BookDTO;
import com.library.book.dto.BookWithAuthorDTO;
import com.library.book.entity.Book;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-12-04T22:49:45+0100",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.8 (Eclipse Adoptium)"
)
@Component
public class BookMapperImpl implements BookMapper {

    @Override
    public BookDTO toDTO(Book book) {
        if ( book == null ) {
            return null;
        }

        BookDTO bookDTO = new BookDTO();

        bookDTO.setId( book.getId() );
        bookDTO.setTitle( book.getTitle() );
        bookDTO.setIsbn( book.getIsbn() );
        bookDTO.setDescription( book.getDescription() );
        bookDTO.setPublicationDate( book.getPublicationDate() );
        bookDTO.setCategory( book.getCategory() );
        bookDTO.setAvailableCopies( book.getAvailableCopies() );
        bookDTO.setTotalCopies( book.getTotalCopies() );
        bookDTO.setAuthorId( book.getAuthorId() );

        return bookDTO;
    }

    @Override
    public Book toEntity(BookDTO bookDTO) {
        if ( bookDTO == null ) {
            return null;
        }

        Book book = new Book();

        book.setId( bookDTO.getId() );
        book.setTitle( bookDTO.getTitle() );
        book.setIsbn( bookDTO.getIsbn() );
        book.setDescription( bookDTO.getDescription() );
        book.setPublicationDate( bookDTO.getPublicationDate() );
        book.setCategory( bookDTO.getCategory() );
        book.setAvailableCopies( bookDTO.getAvailableCopies() );
        book.setTotalCopies( bookDTO.getTotalCopies() );
        book.setAuthorId( bookDTO.getAuthorId() );

        return book;
    }

    @Override
    public List<BookDTO> toDTOList(List<Book> books) {
        if ( books == null ) {
            return null;
        }

        List<BookDTO> list = new ArrayList<BookDTO>( books.size() );
        for ( Book book : books ) {
            list.add( toDTO( book ) );
        }

        return list;
    }

    @Override
    public BookWithAuthorDTO toBookWithAuthorDTO(Book book) {
        if ( book == null ) {
            return null;
        }

        BookWithAuthorDTO bookWithAuthorDTO = new BookWithAuthorDTO();

        bookWithAuthorDTO.setId( book.getId() );
        bookWithAuthorDTO.setTitle( book.getTitle() );
        bookWithAuthorDTO.setIsbn( book.getIsbn() );
        bookWithAuthorDTO.setDescription( book.getDescription() );
        bookWithAuthorDTO.setPublicationDate( book.getPublicationDate() );
        bookWithAuthorDTO.setCategory( book.getCategory() );
        bookWithAuthorDTO.setAvailableCopies( book.getAvailableCopies() );
        bookWithAuthorDTO.setTotalCopies( book.getTotalCopies() );
        bookWithAuthorDTO.setAuthorId( book.getAuthorId() );

        return bookWithAuthorDTO;
    }
}
