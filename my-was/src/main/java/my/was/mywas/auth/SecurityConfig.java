package my.was.mywas.auth;

import org.json.JSONObject;
import org.json.JSONStringer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;

import jakarta.servlet.Filter;
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

import static my.was.mywas.util.Constants.UTF8;

@Slf4j
@Configuration @EnableWebSecurity
@SuppressWarnings({ "static-access" })
public class SecurityConfig {

  private static final String LOGIN_PATH = "/api/user/login";
  private static final String PRM_USER_ID = "userId";
  private static final String PRM_PASSWD = "passwd";
  private static final String BOARD_WRITE = "BOARD_WRITE";
  private static final String ROLE_USER = "ROLE_USER";
  private static final String ROLE_ADMIN = "ROLE_ADMIN";

  @Bean AuthenticationProvider authenticationProvider() { return new MyWasAuthProvider(); }

  @Bean SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    AntPathRequestMatcher m = new AntPathRequestMatcher("/**");
    Filter jsonFilter = new MyWasAuthFilter(m.antMatcher(POST, LOGIN_PATH), http);

    http
      .csrf(csrf -> csrf.disable())
      .cors(cors -> cors.disable())
      .headers(hdr -> hdr
        .frameOptions(frm -> frm.sameOrigin())
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
          ).hasAnyAuthority(BOARD_WRITE)
        .anyRequest()
          .authenticated()
      )
      .addFilterAt(jsonFilter, UsernamePasswordAuthenticationFilter.class)
      .formLogin(login -> login.disable())
      .logout(logout -> logout.disable())
      .anonymous(anon -> anon.disable());
    return http.build();
  }

  static class MyWasAuthFilter extends AbstractAuthenticationProcessingFilter {
    private HttpSecurity http;
    public MyWasAuthFilter(RequestMatcher matcher, HttpSecurity http) {
      super(matcher);
      this.http = http;
      this.setAuthenticationSuccessHandler(new MyWasLoginSuccess());
      this.setAuthenticationFailureHandler(new MyWasLoginFail());
    }
    @Override
    public Authentication attemptAuthentication(HttpServletRequest req, HttpServletResponse res)
      throws AuthenticationException, IOException, ServletException {
      setAuthenticationManager(http.getSharedObject(AuthenticationManager.class));
      String body = req.getReader().lines().collect(Collectors.joining());
      JSONObject map = new JSONObject(body);
      Authentication token =
        new UsernamePasswordAuthenticationToken(
          map.optString(PRM_USER_ID, ""),
          map.optString(PRM_PASSWD, "")
        );
      Authentication auth = null;
      authenticationDetailsSource.buildDetails(req);
      auth = getAuthenticationManager().authenticate(token);
      return auth;
    }
  }
  static class MyWasLoginSuccess implements AuthenticationSuccessHandler {
    @Override public void onAuthenticationSuccess(
      HttpServletRequest req, HttpServletResponse res, Authentication auth)
       throws IOException, ServletException {
      HttpSession session = req.getSession();
      SecurityContext ctx = SecurityContextHolder.getContext();
      User user = (User)ctx.getAuthentication().getDetails();
      session.setAttribute(
        HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, ctx);
      res.setStatus(HttpServletResponse.SC_OK);
      res.setCharacterEncoding(UTF8);
      res.getWriter().append(
        new JSONStringer()
        .object()
          .key("userNm")
          .value(user.getUserNm())
        .endObject()
        .toString()
      ).flush();
    }
  }
  static class MyWasLoginFail implements AuthenticationFailureHandler {
    @Override public void onAuthenticationFailure(
      HttpServletRequest req, HttpServletResponse res, AuthenticationException e)
        throws IOException, ServletException {
      log.debug("LOGIN FAILED! {}", e.getMessage());
      res.setStatus(HttpServletResponse.SC_BAD_REQUEST);
      res.setCharacterEncoding(UTF8);
      res.getWriter().append(
        new JSONStringer()
        .object()
          .key("msg")
          .value(e.getMessage())
        .endObject()
        .toString()
      ).flush();
    }
  }

  static class MyWasAuthProvider implements AuthenticationProvider {
    @Autowired private UserService userService;
    @Override
    public Authentication authenticate(Authentication auth) throws AuthenticationException {
      String userId = auth.getName();
      String passwd = String.valueOf(auth.getCredentials());
      User user = userService.getByUserId(userId);
      if (user == null || !passwd.equals(user.getPasswd())) {
        throw new BadCredentialsException("AUTH NOT MATCHED");
      }
      List<GrantedAuthority> grant = new LinkedList<>();
      grant.add(new SimpleGrantedAuthority(BOARD_WRITE));
      grant.add(new SimpleGrantedAuthority(ROLE_ADMIN));
      grant.add(new SimpleGrantedAuthority(ROLE_USER));
      UsernamePasswordAuthenticationToken ret =
        new UsernamePasswordAuthenticationToken(userId, passwd, grant);
      ret.setDetails(user);
      return ret;
    }
    @Override public boolean supports(Class<?> auth) { return true; }
  }
}