package my.was.mywas.board;

import static my.was.mywas.util.DateConverter.dateToStr;

import java.util.Date;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
public class BoardService {

  private static final String CNT = "cnt";
  private static final String TOT = "tot";
  private static final String PAGE = "page";
  private static final String PAGES = "pages";
  private static final String ROWS = "rows";
  private static final String LIST = "list";

  @Autowired private BoardRepository repository;

  public Board save(Board prm) {
    String ctime = dateToStr(new Date());
    if (prm.getId() == null || prm.getId() == 0) {
      prm.setCtime(ctime);
    } else {
      Board tmp = repository.findById(prm.getId()).get();
      prm.setCtime(tmp.getCtime());
    }
    prm.setUtime(ctime);
    return repository.save(prm);
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
    ret.put(TOT, repository.totalCount(prm));
    ret.put(PAGE, prm.getPage());
    ret.put(ROWS, prm.getRows());
    ret.put(PAGES, prm.getPages());
    ret.put(LIST, repository.searchContent(prm, pageable));
    return ret;
  }

  public Board get(String id) {
    return repository.findById(Long.parseLong(id)).get();
  }

  public void delete(String id) {
    repository.deleteById(Long.parseLong(id));
  }
}