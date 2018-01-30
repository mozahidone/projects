package guru.springframework.controllers;

import guru.springframework.converter.DateNoMs;
import guru.springframework.domain.State;
import guru.springframework.services.ProductService;
import guru.springframework.services.StateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Date;

@Controller
public class IndexController {

    private StateService stateService;

    @Autowired
    public void setStateService(StateService stateService) {
        this.stateService = stateService;
    }

    @RequestMapping("/")
    String index(){
        State state = new State();
        state.setAnnotation("New Annotation 1");
        state.setTestDate(new Date());
        state.setPaymentDate(new DateNoMs());
        stateService.save(state);

        State state1 = stateService.getStateById(5);
        System.out.println(state1.getCreatedAt().toString());
        return "index";
    }
}
