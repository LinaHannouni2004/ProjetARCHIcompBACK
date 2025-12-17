package com.library.user.mapper;

import com.library.user.dto.LibraryUserDTO;
import com.library.user.entity.LibraryUser;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-12-17T22:16:31+0100",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.44.0.v20251118-1623, environment: Java 21.0.9 (Eclipse Adoptium)"
)
@Component
public class UserMapperImpl implements UserMapper {

    @Override
    public LibraryUserDTO toDTO(LibraryUser user) {
        if ( user == null ) {
            return null;
        }

        LibraryUserDTO libraryUserDTO = new LibraryUserDTO();

        libraryUserDTO.setCreatedAt( user.getCreatedAt() );
        libraryUserDTO.setEmail( user.getEmail() );
        libraryUserDTO.setFullName( user.getFullName() );
        libraryUserDTO.setId( user.getId() );
        libraryUserDTO.setPhone( user.getPhone() );

        return libraryUserDTO;
    }

    @Override
    public LibraryUser toEntity(LibraryUserDTO userDTO) {
        if ( userDTO == null ) {
            return null;
        }

        LibraryUser libraryUser = new LibraryUser();

        libraryUser.setCreatedAt( userDTO.getCreatedAt() );
        libraryUser.setEmail( userDTO.getEmail() );
        libraryUser.setFullName( userDTO.getFullName() );
        libraryUser.setId( userDTO.getId() );
        libraryUser.setPhone( userDTO.getPhone() );

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
