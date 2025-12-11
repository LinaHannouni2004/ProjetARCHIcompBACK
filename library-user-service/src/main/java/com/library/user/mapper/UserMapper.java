package com.library.user.mapper;

import com.library.user.dto.LibraryUserDTO;
import com.library.user.entity.LibraryUser;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

    LibraryUserDTO toDTO(LibraryUser user);
    LibraryUser toEntity(LibraryUserDTO userDTO);
    List<LibraryUserDTO> toDTOList(List<LibraryUser> users);
}


