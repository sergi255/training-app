package sergi.repository;

import sergi.entity.Exercise;
import sergi.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExerciseRepository extends JpaRepository<Exercise, Long> {
    List<Exercise> findByUser(User user);
    List<Exercise> findByUserId(Long userId);
    void deleteByUserId(Long userId);
}
