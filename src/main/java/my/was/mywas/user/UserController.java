package my.was.mywas.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;

import static my.was.mywas.util.Constants.*;

import java.util.Iterator;

@Slf4j
@RestController
@RequestMapping("/api/user")
public class UserController {

  @Autowired UserService service;

  @GetMapping("/{id}")
  public Object get(@PathVariable String id) {
    return service.get(id);
  }

  @Autowired
  AuthenticationManager authman;

  @GetMapping("/check/{id}")
  public Object check(@PathVariable String id, HttpSession session) {

    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    log.debug("SESSION-ID:{} / {} / {}", session.getId(), authman, auth);
    Iterator<String> iter = session.getAttributeNames().asIterator();
    while (iter.hasNext()) {
      String key = iter.next();
      log.debug("SESSION-KEY:{} / {}", key, session.getAttribute(key));
    }
    return service.check(id);
  }

  @PutMapping
  public Object put(@RequestBody User prm) {
    service.save(prm);
    return EMPTY_MAP;
  }
}