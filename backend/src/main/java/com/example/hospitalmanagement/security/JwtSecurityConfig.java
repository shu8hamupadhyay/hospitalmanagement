package com.example.hospitalmanagement.security;

import com.example.hospitalmanagement.security.jwt.JwtAuthenticationFilter;
import com.example.hospitalmanagement.service.UserDetailsServiceImpl;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

import java.util.List;

/**
 * ✅ Secures API endpoints under /api/**
 * ✅ Handles JWT authentication (no conflict with Thymeleaf or H2)
 * ✅ Compatible with Spring Boot 3.5.x & Spring Security 6.x
 */
@Configuration
@EnableMethodSecurity
public class JwtSecurityConfig {

    private final UserDetailsServiceImpl userDetailsService;
    private final JwtAuthenticationFilter jwtFilter;

    public JwtSecurityConfig(UserDetailsServiceImpl userDetailsService, JwtAuthenticationFilter jwtFilter) {
        this.userDetailsService = userDetailsService;
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain apiSecurityFilterChain(HttpSecurity http) throws Exception {
        http
            // ✅ Apply this config only to /api/** paths
            .securityMatcher("/api/**")

            // ✅ Configure CORS to allow React frontend (Vite default: 5173)
            .cors(cors -> cors.configurationSource(request -> {
                CorsConfiguration cfg = new CorsConfiguration();
                cfg.setAllowedOrigins(List.of(
                        "http://localhost:5173",  // React Vite Dev
                        "http://localhost:3000"   // (optional) if using CRA
                ));
                cfg.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                cfg.setAllowedHeaders(List.of("*"));
                cfg.setAllowCredentials(true);
                return cfg;
            }))

            // ✅ Disable CSRF for stateless JWT API
            .csrf(csrf -> csrf.disable())

            // ✅ Set up endpoint authorization
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**", "/actuator/**").permitAll()  // public auth routes
                .requestMatchers(HttpMethod.GET, "/api/public/**").permitAll() // optional public GETs
                .anyRequest().authenticated()                                 // secure all others
            )

            // ✅ Add JWT filter before Spring’s UsernamePasswordAuthenticationFilter
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)

            // ✅ Allow basic auth fallback (useful for debugging)
            .httpBasic(Customizer.withDefaults());

        return http.build();
    }

    // ✅ Authentication Manager Bean (for login)
    @Bean
    public AuthenticationManager authenticationManager() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return new ProviderManager(provider);
    }

    // ✅ Use BCrypt for password hashing (matches your seed data)
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
