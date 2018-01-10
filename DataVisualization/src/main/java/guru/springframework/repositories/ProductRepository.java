package guru.springframework.repositories;

import guru.springframework.domain.Product;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface ProductRepository extends CrudRepository<Product, Integer>{

    List<Product> findByProductId(String productId);

}
