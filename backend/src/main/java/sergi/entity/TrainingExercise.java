package sergi.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "training_exercises")
@IdClass(TrainingExerciseId.class)
public class TrainingExercise {
    @Id
    @ManyToOne
    @JoinColumn(name = "training_id")
    private Training training;

    @Id
    @ManyToOne
    @JoinColumn(name = "exercise_id")
    private Exercise exercise;

    private Integer sets;
    private Integer reps;
}
