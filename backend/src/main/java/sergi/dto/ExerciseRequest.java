package sergi.dto;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExerciseRequest {
    private Long exerciseId;
    private Integer sets;
    private Integer reps;
}
