package com.example.hospitalmanagement.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import static org.springframework.security.config.Customizer.withDefaults; // Required for formLogin/httpBasic

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                // CRITICAL 1: Allow all requests to the H2 Console path
                .requestMatchers(AntPathRequestMatcher.antMatcher("/h2-console/**")).permitAll()
                
                // Allow API path requests
                .requestMatchers(AntPathRequestMatcher.antMatcher("/api/**")).permitAll()
                
                // All other requests must be authenticated
                .anyRequest().authenticated()
            )
            .csrf(csrf -> csrf
                // CRITICAL 2: Disable CSRF protection for the H2 Console path
                // Spring Security 6+ requires using a RequestMatcher to ignore.
                .ignoringRequestMatchers(AntPathRequestMatcher.antMatcher("/h2-console/**"))
            )
            .headers(headers -> headers
                // CRITICAL 3: Allow H2 Console to load in a frame
                .frameOptions(frameOptions -> frameOptions.sameOrigin())
            )
            .httpBasic(withDefaults()); // Use withDefaults() for concise configuration

        return http.build();
    }
}