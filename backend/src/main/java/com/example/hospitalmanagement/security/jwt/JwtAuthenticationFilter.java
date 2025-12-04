package com.example.hospitalmanagement.security.jwt;

import com.example.hospitalmanagement.service.UserDetailsServiceImpl;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserDetailsServiceImpl userDetailsService;

    public JwtAuthenticationFilter(JwtUtil jwtUtil, UserDetailsServiceImpl userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        // ---------------------------------------------------------
        // 🚀 BYPASS JWT FILTER COMPLETELY FOR PHARMACY API ROUTES
        // ---------------------------------------------------------
        if (path.startsWith("/api/pharmacy")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Bypass login/public endpoints
        if (path.startsWith("/api/auth") || path.startsWith("/api/public") || path.startsWith("/actuator")) {
            filterChain.doFilter(request, response);
            return;
        }

        // ---------------------------------------------------------
        // 🔐 JWT VALIDATION FOR PROTECTED ROUTES
        // ---------------------------------------------------------
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        String token = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
        }

        if (token != null &&
                jwtUtil.validateToken(token) &&
                SecurityContextHolder.getContext().getAuthentication() == null) {

            String username = jwtUtil.getUsername(token);
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            UsernamePasswordAuthenticationToken auth =
                    new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());

            SecurityContextHolder.getContext().setAuthentication(auth);
        }

        filterChain.doFilter(request, response);
    }
}
