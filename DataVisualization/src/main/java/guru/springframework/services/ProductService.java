package guru.springframework.services;


import guru.springframework.domain.Product;

import java.util.List;

public interface ProductService {
    Iterable<Product> listAllProducts();

    Product getProductById(Integer id);

    Product saveProduct(Product product);

    List<Product> findByProductId(String productId);
}
