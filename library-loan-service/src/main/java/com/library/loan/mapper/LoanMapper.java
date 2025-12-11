package com.library.loan.mapper;

import com.library.loan.dto.LoanDTO;
import com.library.loan.entity.Loan;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface LoanMapper {
    LoanMapper INSTANCE = Mappers.getMapper(LoanMapper.class);

    LoanDTO toDTO(Loan loan);
    Loan toEntity(LoanDTO loanDTO);
    List<LoanDTO> toDTOList(List<Loan> loans);
}


