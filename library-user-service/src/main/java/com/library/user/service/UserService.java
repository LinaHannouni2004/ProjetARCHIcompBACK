package com.library.user.service;

import com.library.user.dto.LibraryUserDTO;
import com.library.user.entity.LibraryUser;
import com.library.user.mapper.UserMapper;
import com.library.user.repository.LibraryUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final LibraryUserRepository userRepository;
    private final UserMapper userMapper;

    public LibraryUserDTO createUser(LibraryUserDTO userDTO) {
        if (userRepository.findByEmail(userDTO.getEmail()).isPresent()) {
            throw new RuntimeException("User with email " + userDTO.getEmail() + " already exists");
        }
        LibraryUser user = userMapper.toEntity(userDTO);
        user.setCreatedAt(LocalDateTime.now());
        LibraryUser saved = userRepository.save(user);
        return userMapper.toDTO(saved);
    }

    @Transactional(readOnly = true)
    public LibraryUserDTO getUserById(Long id) {
        LibraryUser user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        return userMapper.toDTO(user);
    }

    @Transactional(readOnly = true)
    public List<LibraryUserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(userMapper::toDTO)
                .collect(Collectors.toList());
    }

    public LibraryUserDTO updateUser(Long id, LibraryUserDTO userDTO) {
        LibraryUser user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        user.setFullName(userDTO.getFullName());
        user.setEmail(userDTO.getEmail());
        user.setPhone(userDTO.getPhone());
        LibraryUser updated = userRepository.save(user);
        return userMapper.toDTO(updated);
    }

    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }
}


