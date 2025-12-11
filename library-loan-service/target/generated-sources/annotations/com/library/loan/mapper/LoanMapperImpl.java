package com.library.loan.mapper;

import com.library.loan.dto.LoanDTO;
import com.library.loan.entity.Loan;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-12-04T22:16:43+0100",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.8 (Eclipse Adoptium)"
)
@Component
public class LoanMapperImpl implements LoanMapper {

    @Override
    public LoanDTO toDTO(Loan loan) {
        if ( loan == null ) {
            return null;
        }

        LoanDTO loanDTO = new LoanDTO();

        loanDTO.setId( loan.getId() );
        loanDTO.setUserId( loan.getUserId() );
        loanDTO.setBookId( loan.getBookId() );
        loanDTO.setBorrowDate( loan.getBorrowDate() );
        loanDTO.setDueDate( loan.getDueDate() );
        loanDTO.setReturnDate( loan.getReturnDate() );
        loanDTO.setStatus( loan.getStatus() );

        return loanDTO;
    }

    @Override
    public Loan toEntity(LoanDTO loanDTO) {
        if ( loanDTO == null ) {
            return null;
        }

        Loan loan = new Loan();

        loan.setId( loanDTO.getId() );
        loan.setUserId( loanDTO.getUserId() );
        loan.setBookId( loanDTO.getBookId() );
        loan.setBorrowDate( loanDTO.getBorrowDate() );
        loan.setDueDate( loanDTO.getDueDate() );
        loan.setReturnDate( loanDTO.getReturnDate() );
        loan.setStatus( loanDTO.getStatus() );

        return loan;
    }

    @Override
    public List<LoanDTO> toDTOList(List<Loan> loans) {
        if ( loans == null ) {
            return null;
        }

        List<LoanDTO> list = new ArrayList<LoanDTO>( loans.size() );
        for ( Loan loan : loans ) {
            list.add( toDTO( loan ) );
        }

        return list;
    }
}
