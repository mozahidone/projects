package guru.springframework.domain;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Table;

@Data
@Entity
@Table(name="stateChange_tbl")
public class StateChange extends BaseModel {

    //stateChange_tbl(stateId, timeStampValue, viewName, interactionType, filter_1, filter_2)

    //state_tbl(stateId, timeStampValue, viewName, imgSnapshot, parentNode, childNote, annotation)

    //stateChange_tbl(stateId, timeStampValue, viewName, interactionType, filter_1, filter_2)

    private String viewName;
    private String imageSnapshot;
    private int parentNode;
    private int childNote;
    private String annotation;
}
