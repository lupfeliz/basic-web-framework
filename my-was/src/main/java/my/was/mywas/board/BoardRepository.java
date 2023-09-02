package my.was.mywas.board;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import my.was.mywas.common.Search;

public interface BoardRepository extends JpaRepository<Board, Long>, BoardJPQuries {

  @Query(BOARD_SEARCH_QUERY)
  List<Board> searchContent(@Param(PRM) Search prm, Pageable pageable);

  @Query(BOARD_COUNT_QUERY)
  int searchCount(@Param(PRM) Search prm);

  @Query(BOARD_COUNT_ALL)
  int totalCount(@Param(PRM) Search prm);

  @Repository public static class Extension {
    @PersistenceContext private EntityManager em;
    public Object totalCount() {
      TypedQuery<Object> q = em.createQuery("select count(*) from Board", null);
      return q.getSingleResult();
    }
  }
}