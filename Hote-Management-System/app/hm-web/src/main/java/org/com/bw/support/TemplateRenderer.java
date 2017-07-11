package org.com.bw.support;

import org.thymeleaf.context.*;
import org.thymeleaf.spring4.SpringTemplateEngine;

/**
 * User : Kamal Hossain
 * Date : 8/16/16.
 */
public class TemplateRenderer {
    private static TemplateRenderer renderer;

    private SpringTemplateEngine templateEngine;

    public static TemplateRenderer getInstance() {
        if (renderer == null) {
            renderer = new TemplateRenderer();
        }
        return renderer;
    }

    public void setTemplateEngine(SpringTemplateEngine templateEngine) {
        this.templateEngine = templateEngine;
    }

    public String render(String template, Context context) {
        return templateEngine.process(template, context);
    }
}
