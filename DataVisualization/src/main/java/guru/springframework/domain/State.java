package guru.springframework.domain;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Table;

@Data
@Entity
@Table(name="state_tbl")
public class State extends BaseModel {

    //state_tbl(stateId, timeStampValue, viewName, imgSnapshot, parentNode, childNote, annotation)

    private String viewName;
    private String imageSnapshot;
    private int parentNode;
    private int childNote;
    private String annotation;
}
