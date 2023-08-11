package my.was.mywas.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static my.was.mywas.util.Constants.*;

@RestController
@RequestMapping("/api/user")
public class UserController {

  @Autowired UserService service;

  @GetMapping("/{id}")
  public Object get(@PathVariable String id) {
    return service.get(id);
  }

  @GetMapping("/check/{id}")
  public Object check(@PathVariable String id) {
    return service.check(id);
  }

  @PutMapping
  public Object put(@RequestBody User prm) {
    service.save(prm);
    return EMPTY_MAP;
  }
}