package my.was.mywas.board;

import static my.was.mywas.util.DateConverter.dateToStr;

import java.util.Date;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import my.was.mywas.common.Search;
import my.was.mywas.user.User;
import my.was.mywas.user.UserService;

@Slf4j
@Service
public class BoardService {

  private static final String CNT = "cnt";
  private static final String TOT = "tot";
  private static final String PAGE = "page";
  private static final String PAGES = "pages";
  private static final String ROWS = "rows";
  private static final String LIST = "list";

  @Autowired private BoardRepository repository;
  @Autowired private BoardRepository.Extension repositoryExt;
  @Autowired private UserService userService;

  public Board save(Board prm) {
    User user = userService.getCurrentUser();
    String ctime = dateToStr(new Date());
    if (prm.getId() == null || prm.getId() == 0) {
      prm.setCtime(ctime);
      if (user != null) {
        prm.setUserId(user.getUserId());
        prm.setUserNm(user.getUserNm());
      }
    } else {
      Board tmp = repository.findById(prm.getId()).get();
      tmp.setTitle(prm.getTitle());
      tmp.setContents(prm.getContents());
      prm = tmp;
    }
    prm.setUtime(ctime);
    log.debug("CHECK:{} / {}", prm, user);
    if (user != null && String.valueOf(user.getUserId()).equals(prm.getUserId())) {
      return repository.save(prm);
    } else {
      throw new ResponseStatusException(
        HttpStatusCode.valueOf(HttpServletResponse.SC_FORBIDDEN),
        "NOT ALLOWED"
      );
    }
  }

  public Map<String, Object> search(Search prm) {
    if (prm.getRows() < Search.ROWS_MINV) { prm.setRows(Search.ROWS_MINV); }
    if (prm.getRows() > Search.ROWS_MAXV) { prm.setRows(Search.ROWS_MAXV); }
    if (prm.getPages() < Search.PAGES_MINV) { prm.setPages(Search.PAGES_MINV); }
    if (prm.getPages() > Search.PAGES_MAXV) { prm.setPages(Search.PAGES_MAXV); }
    if (prm.getPage() < 1) { prm.setPage(1); }
    Map<String, Object> ret = new LinkedHashMap<>();
    PageRequest pageable = PageRequest.of(prm.getPage() - 1, prm.getRows());
    ret.put(CNT, repository.searchCount(prm));
    ret.put(TOT, repositoryExt.totalCount());
    ret.put(PAGE, prm.getPage());
    ret.put(ROWS, prm.getRows());
    ret.put(PAGES, prm.getPages());
    ret.put(LIST, repository.searchContent(prm, pageable));
    return ret;
  }

  public Board get(String id) {
    Optional<Board> result = repository.findById(Long.parseLong(id));
    if (!result.isEmpty()) {
      return result.get();
    }
    return null;
  }

  public void delete(String id) {
    repository.deleteById(Long.parseLong(id));
  }
}