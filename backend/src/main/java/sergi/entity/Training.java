package sergi.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;
import java.util.Set;
import java.util.HashSet;

@Getter
@Setter
@Entity
@Table(name = "trainings")
public class Training {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(name = "date")
    private LocalDate date;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "training", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<TrainingExercise> trainingExercises = new HashSet<>();

    public void addTrainingExercise(TrainingExercise exercise) {
        trainingExercises.add(exercise);
        exercise.setTraining(this);
    }

    public void removeTrainingExercise(TrainingExercise exercise) {
        trainingExercises.remove(exercise);
        exercise.setTraining(null);
    }

    public void setTrainingExercises(Set<TrainingExercise> exercises) {
        // Clear existing exercises
        trainingExercises.forEach(exercise -> exercise.setTraining(null));
        trainingExercises.clear();
        
        // Add new exercises
        if (exercises != null) {
            exercises.forEach(this::addTrainingExercise);
        }
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Training)) return false;
        Training training = (Training) o;
        return id != null && id.equals(training.getId());
    }

    @Override
    public int hashCode() {
        // This is safe and consistent with equals
        return getClass().hashCode();
    }
}
