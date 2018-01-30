package guru.springframework.services;


import guru.springframework.domain.State;

public interface StateService {
    State save(State state);

    State getStateById(Integer id);
}
