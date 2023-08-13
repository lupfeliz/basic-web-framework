package my.was.mywas.user;

import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;
import my.was.mywas.util.CryptoUtil;

import static my.was.mywas.util.DateConverter.dateToStr;

@Slf4j
@Service
public class UserService {
  @Autowired private UserRepository repository;

  public User get(String id) {
    return repository.findById(Long.parseLong(id)).get();
  }

  public User getByUserId(String userId) {
    List<User> users = repository.findByUserId(userId);
    log.debug("USERS:{} / {}", userId, users);
    if (users.size() > 0) {
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
      String passwd = prm.getPasswd();
      prm.setPasswd(CryptoUtil.enc(passwd, passwd));
    } else {
      User tmp = repository.findById(prm.getId()).get();
      prm.setCtime(tmp.getCtime());
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
