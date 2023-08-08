package my.was.mywas.board;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static my.was.mywas.util.Constants.*;

@RestController
@RequestMapping("/api/board")
public class BoardController {

  @Autowired BoardService service;

  @PostMapping
  public Object search(@RequestBody Search prm) {
    return service.search(prm);
  }

  @PutMapping
  public Object put(@RequestBody Board prm) {
      service.save(prm);
      return EMPTY_MAP;
  }

  @GetMapping("/{id}")
  public Object get(@PathVariable String id) {
    return service.get(id);
  }
 
  @DeleteMapping("/{id}")
  public Object delete(@PathVariable String id) {
    service.delete(id);
    return EMPTY_MAP;
  }
}