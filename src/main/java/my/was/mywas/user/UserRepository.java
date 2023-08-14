package my.was.mywas.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;


public interface UserRepository extends JpaRepository<User, Long> {

  List<User> findByUserId(String userId);

  @Query("select count(*) from User where userId = :userId")
  int countByUserId(@Param("userId") String userId);
}