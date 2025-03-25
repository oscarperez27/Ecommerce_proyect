package com.utd.ti.soa.ebs_service.utils;

import java.nio.charset.StandardCharsets;
import javax.crypto.SecretKey;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

public class Auth {
    public final String SECRET_KEY = "aJksd9QzPl+sVdK7vYc/L4dK8HgQmPpQ5K9yApUsj3w";

    public boolean validToken(String token) {
        try {
            SecretKey key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8)); // Faltaba el punto y coma

            Claims claims = Jwts.parserBuilder() // Corregir "Claisms" a "Claims"
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token.replace("Bearer ", "")) // Corregir parseClaimJws a parseClaimsJws
                .getBody();

            System.out.println("Token valido, usuario: " + claims.getSubject());
            return true;
        } catch (Exception e) {
            System.out.println("Error al validar el token: " + e.getMessage());
            return false;
        }
    }
}

