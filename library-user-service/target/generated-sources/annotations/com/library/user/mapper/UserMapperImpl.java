package com.library.user.mapper;

import com.library.user.dto.LibraryUserDTO;
import com.library.user.entity.LibraryUser;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-12-04T22:16:36+0100",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.8 (Eclipse Adoptium)"
)
@Component
public class UserMapperImpl implements UserMapper {

    @Override
    public LibraryUserDTO toDTO(LibraryUser user) {
        if ( user == null ) {
            return null;
        }

        LibraryUserDTO libraryUserDTO = new LibraryUserDTO();

        libraryUserDTO.setId( user.getId() );
        libraryUserDTO.setFullName( user.getFullName() );
        libraryUserDTO.setEmail( user.getEmail() );
        libraryUserDTO.setPhone( user.getPhone() );
        libraryUserDTO.setCreatedAt( user.getCreatedAt() );

        return libraryUserDTO;
    }

    @Override
    public LibraryUser toEntity(LibraryUserDTO userDTO) {
        if ( userDTO == null ) {
            return null;
        }

        LibraryUser libraryUser = new LibraryUser();

        libraryUser.setId( userDTO.getId() );
        libraryUser.setFullName( userDTO.getFullName() );
        libraryUser.setEmail( userDTO.getEmail() );
        libraryUser.setPhone( userDTO.getPhone() );
        libraryUser.setCreatedAt( userDTO.getCreatedAt() );

        return libraryUser;
    }

    @Override
    public List<LibraryUserDTO> toDTOList(List<LibraryUser> users) {
        if ( users == null ) {
            return null;
        }

        List<LibraryUserDTO> list = new ArrayList<LibraryUserDTO>( users.size() );
        for ( LibraryUser libraryUser : users ) {
            list.add( toDTO( libraryUser ) );
        }

        return list;
    }
}
