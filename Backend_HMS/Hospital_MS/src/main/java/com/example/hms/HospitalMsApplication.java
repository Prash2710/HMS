package com.example.hms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
public class HospitalMsApplication {

	public static void main(String[] args) {
		SpringApplication.run(HospitalMsApplication.class, args);
		System.out.println("Running.....");
	}

}
