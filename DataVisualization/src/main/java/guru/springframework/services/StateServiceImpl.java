package guru.springframework.services;

import guru.springframework.domain.State;
import guru.springframework.repositories.StateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StateServiceImpl implements StateService {
    private StateRepository stateRepository;

    @Autowired
    public void setStateRepository(StateRepository stateRepository) {
        this.stateRepository = stateRepository;
    }


    @Override
    public State save(State state) {

        return stateRepository.save(state);
    }

    @Override
    public State getStateById(Integer id) {
        return stateRepository.findOne(id);
    }
}
