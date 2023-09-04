package my.was.mywas.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpSession;

import static my.was.mywas.util.Constants.*;

import java.util.Iterator;

@RestController
@RequestMapping("/api/user")
public class UserController {

  @Autowired UserService service;

  @PostMapping("/logout")
  public Object logout(HttpSession session) {
    SecurityContext ctx = SecurityContextHolder.getContext();
    ctx.setAuthentication(null);
    session.removeAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY);
    Iterator<String> iter = session.getAttributeNames().asIterator();
    while (iter.hasNext()) { session.removeAttribute(iter.next()); }
    session.invalidate();
    return EMPTY_MAP;
  }

  @GetMapping("/{id}")
  public Object get(@PathVariable String id) {
    return service.get(id);
  }

  @GetMapping("/check/{id}")
  public Object check(@PathVariable String id, HttpSession session) {
    return service.check(id);
  }

  @PutMapping
  public Object put(@RequestBody User prm) {
    service.save(prm);
    return EMPTY_MAP;
  }
}