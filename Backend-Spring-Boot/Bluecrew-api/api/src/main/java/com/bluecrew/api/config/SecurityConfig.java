package com.bluecrew.api.config;

import com.bluecrew.api.service.CustomUserDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer; // CORREGIDO
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final CustomUserDetailsService customUserDetailsService;

    public SecurityConfig(CustomUserDetailsService customUserDetailsService) {
        this.customUserDetailsService = customUserDetailsService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                // Permitir el acceso a la carpeta de imágenes estáticas
                .requestMatchers("/uploads/**").permitAll()
                .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/usuarios").permitAll()
                // Proteger rutas de administración (HU-ADM)
                .requestMatchers("/api/admin/**").hasAuthority("ROLE_ADMIN")
                // --- MODO DESARROLLO: ABIERTO ---
                .anyRequest().permitAll() //TODO: ¡CUIDADO! Quitar antes de ir a producción
                

                /* ----------- CÓDIGO ORIGINAL COMENTADO (HABILITAR EN PRODUCCIÓN) ---------------------------------------------
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers("/", "/index.html", "/error", "/api/auth/**", "/swagger-ui/**", "/v3/api-docs/**").permitAll()
                // Permitimos ver la lista de eventos y noticias (solo metodo GET)
                .requestMatchers(HttpMethod.GET, "/api/eventos").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/noticias/**").permitAll()
                // Reglas Protegidas
                .requestMatchers("/api/usuarios/**").hasRole("ADMIN")
                // Cualquier OTRA petición a eventos (como GET /api/eventos/{id} o POST) requerirá token
                .requestMatchers("/api/eventos/**").authenticated()
                .anyRequest().authenticated()
                --------------------------------------------------------------------------------------------*/
            )
            // Cambiamos a STATELESS (sin estado)
            // .sessionManagement(session -> session
            //     .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            // );

            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
            )
            .headers(headers -> headers.frameOptions(frame -> frame.sameOrigin()));

            // Añadimos nuestro filtro JWT antes del filtro de autenticación por defecto
            // .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
            // ----------------------- DESCOMENTAR LO DE ARRIBA EN PRODUCCION ----------------------

        return http.build();
    }

    @Bean
    public DaoAuthenticationProvider authProvider(
            UserDetailsService userDetailsService,
            PasswordEncoder passwordEncoder) {     

        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder);
        return provider;
    }


    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
       
      configuration.setAllowedOriginPatterns(List.of("*"));
        
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Access-Control-Allow-Origin"));
        configuration.setAllowCredentials(true); 
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
}