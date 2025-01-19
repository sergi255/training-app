package sergi.repository;

import sergi.entity.Training;
import sergi.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrainingRepository extends JpaRepository<Training, Long> {
    List<Training> findByUser(User user);
    List<Training> findByUserId(Long userId);
    void deleteByUserId(Long userId);
}
