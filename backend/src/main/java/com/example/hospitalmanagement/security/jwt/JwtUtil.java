package com.example.hospitalmanagement.security.jwt;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.*;
import java.util.stream.Collectors;

@Component
public class JwtUtil {

    // NOTE: In production, keep this secret in env / vault and use a stronger key.
    private final Key key = Keys.hmacShaKeyFor(
        // 64+ char secret. Replace with your own secret in production via env var.
        "replace_with_a_very_long_secret_key_for_production_use_only_!1234567890abcdef".getBytes()
    );

    private final long expirationMs = 1000L * 60 * 60 * 6; // 6 hours

    public String generateToken(String username, Collection<String> roles) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", roles);
        Date now = new Date();
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(username)
                .setIssuedAt(now)
                .setExpiration(new Date(now.getTime() + expirationMs))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (JwtException ex) {
            return false;
        }
    }

    public String getUsername(String token) {
        Claims c = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();
        return c.getSubject();
    }

    @SuppressWarnings("unchecked")
    public List<String> getRoles(String token) {
        Claims c = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();
        Object r = c.get("roles");
        if (r instanceof Collection<?>) {
            return ((Collection<?>) r).stream().map(Object::toString).collect(Collectors.toList());
        }
        return List.of();
    }
}
