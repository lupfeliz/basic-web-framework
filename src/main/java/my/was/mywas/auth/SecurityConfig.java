package my.was.mywas.auth;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.header.writers.CrossOriginEmbedderPolicyHeaderWriter.CrossOriginEmbedderPolicy;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import static org.springframework.http.HttpMethod.DELETE;
import static org.springframework.http.HttpMethod.GET;
import static org.springframework.http.HttpMethod.POST;
import static org.springframework.http.HttpMethod.PUT;

@Configuration @EnableWebSecurity
@SuppressWarnings({ "static-access" })
public class SecurityConfig {
  @Bean SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    AntPathRequestMatcher m = new AntPathRequestMatcher("/**");
    http
      .csrf((csrf) -> 
        csrf.ignoringRequestMatchers(
          m.antMatcher(GET, "/api/**"),
          m.antMatcher(POST, "/api/**"),
          m.antMatcher(PUT, "/api/**"),
          m.antMatcher(DELETE, "/api/**")
        )
      )
      .cors((cors) -> 
        cors.disable()
      )
      .headers((hdr) -> 
        hdr.frameOptions((frm) -> 
          frm.sameOrigin()
        )
        .crossOriginEmbedderPolicy((pol) ->
          pol.policy(CrossOriginEmbedderPolicy.UNSAFE_NONE)
        )
        .contentSecurityPolicy((pol) ->
          pol.reportOnly()
        )
        .cacheControl((cache) -> 
          cache.disable()
        )
      )
      .authorizeHttpRequests((req) -> 
        req.requestMatchers(
          m.antMatcher(GET, "/api/**"),
          m.antMatcher(POST, "/api/**"),
          m.antMatcher(PUT, "/api/user/**")
          ).permitAll()
        .requestMatchers(
          m.antMatcher(PUT, "/api/board/**"),
          m.antMatcher(DELETE, "/api/board/**")
          ).authenticated()
        .anyRequest()
        .authenticated()
      )
      ;
    return http.build();
  }
}