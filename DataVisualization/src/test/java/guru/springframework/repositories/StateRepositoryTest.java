package guru.springframework.repositories;

import guru.springframework.configuration.RepositoryConfiguration;
import guru.springframework.domain.Product;
import guru.springframework.domain.State;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.math.BigDecimal;

import static org.junit.Assert.*;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = {RepositoryConfiguration.class})
public class StateRepositoryTest {

    private StateRepository stateRepository;

    @Autowired
    public void setProductRepository(StateRepository stateRepository) {
        this.stateRepository = stateRepository;
    }

    @Test
    public void testSaveProduct(){
        State state = new State();
        state.setAnnotation("New Annotation 1");

        stateRepository.save(state);
        assertNotNull(state.getId()); //not null after save


    }
}
