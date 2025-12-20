package com.library.gateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
public class GatewayConfig {

        @Bean
        public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
                return builder.routes()
                                .route("auth-service", r -> r.path("/api/auth/**")
                                                .uri("lb://library-user-service"))
                                .route("book-service", r -> r.path("/api/books/**")
                                                .uri("lb://library-book-service"))
                                .route("author-service", r -> r.path("/api/authors/**")
                                                .uri("lb://library-author-service"))
                                .route("user-service", r -> r.path("/api/users/**")
                                                .uri("lb://library-user-service"))
                                .route("loan-service", r -> r.path("/api/loans/**")
                                                .uri("lb://library-loan-service"))
                                .route("recommendation-service", r -> r.path("/api/recommendations/**")
                                                .uri("lb://recommendation-service"))
                                .route("client-service", r -> r.path("/api/client/**")
                                                .uri("lb://library-client-service"))
                                .build();
        }

        @Bean
        public CorsWebFilter corsWebFilter() {
                CorsConfiguration corsConfig = new CorsConfiguration();
                corsConfig.setAllowedOrigins(Arrays.asList("http://localhost:5173", "http://localhost:5174",
                                "http://localhost:5175", "http://localhost:3000"));
                corsConfig.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
                corsConfig.setAllowedHeaders(List.of("*"));
                corsConfig.setAllowCredentials(true);
                corsConfig.setMaxAge(3600L);

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", corsConfig);

                return new CorsWebFilter(source);
        }
}
