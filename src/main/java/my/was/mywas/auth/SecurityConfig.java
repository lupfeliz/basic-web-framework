package my.was.mywas.auth;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.core.session.SessionRegistryImpl;
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

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import my.was.mywas.user.User;
import my.was.mywas.user.UserService;

import static org.springframework.http.HttpMethod.DELETE;
import static org.springframework.http.HttpMethod.GET;
import static org.springframework.http.HttpMethod.POST;
import static org.springframework.http.HttpMethod.PUT;

import java.io.IOException;
import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Configuration @EnableWebSecurity
@SuppressWarnings({ "static-access" })
public class SecurityConfig {

  private static final String LOGIN_PATH = "/api/user/login";
  private static final String PRM_USER_ID = "userId";
  private static final String PRM_PASSWD = "passwd";
  private static final String GRANT_USER = "USER";

  @Bean SessionRegistry sessionRegistry() { return new SessionRegistryImpl(); }
  @Bean AuthenticationProvider authenticationProvider() { return new MyWasAuthProvider(); }
  @Bean AuthenticationSuccessHandler loginSuccess() { return new MyWasLoginSuccess(); }
  @Bean AuthenticationFailureHandler loginFail() { return new MyWasLoginFail(); }

  @Bean
  AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
    AuthenticationManager manager = config.getAuthenticationManager();
    return manager;
  }

  @Bean SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    AntPathRequestMatcher m = new AntPathRequestMatcher("/**");
    AbstractAuthenticationProcessingFilter jsonFilter = 
      new MyWasAuthFilter(m.antMatcher(POST, LOGIN_PATH), http);
      jsonFilter.setAuthenticationSuccessHandler(loginSuccess());
      jsonFilter.setAuthenticationFailureHandler(loginFail());

    http
      .csrf(csrf -> csrf
        .ignoringRequestMatchers(
          m.antMatcher(GET, "/api/**"),
          m.antMatcher(POST, "/api/**"),
          m.antMatcher(PUT, "/api/**"),
          m.antMatcher(DELETE, "/api/**")
        ).disable()
      )
      .cors(cors -> cors.disable())
      .headers(hdr -> hdr
        .frameOptions(frm -> frm.sameOrigin())
        .crossOriginEmbedderPolicy(pol -> pol.policy(CrossOriginEmbedderPolicy.UNSAFE_NONE))
        .crossOriginOpenerPolicy(pol -> pol.policy(CrossOriginOpenerPolicy.SAME_ORIGIN))
        .crossOriginResourcePolicy(pol -> pol.policy(CrossOriginResourcePolicy.SAME_SITE))
        .contentSecurityPolicy(pol -> pol.reportOnly())
        .cacheControl(ccc -> ccc.disable())
      )
      .authorizeHttpRequests(req -> req
        .requestMatchers(
          m.antMatcher(GET, "/api/**"),
          m.antMatcher(POST, "/api/**"),
          m.antMatcher(PUT, "/api/user/**")
          ).permitAll()
        .requestMatchers(
          m.antMatcher(PUT, "/api/board/**"),
          m.antMatcher(DELETE, "/api/board/**")
          ).hasAnyAuthority(GRANT_USER)
        .anyRequest()
          .authenticated()
      )
      .addFilterAt(jsonFilter, UsernamePasswordAuthenticationFilter.class)
      .formLogin(login -> login.disable())
      .logout(logout -> logout.disable())
      .sessionManagement(smn -> smn
        .sessionFixation(sfix -> sfix.changeSessionId())
        .maximumSessions(1)
        .maxSessionsPreventsLogin(false)
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
    }
    @Override
    public Authentication attemptAuthentication(HttpServletRequest req, HttpServletResponse res)
      throws AuthenticationException, IOException, ServletException {
      setAuthenticationManager(http.getSharedObject(AuthenticationManager.class));
      String body = req.getReader().lines().collect(Collectors.joining());
      log.debug("BODY:{}", body);
      JSONObject map = new JSONObject(body);
      UsernamePasswordAuthenticationToken token =
        new UsernamePasswordAuthenticationToken(
          map.optString(PRM_USER_ID, ""),
          map.optString(PRM_PASSWD, "")
        );
      authenticationDetailsSource.buildDetails(req);
      Authentication auth = getAuthenticationManager().authenticate(token);
      return auth;
    }
  }
  static class MyWasLoginSuccess implements AuthenticationSuccessHandler {
    @Override public void onAuthenticationSuccess(
      HttpServletRequest req, HttpServletResponse res, Authentication auth)
       throws IOException, ServletException {
      HttpSession session = req.getSession();
      SecurityContext ctx = SecurityContextHolder.getContext();
      session.setAttribute(
        HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, ctx);
      res.getWriter().append("{}").flush();
    }
  }
  static class MyWasLoginFail implements AuthenticationFailureHandler {
    @Override public void onAuthenticationFailure(
      HttpServletRequest req, HttpServletResponse res, AuthenticationException e)
        throws IOException, ServletException {
      res.getWriter().append("{}").flush();
    }
  }

  static class MyWasAuthProvider implements AuthenticationProvider {
    @Autowired private UserService userService;
    @Override
    public Authentication authenticate(Authentication auth) throws AuthenticationException {
      String userId = auth.getName();
      String passwd = auth.getCredentials().toString();
      User user = userService.getByUserId(userId);
      if (user == null || !passwd.equals(user.getPasswd())) {
        throw new BadCredentialsException("AUTH NOT MATCHED");
      }
      List<GrantedAuthority> grant = new LinkedList<>();
      grant.add(new SimpleGrantedAuthority(GRANT_USER));
      return new UsernamePasswordAuthenticationToken(userId, passwd, grant);
    }
    @Override public boolean supports(Class<?> auth) { return true; }
  }
}