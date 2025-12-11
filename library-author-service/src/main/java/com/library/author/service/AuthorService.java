package com.library.author.service;

import com.library.author.dto.AuthorDTO;
import com.library.author.entity.Author;
import com.library.author.mapper.AuthorMapper;
import com.library.author.repository.AuthorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthorService {

    private final AuthorRepository authorRepository;
    private final AuthorMapper authorMapper;

    public AuthorDTO createAuthor(AuthorDTO authorDTO) {
        Author author = authorMapper.toEntity(authorDTO);
        Author saved = authorRepository.save(author);
        return authorMapper.toDTO(saved);
    }

    @Transactional(readOnly = true)
    public AuthorDTO getAuthorById(Long id) {
        Author author = authorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Author not found with id: " + id));
        return authorMapper.toDTO(author);
    }

    @Transactional(readOnly = true)
    public List<AuthorDTO> getAllAuthors() {
        return authorRepository.findAll().stream()
                .map(authorMapper::toDTO)
                .collect(Collectors.toList());
    }

    public AuthorDTO updateAuthor(Long id, AuthorDTO authorDTO) {
        Author author = authorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Author not found with id: " + id));
        author.setFirstName(authorDTO.getFirstName());
        author.setLastName(authorDTO.getLastName());
        author.setBio(authorDTO.getBio());
        author.setBirthDate(authorDTO.getBirthDate());
        Author updated = authorRepository.save(author);
        return authorMapper.toDTO(updated);
    }

    public void deleteAuthor(Long id) {
        if (!authorRepository.existsById(id)) {
            throw new RuntimeException("Author not found with id: " + id);
        }
        authorRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<AuthorDTO> searchAuthorsByName(String name) {
        return authorRepository.searchByName(name).stream()
                .map(authorMapper::toDTO)
                .collect(Collectors.toList());
    }
}


