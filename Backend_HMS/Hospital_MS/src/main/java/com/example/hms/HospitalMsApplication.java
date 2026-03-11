package com.example.hms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class HospitalMsApplication {

	public static void main(String[] args) {
		SpringApplication.run(HospitalMsApplication.class, args);
		System.out.println("Running.....");
	}

}
