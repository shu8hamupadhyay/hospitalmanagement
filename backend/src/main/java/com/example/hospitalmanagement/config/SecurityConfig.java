package com.example.hospitalmanagement.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import static org.springframework.security.config.Customizer.withDefaults;

/**
 * ✅ Handles security for H2 console & Thymeleaf UI only.
 * ✅ Keeps API (/api/**) security isolated in JwtSecurityConfig.
 * ✅ Compatible with Spring Boot 3.5.x & Security 6.x.
 */
@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain uiSecurityFilterChain(HttpSecurity http) throws Exception {

        http
            // ✅ Apply only to web UI and H2 console paths
            .securityMatcher("/h2-console/**", "/", "/index", "/css/**", "/js/**", "/images/**", "/webjars/**")

            .authorizeHttpRequests(auth -> auth
                // Allow unrestricted access to H2 console
                .requestMatchers(new AntPathRequestMatcher("/h2-console/**")).permitAll()

                // Allow static resources and root paths
                .requestMatchers(
                        new AntPathRequestMatcher("/"),
                        new AntPathRequestMatcher("/index"),
                        new AntPathRequestMatcher("/css/**"),
                        new AntPathRequestMatcher("/js/**"),
                        new AntPathRequestMatcher("/images/**"),
                        new AntPathRequestMatcher("/webjars/**")
                ).permitAll()

                // Everything else in this matcher requires authentication
                .anyRequest().authenticated()
            )

            // ✅ Disable CSRF for H2 console
            .csrf(csrf -> csrf.ignoringRequestMatchers(new AntPathRequestMatcher("/h2-console/**")))

            // ✅ Allow frames from the same origin (needed by H2 console)
            .headers(headers -> headers.frameOptions(frame -> frame.sameOrigin()))

            // ✅ Basic auth for simplicity (you can replace with formLogin if needed)
            .httpBasic(withDefaults());

        return http.build();
    }
}
