package com.example.hospitalmanagement.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import static org.springframework.security.config.Customizer.withDefaults;

/**
 * 🔐 UI Security (Thymeleaf + H2 console)
 * Applies ONLY to:
 *   - /
 *   - /index
 *   - /css/**
 *   - /js/**
 *   - /images/**
 *   - /webjars/**
 *   - /h2-console/**
 *
 * API security is handled separately in JwtSecurityConfig.
 */
@Configuration
@Order(1)  // 🔥 MUST RUN BEFORE JwtSecurityConfig
public class SecurityConfig {

    @Bean
    public SecurityFilterChain uiSecurityFilterChain(HttpSecurity http) throws Exception {

        http
            // Apply ONLY to UI + H2 console paths
            .securityMatcher(
                    "/",
                    "/index",
                    "/h2-console/**",
                    "/css/**",
                    "/js/**",
                    "/images/**",
                    "/webjars/**"
            )

            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/h2-console/**").permitAll()
                .requestMatchers("/", "/index").permitAll()
                .requestMatchers("/css/**", "/js/**", "/images/**", "/webjars/**").permitAll()

                // anything matched by this chain but not listed → requires auth
                .anyRequest().authenticated()
            )

            // Allow H2 console
            .csrf(csrf -> csrf.ignoringRequestMatchers("/h2-console/**"))
            .headers(headers -> headers.frameOptions(frame -> frame.sameOrigin()))

            // basic UI authentication (you can switch to formLogin)
            .httpBasic(withDefaults());

        return http.build();
    }
}
