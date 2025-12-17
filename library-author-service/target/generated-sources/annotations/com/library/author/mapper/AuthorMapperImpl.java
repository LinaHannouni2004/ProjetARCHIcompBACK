package com.library.author.mapper;

import com.library.author.dto.AuthorDTO;
import com.library.author.entity.Author;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-12-17T22:16:26+0100",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.44.0.v20251118-1623, environment: Java 21.0.9 (Eclipse Adoptium)"
)
@Component
public class AuthorMapperImpl implements AuthorMapper {

    @Override
    public AuthorDTO toDTO(Author author) {
        if ( author == null ) {
            return null;
        }

        AuthorDTO authorDTO = new AuthorDTO();

        authorDTO.setBio( author.getBio() );
        authorDTO.setBirthDate( author.getBirthDate() );
        authorDTO.setFirstName( author.getFirstName() );
        authorDTO.setId( author.getId() );
        authorDTO.setLastName( author.getLastName() );

        return authorDTO;
    }

    @Override
    public Author toEntity(AuthorDTO authorDTO) {
        if ( authorDTO == null ) {
            return null;
        }

        Author author = new Author();

        author.setBio( authorDTO.getBio() );
        author.setBirthDate( authorDTO.getBirthDate() );
        author.setFirstName( authorDTO.getFirstName() );
        author.setId( authorDTO.getId() );
        author.setLastName( authorDTO.getLastName() );

        return author;
    }

    @Override
    public List<AuthorDTO> toDTOList(List<Author> authors) {
        if ( authors == null ) {
            return null;
        }

        List<AuthorDTO> list = new ArrayList<AuthorDTO>( authors.size() );
        for ( Author author : authors ) {
            list.add( toDTO( author ) );
        }

        return list;
    }
}
