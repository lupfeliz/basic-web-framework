package my.was.mywas.board;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import my.was.mywas.common.Search;

public interface BoardRepository extends JpaRepository<Board, Long> {

  static final String SEARCH_CONDITION = 
    "(:#{#prm.searchType} is not null or true) and " +
    "(:#{#prm.searchType} != '1' or title like %:#{#prm.searchStr}%) and " +
    "(:#{#prm.searchType} != '2' or contents like %:#{#prm.searchStr}%) and " +
    "(:#{#prm.searchType} != '3' or (title like %:#{#prm.searchStr}% or contents like %:#{#prm.searchStr}%)) ";

  @Query(
    "select new Board(id, num, title, userId, userNm, '', ctime, utime) from Board " +
    "where " +
    SEARCH_CONDITION +
    "order by ctime desc"
  )
  List<Board> searchContent(@Param("prm") Search prm, Pageable pageable);

  @Query( "select count(*) from Board " +
    "where " + SEARCH_CONDITION
  )
  int searchCount(@Param("prm") Search prm);

  @Query(
    "select count(*) from Board "
  )
  int totalCount(@Param("prm") Search prm);
}