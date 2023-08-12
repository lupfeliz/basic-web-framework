package my.was.mywas.auth;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.core.session.SessionRegistryImpl;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.header.writers.CrossOriginEmbedderPolicyHeaderWriter.CrossOriginEmbedderPolicy;
import org.springframework.security.web.header.writers.CrossOriginOpenerPolicyHeaderWriter.CrossOriginOpenerPolicy;
import org.springframework.security.web.header.writers.CrossOriginResourcePolicyHeaderWriter.CrossOriginResourcePolicy;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;

import jakarta.servlet.Filter;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import my.was.mywas.user.UserService;

import static org.springframework.http.HttpMethod.DELETE;
import static org.springframework.http.HttpMethod.GET;
import static org.springframework.http.HttpMethod.POST;
import static org.springframework.http.HttpMethod.PUT;

import java.io.IOException;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Configuration @EnableWebSecurity
@SuppressWarnings({ "static-access" })
public class SecurityConfig {

  private static final String LOGIN_PATH = "/api/user/login";
  private static final String PRM_USER_ID = "userId";
  private static final String PRM_PASSWORD = "password";
  private static final String GRANT_USER = "USER";

  @Bean SessionRegistry sessionRegistry() {
    return new SessionRegistryImpl();
  }

  @Bean AuthenticationProvider authenticationProvider() {
    return new MyWasAuthProvider();
  }

  @Bean AuthenticationSuccessHandler loginSuccess() {
    return new MyWasLoginSuccess();
  }

  @Bean AuthenticationFailureHandler loginFail() {
    return new MyWasLoginFail();
  }

  @Bean
  AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
    AuthenticationManager manager = config.getAuthenticationManager();
    log.debug("AUTH-MANAGER:{} / {}", config, manager);
    return manager;
  }

  // @Bean AbstractAuthenticationProcessingFilter authFilter(HttpSecurity http) {
  //   return new MyWasAuthFilter(new AntPathRequestMatcher(LOGIN_PATH, POST.name()));
  // }
  @Bean SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    AntPathRequestMatcher m = new AntPathRequestMatcher("/**");

    AbstractAuthenticationProcessingFilter jsonFilter = 
      new MyWasAuthFilter(m.antMatcher(POST, LOGIN_PATH), http);
      jsonFilter.setAuthenticationSuccessHandler(loginSuccess());
      jsonFilter.setAuthenticationFailureHandler(loginFail());

    http
      .csrf(csrf -> csrf
        // .ignoringRequestMatchers(
        //   m.antMatcher(GET, "/api/**"),
        //   m.antMatcher(POST, "/api/**"),
        //   m.antMatcher(PUT, "/api/**"),
        //   m.antMatcher(DELETE, "/api/**")
        // )
        .disable()
      )
      .cors(cors -> cors.disable())
      .headers(hdr -> hdr
        // .frameOptions(frm -> frm.sameOrigin())
        // .crossOriginEmbedderPolicy(pol -> pol.policy(CrossOriginEmbedderPolicy.UNSAFE_NONE))
        // .crossOriginOpenerPolicy(pol -> pol.policy(CrossOriginOpenerPolicy.SAME_ORIGIN))
        // .crossOriginResourcePolicy(pol -> pol.policy(CrossOriginResourcePolicy.SAME_SITE))
        // .contentSecurityPolicy(pol -> pol.reportOnly())
        .cacheControl(ccc -> ccc.disable())
      )
      .authorizeHttpRequests(req -> req
        .requestMatchers(
          m.antMatcher(GET, "/api/**"),
          m.antMatcher(POST, "/api/**"),
          // m.antMatcher(PUT, "/api/board/**"),
          m.antMatcher(PUT, "/api/user/**"),
          m.antMatcher(GET, "/api/test/**"),
          m.antMatcher(POST, "/api/test/**")
          // m.antMatcher("/**")
          ).permitAll()
        .requestMatchers(
          // m.antMatcher(GET, "/api/**"),
          // m.antMatcher(POST, "/api/**"),
          // m.antMatcher(PUT, "/api/**"),
          // m.antMatcher(DELETE, "/api/**"),
          m.antMatcher(GET, "/api/test2/**"),
          m.antMatcher(POST, "/api/test2/**"),
          m.antMatcher(PUT, "/api/board/**"),
          m.antMatcher(DELETE, "/api/board/**")
          )//.hasAnyRole(GRANT_USER)
          .hasAnyAuthority(GRANT_USER)
        .anyRequest()
          .authenticated()
      )
      .addFilterAt(jsonFilter, UsernamePasswordAuthenticationFilter.class)
      // .formLogin(Customizer.withDefaults())
      .formLogin(login -> login
        // .usernameParameter(PRM_USER_ID)
        // .passwordParameter(PRM_PASSWORD)
        // .loginPage("/api/user/new")
        // .loginProcessingUrl(LOGIN_PATH)
        // .successForwardUrl("/api/user/check/111")
        // .successHandler(loginSuccess())
        // .failureHandler(loginFail())
        // .defaultSuccessUrl("/test", true)
        // .permitAll(true)
        .disable()
      )
      .logout(Customizer.withDefaults())
      .logout(logout -> logout
        .logoutUrl("/api/user/logout")
        .permitAll(true)
        // .disable()
      )
      .sessionManagement(smn -> smn
        .sessionFixation(sfix -> sfix.changeSessionId())
        // .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        .maximumSessions(1)
        .maxSessionsPreventsLogin(false)
        // .expiredUrl("/api/user/expire")
        .sessionRegistry(sessionRegistry())
      )
      .anonymous(anon -> anon.disable());
    return http.build();
  }

  static class MyWasAuthFilter extends AbstractAuthenticationProcessingFilter {
    private HttpSecurity http;
    public MyWasAuthFilter(RequestMatcher matcher, HttpSecurity http) {
      super(matcher);
      this.http = http;
      // this.setAuthenticationSuccessHandler(new MyWasLoginSuccess());
      // this.setAuthenticationFailureHandler(new MyWasLoginFail());
    }
    @Override
    public Authentication attemptAuthentication(HttpServletRequest req, HttpServletResponse res)
      throws AuthenticationException, IOException, ServletException {
      this.setAuthenticationManager(http.getSharedObject(AuthenticationManager.class));

      String body = req.getReader().lines().collect(Collectors.joining());
      JSONObject map = new JSONObject(body);
      log.debug("BODY:{}", map);
      log.debug("AUTHMAN:{}", this.getAuthenticationManager());
      UsernamePasswordAuthenticationToken token =
        new UsernamePasswordAuthenticationToken(
          map.optString(PRM_USER_ID, ""),
          map.optString(PRM_PASSWORD, "")
        );
      // req.setAttribute(UsernamePasswordAuthenticationToken.class.getName(), token);
      // req.setAttribute(AuthenticationManager.class.getName(), authman);
      this.authenticationDetailsSource.buildDetails(req);
      // Authentication auth = authman.authenticate(token);
      Authentication auth = this.getAuthenticationManager().authenticate(token);
      // SecurityContextHolder.getContext().setAuthentication(auth);
      return auth;
    }
  }
  static class MyWasLoginSuccess implements AuthenticationSuccessHandler {

    // @Autowired
    // AuthenticationManager authman;
    @Override public void onAuthenticationSuccess(
      HttpServletRequest req, HttpServletResponse res, Authentication auth)
       throws IOException, ServletException {
      HttpSession session = req.getSession();
      Authentication a = SecurityContextHolder.getContext().getAuthentication();
      log.debug("SESSION-ID:{} / {} / {}", session.getId(), req.getAttribute(AuthenticationManager.class.getName()), a.equals(auth));
      // log.debug("SESSION-ID:{} / {} / {}", session.getId(), authman, a.equals(auth));
      Iterator<String> iter = session.getAttributeNames().asIterator();
      while (iter.hasNext()) {
        log.debug("SESSION-KEY:{}", iter.next());
      }

      SecurityContext context = SecurityContextHolder.getContext();
      session.setAttribute(
        HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, context);
      log.debug("LOGIN-SUCCESS!!! / {}", auth);
      res.getWriter().append("{}").flush();
    }
  }
  static class MyWasLoginFail implements AuthenticationFailureHandler {
    @Override public void onAuthenticationFailure(
      HttpServletRequest req, HttpServletResponse res, AuthenticationException e)
        throws IOException, ServletException {
      log.debug("LOGIN-FAIL!!! / {}", e);
      res.getWriter().append("{}").flush();
    }
  }

  static class MyWasAuthProvider implements AuthenticationProvider {
    @Autowired private UserService userService;
    @Override
    public Authentication authenticate(Authentication auth) throws AuthenticationException {
      String userId = auth.getName();
      String password = auth.getPrincipal().toString();
      log.debug("LOGIN: [ {} / {} ]", userId, password);

      my.was.mywas.user.User user = userService.getByUserId(userId);
      log.debug("USER: [ {} ]", user);
      if ("test".equals(userId)) { throw new BadCredentialsException("NOT"); }
      List<GrantedAuthority> grant = new LinkedList<>();
      grant.add(new SimpleGrantedAuthority(GRANT_USER));
      Authentication ret = new UsernamePasswordAuthenticationToken(userId, password, grant);
      // SecurityContextHolder.getContext().setAuthentication(ret);
      return ret;
    }

    @Override public boolean supports(Class<?> auth) { return true; }
  }
}