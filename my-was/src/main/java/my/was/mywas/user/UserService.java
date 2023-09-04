package my.was.mywas.user;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;

import static my.was.mywas.util.DateConverter.dateToStr;

@Slf4j
@Service
public class UserService {
  @Autowired private UserRepository repository;

  public User get(String id) {
    Optional<User> res = repository.findById(Long.parseLong(id));
    if (!res.isEmpty()) {
      return res.get();
    }
    return null;
  }

  public User getByUserId(String userId) {
    List<User> users = repository.findByUserId(userId);
    log.debug("USERS:{} / {}", userId, users);
    if (!users.isEmpty()) {
      return users.get(0);
    } else {
      return null;
    }
  }

  public Object check(String userId) {
    return Map.of("check", repository.countByUserId(userId) == 0);
  }

  public void save(User prm) {
    String ctime = dateToStr(new Date());
    if (prm.getId() == null || prm.getId() == 0) {
      prm.setCtime(ctime);
    } else {
      Optional<User> res = repository.findById(prm.getId());
      if (!res.isEmpty()) {
        prm.setCtime(res.get().getCtime());
      }
    }
    prm.setUtime(ctime);
    repository.save(prm);
  }

  public User getCurrentUser() {
    User ret = null;
    try {
      Authentication auth = SecurityContextHolder.getContext().getAuthentication();
      ret = (User)auth.getDetails();
    } catch (Exception e) {
      log.debug("ERROR:{}", e);
    }
    return ret;
  }
}