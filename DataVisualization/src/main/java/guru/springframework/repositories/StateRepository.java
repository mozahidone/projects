package guru.springframework.repositories;

import guru.springframework.domain.Product;
import guru.springframework.domain.State;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface StateRepository extends CrudRepository<State, Integer>{


}
