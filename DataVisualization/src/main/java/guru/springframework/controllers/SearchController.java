package guru.springframework.controllers;

import guru.springframework.domain.AjaxResponseBody;
import guru.springframework.domain.Product;
import guru.springframework.domain.SearchCriteria;

import guru.springframework.services.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import javax.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@RestController
public class SearchController {

    private ProductService productService;

    @Autowired
    public void setProductService(ProductService productService) {
        this.productService = productService;
    }

    @RequestMapping(path="/employees", method= RequestMethod.GET)
    public List<Product> getAllProducts(){
        List<Product> products = productService.findByProductId("235268845711068308");
        return products;
    }

    @RequestMapping(value = "/product/add", method = RequestMethod.POST)
    public Product saveProduct(@RequestBody Product product, UriComponentsBuilder ucBuilder){

        productService.saveProduct(product);

        return product;

        //HttpHeaders headers = new HttpHeaders();
        //headers.setLocation(ucBuilder.path("/product/{id}").buildAndExpand(product.getId()).toUri());
        //return new ResponseEntity<String>(headers, HttpStatus.CREATED);


    }

    @RequestMapping(value = "/test/{id}", method = RequestMethod.GET)
    public ResponseEntity<List<Product>> listAllUsers(@PathVariable("id") String id) {
        List<Product> products = productService.findByProductId(id);
        if (products.isEmpty()) {
            return new ResponseEntity(HttpStatus.NO_CONTENT);
            // You many decide to return HttpStatus.NOT_FOUND
        }
        return new ResponseEntity<List<Product>>(products, HttpStatus.OK);
    }

    @PostMapping("/api/search")
    public ResponseEntity<?> getSearchResultViaAjax(
            @Valid @RequestBody SearchCriteria search, Errors errors) {

        AjaxResponseBody result = new AjaxResponseBody();

        //If error, just return a 400 bad request, along with the error message
        if (errors.hasErrors()) {

            result.setMsg(errors.getAllErrors()
                    .stream().map(x -> x.getDefaultMessage())
                    .collect(Collectors.joining(",")));

            return ResponseEntity.badRequest().body(result);

        }

        List<Product> products = productService.findByProductId(search.getUsername());
        if (products.isEmpty()) {
            result.setMsg("no product found!");
        } else {
            result.setMsg("success");
        }
        result.setResult(products);

        return ResponseEntity.ok(result);

    }

}