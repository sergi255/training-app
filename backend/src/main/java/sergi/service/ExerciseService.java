package sergi.service;

import sergi.dto.ExerciseDto;
import sergi.entity.Exercise;
import sergi.entity.User;
import sergi.exceptions.ExerciseNotFoundException;
import sergi.exceptions.UnauthorizedAccessException;
import sergi.repository.ExerciseRepository;
import sergi.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExerciseService {
    private final ExerciseRepository exerciseRepository;
    private final SecurityUtils securityUtils;

    public List<ExerciseDto> getUserExercises() {
        User currentUser = securityUtils.getCurrentUser();
        return exerciseRepository.findByUser(currentUser)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public ExerciseDto createExercise(ExerciseDto exerciseDto) {
        Exercise exercise = new Exercise();
        exercise.setName(exerciseDto.getName());
        exercise.setDescription(exerciseDto.getDescription());
        exercise.setMuscleGroup(exerciseDto.getMuscleGroup());
        exercise.setUser(securityUtils.getCurrentUser());

        Exercise savedExercise = exerciseRepository.save(exercise);
        return mapToDto(savedExercise);
    }

    public ExerciseDto updateExercise(Long id, ExerciseDto exerciseDto) {
        Exercise exercise = exerciseRepository.findById(id)
                .orElseThrow(() -> new ExerciseNotFoundException("Exercise with id " + id + " not found"));

        if (!exercise.getUser().getId().equals(securityUtils.getCurrentUser().getId())) {
            throw new UnauthorizedAccessException("Not authorized to update this exercise");
        }

        exercise.setName(exerciseDto.getName());
        exercise.setDescription(exerciseDto.getDescription());
        exercise.setMuscleGroup(exerciseDto.getMuscleGroup());

        Exercise updatedExercise = exerciseRepository.save(exercise);
        return mapToDto(updatedExercise);
    }

    public void deleteExercise(Long id) {
        Exercise exercise = exerciseRepository.findById(id)
                .orElseThrow(() -> new ExerciseNotFoundException("Exercise with id " + id + " not found"));

        if (!exercise.getUser().getId().equals(securityUtils.getCurrentUser().getId())) {
            throw new UnauthorizedAccessException("Not authorized to delete this exercise");
        }

        exerciseRepository.delete(exercise);
    }

    private ExerciseDto mapToDto(Exercise exercise) {
        return ExerciseDto.builder()
                .id(exercise.getId())
                .name(exercise.getName())
                .description(exercise.getDescription())
                .muscleGroup(exercise.getMuscleGroup())
                .build();
    }

    public List<ExerciseDto> getAllExercises() {
        return exerciseRepository.findAll()
                .stream()
                .map(exercise -> ExerciseDto.builder()
                        .id(exercise.getId())
                        .name(exercise.getName())
                        .description(exercise.getDescription())
                        .muscleGroup(exercise.getMuscleGroup())
                        .build())
                .collect(Collectors.toList());
    }

    public ExerciseDto getExercise(Long id) {
        Exercise exercise = exerciseRepository.findById(id)
                .orElseThrow(() -> new ExerciseNotFoundException("Exercise with id " + id + " not found"));

        return mapToDto(exercise);
    }
}