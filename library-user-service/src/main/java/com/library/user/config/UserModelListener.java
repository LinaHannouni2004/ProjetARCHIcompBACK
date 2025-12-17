package com.library.user.config;

import org.springframework.data.mongodb.core.mapping.event.AbstractMongoEventListener;
import org.springframework.data.mongodb.core.mapping.event.BeforeConvertEvent;
import org.springframework.stereotype.Component;
import com.library.user.entity.LibraryUser;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.data.mongodb.core.FindAndModifyOptions;

import static org.springframework.data.mongodb.core.query.Criteria.where;
import static org.springframework.data.mongodb.core.query.Query.query;

@Component
public class UserModelListener extends AbstractMongoEventListener<LibraryUser> {

    private final MongoOperations mongoOperations;

    public UserModelListener(MongoOperations mongoOperations) {
        this.mongoOperations = mongoOperations;
    }

    @Override
    public void onBeforeConvert(BeforeConvertEvent<LibraryUser> event) {
        if (event.getSource().getId() == null) {
            event.getSource().setId(getNextSequence("user_sequence"));
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
