package com.library.author.mapper;

import com.library.author.dto.AuthorDTO;
import com.library.author.entity.Author;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface AuthorMapper {
    AuthorMapper INSTANCE = Mappers.getMapper(AuthorMapper.class);

    AuthorDTO toDTO(Author author);
    Author toEntity(AuthorDTO authorDTO);
    List<AuthorDTO> toDTOList(List<Author> authors);
}


