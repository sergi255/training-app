package sergi.dto;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDate;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.Collections;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrainingDto {
    private Long id;
    private String name;
    private LocalDate date; 
    
    @JsonProperty("exercises")
    private Set<ExerciseRequest> exercises;

    @Data
    public static class ExerciseRequest {
        private Long exerciseId;
    }

    public Set<Long> getExerciseIds() {
        return exercises != null ? 
            exercises.stream()
                .map(ExerciseRequest::getExerciseId)
                .collect(Collectors.toSet()) : 
            Collections.emptySet();
    }
}
