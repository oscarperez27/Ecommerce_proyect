package com.utd.ti.soa.ebs_service.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import com.utd.ti.soa.ebs_service.utils.Auth;

import io.jsonwebtoken.Claims;

import com.utd.ti.soa.ebs_service.model.Client;
import com.utd.ti.soa.ebs_service.model.User;

@RestController
@RequestMapping("/api/v1/esb")
public class ESBcontrollerClient {
    private final WebClient webClient = WebClient.create();
    private final Auth auth = new Auth();

    @GetMapping("/client")
    public ResponseEntity<String> recolectUsers(@RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
        System.out.println("Token recibido: " + token);
    
        // Validar token
        if (!auth.validToken(token)) {
            return ResponseEntity.status(401)
                    .body("Token invalido o expirado");
        }
        String response = webClient.get()
                .uri("http://api_client:3003/api/client")
                .retrieve()
                .bodyToMono(String.class)
                .block();

        return ResponseEntity.ok(response);
    }

    @PostMapping("/client")
    public ResponseEntity<?> createClient(@RequestBody Client client,
            @RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
        System.out.println("Request Body: " + client);
        System.out.println("Token recibido: " + token);

        // Validar token
        if (!auth.validToken(token)) {
            return ResponseEntity.status(401)
                    .body("Token invalido o expirado");
        }

        // Enviar solicitud a servicio externo
        String response = webClient.post()
                .uri("http://api_client:3003/api/client")
                .bodyValue(client)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        return ResponseEntity.ok().body(response);
    }

    @DeleteMapping("/client/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable String id, @RequestHeader(HttpHeaders.AUTHORIZATION) String token) {

        System.out.println("Token recibido: " + token);
    
        // Validar token
        if (!auth.validToken(token)) {
            return ResponseEntity.status(401)
                    .body("Token invalido o expirado");
        }
        String response = webClient.delete()
                .uri("http://api_client:3003/api/client/{id}", id)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        return ResponseEntity.ok().body(response);
    }

    @PatchMapping("/client/{id}")
    public ResponseEntity<String> updateClient(@PathVariable String id,
            @RequestBody Client client,
            @RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
        System.out.println("Request Body: " + client);
        System.out.println("Token recibido: " + token);

        // Validar token
        if (!auth.validToken(token)) {
            return ResponseEntity.status(401)
                    .body("Token invalido o expirado");
        }

        System.out.println("Updating user with ID: " + id + " Data: " + client);

        String response = webClient.patch()
                .uri("http://api_client:3003/api/client/{id}", id)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .body(BodyInserters.fromValue(client))
                .retrieve()
                .bodyToMono(String.class)
                .doOnError(e -> System.out.println("Error: " + e.getMessage()))
                .block();

        return ResponseEntity.ok().body(response);
    }
}
