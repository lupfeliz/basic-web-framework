package my.was.mywas.board;

public interface BoardJPQuries {

  static final String PRM = "prm";

  static final String SEARCH_CONDITION =
    " (:#{#" + PRM + ".searchType} is not null or true) and " +
    " (:#{#" + PRM + ".searchType} != '1' or title like %:#{#" + PRM + ".searchStr}%) and " +
    " (:#{#" + PRM + ".searchType} != '2' or contents like %:#{#" + PRM + ".searchStr}%) and " +
    " (:#{#" + PRM + ".searchType} != '3' or (title like %:#{#" + PRM + ".searchStr}% or contents like %:#{#" + PRM + ".searchStr}%)) ";

  static final String BOARD_SEARCH_QUERY =
    " select new Board(id, num, title, userId, userNm, '', ctime, utime) from Board " +
    " where " + SEARCH_CONDITION + " order by ctime desc";

  static final String BOARD_COUNT_QUERY =
    " select count(*) from Board where " + SEARCH_CONDITION;

  static final String BOARD_COUNT_ALL =
    " select count(*) from Board ";
}