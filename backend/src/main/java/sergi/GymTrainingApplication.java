package sergi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {"sergi", "sergi.controller"})
public class GymTrainingApplication {
    public static void main(String[] args) {
        SpringApplication.run(GymTrainingApplication.class, args);
    }
}