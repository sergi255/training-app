package sergi.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ExerciseDto {
    private Long id;
    private String name;
    private String description;
    private String muscleGroup;
}
