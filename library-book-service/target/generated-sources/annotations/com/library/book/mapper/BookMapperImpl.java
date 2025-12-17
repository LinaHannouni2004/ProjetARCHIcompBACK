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
    date = "2025-12-17T22:16:28+0100",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.44.0.v20251118-1623, environment: Java 21.0.9 (Eclipse Adoptium)"
)
@Component
public class BookMapperImpl implements BookMapper {

    @Override
    public BookDTO toDTO(Book book) {
        if ( book == null ) {
            return null;
        }

        BookDTO bookDTO = new BookDTO();

        bookDTO.setAuthorId( book.getAuthorId() );
        bookDTO.setAvailableCopies( book.getAvailableCopies() );
        bookDTO.setCategory( book.getCategory() );
        bookDTO.setDescription( book.getDescription() );
        bookDTO.setId( book.getId() );
        bookDTO.setIsbn( book.getIsbn() );
        bookDTO.setPublicationDate( book.getPublicationDate() );
        bookDTO.setTitle( book.getTitle() );
        bookDTO.setTotalCopies( book.getTotalCopies() );

        return bookDTO;
    }

    @Override
    public Book toEntity(BookDTO bookDTO) {
        if ( bookDTO == null ) {
            return null;
        }

        Book book = new Book();

        book.setAuthorId( bookDTO.getAuthorId() );
        book.setAvailableCopies( bookDTO.getAvailableCopies() );
        book.setCategory( bookDTO.getCategory() );
        book.setDescription( bookDTO.getDescription() );
        book.setId( bookDTO.getId() );
        book.setIsbn( bookDTO.getIsbn() );
        book.setPublicationDate( bookDTO.getPublicationDate() );
        book.setTitle( bookDTO.getTitle() );
        book.setTotalCopies( bookDTO.getTotalCopies() );

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

        bookWithAuthorDTO.setAuthorId( book.getAuthorId() );
        bookWithAuthorDTO.setAvailableCopies( book.getAvailableCopies() );
        bookWithAuthorDTO.setCategory( book.getCategory() );
        bookWithAuthorDTO.setDescription( book.getDescription() );
        bookWithAuthorDTO.setId( book.getId() );
        bookWithAuthorDTO.setIsbn( book.getIsbn() );
        bookWithAuthorDTO.setPublicationDate( book.getPublicationDate() );
        bookWithAuthorDTO.setTitle( book.getTitle() );
        bookWithAuthorDTO.setTotalCopies( book.getTotalCopies() );

        return bookWithAuthorDTO;
    }
}
