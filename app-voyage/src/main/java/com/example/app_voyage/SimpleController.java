package com.example.app_voyage; // Le même package que AppVoyageApplication

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SimpleController {

    @GetMapping("/simple")
    public String simpleTest() {
        return "Simple API is working!";
    }
}
