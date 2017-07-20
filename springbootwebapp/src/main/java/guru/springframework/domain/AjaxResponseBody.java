package guru.springframework.domain;

import java.util.List;

public class AjaxResponseBody {

    String msg;
    List<Product> result;

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public List<Product> getResult() {
        return result;
    }

    public void setResult(List<Product> result) {
        this.result = result;
    }
}
