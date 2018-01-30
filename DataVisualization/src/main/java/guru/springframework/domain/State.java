package guru.springframework.domain;

import guru.springframework.converter.DateNoMs;
import lombok.Data;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.util.Date;

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

    @Type(type="guru.springframework.converter.DateNoMsType")
    @Column(name = "PAYMENT_DATE")
    private DateNoMs paymentDate;

    @Type(type="guru.springframework.converter.UtcDateType")
    @Temporal(TemporalType.TIMESTAMP)
    private Date testDate;
}
