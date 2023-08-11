package my.was.mywas.user;

import java.util.Date;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import static my.was.mywas.util.DateConverter.dateToStr;

@Service
public class UserService {
  @Autowired private UserRepository repository;

  public User get(String id) {
    return repository.findById(Long.parseLong(id)).get();
  }

  public Object check(String userId) {
    return Map.of("check", repository.countByUserId(userId) == 0);
  }

  public void save(User prm) {
    String ctime = dateToStr(new Date());
    if (prm.getId() == null || prm.getId() == 0) {
      prm.setCtime(ctime);
    } else {
      User tmp = repository.findById(prm.getId()).get();
      prm.setCtime(tmp.getCtime());
    }
    prm.setUtime(ctime);
    repository.save(prm);
  }
}
