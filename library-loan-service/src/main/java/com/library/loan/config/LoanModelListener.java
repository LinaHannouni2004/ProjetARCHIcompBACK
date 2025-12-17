package com.library.loan.config;

import org.springframework.data.mongodb.core.mapping.event.AbstractMongoEventListener;
import org.springframework.data.mongodb.core.mapping.event.BeforeConvertEvent;
import org.springframework.stereotype.Component;
import com.library.loan.entity.Loan;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.data.mongodb.core.FindAndModifyOptions;

import static org.springframework.data.mongodb.core.query.Criteria.where;
import static org.springframework.data.mongodb.core.query.Query.query;

@Component
public class LoanModelListener extends AbstractMongoEventListener<Loan> {

    private final MongoOperations mongoOperations;

    public LoanModelListener(MongoOperations mongoOperations) {
        this.mongoOperations = mongoOperations;
    }

    @Override
    public void onBeforeConvert(BeforeConvertEvent<Loan> event) {
        if (event.getSource().getId() == null) {
            event.getSource().setId(getNextSequence("loan_sequence"));
        }
    }

    private Long getNextSequence(String seqName) {
        var counter = mongoOperations.findAndModify(
                query(where("_id").is(seqName)),
                new Update().inc("seq", 1),
                FindAndModifyOptions.options().returnNew(true).upsert(true),
                SequenceCounter.class);
        return counter != null ? counter.getSeq() : 1L;
    }

    private static class SequenceCounter {
        private String id;
        private Long seq;

        public Long getSeq() {
            return seq;
        }

        public void setSeq(Long seq) {
            this.seq = seq;
        }
    }
}
