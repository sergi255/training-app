package sergi.service;

import sergi.dto.ExerciseDto;
import sergi.dto.TrainingDto;
import sergi.dto.UserDto;
import sergi.entity.Exercise;
import sergi.entity.Training;
import sergi.entity.User;
import sergi.entity.TrainingExercise;
import sergi.repository.ExerciseRepository;
import sergi.repository.TrainingRepository;
import sergi.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.HashSet;

@Service
@RequiredArgsConstructor
public class AdminService {
    private final UserRepository userRepository;
    private final ExerciseRepository exerciseRepository;
    private final TrainingRepository trainingRepository;
    private final ExerciseService exerciseService;

    public List<UserDto> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::mapToUserDto)
                .collect(Collectors.toList());
    }

    public List<ExerciseDto> getUserExercises(Long userId) {
        validateUserExists(userId);
        return exerciseRepository.findByUserId(userId)
                .stream()
                .map(this::mapToExerciseDto)
                .collect(Collectors.toList());
    }

    public List<ExerciseDto> getAllExercises() {
        return exerciseService.getAllExercises();
    }

    public List<TrainingDto> getUserTrainings(Long userId) {
        validateUserExists(userId);
        return trainingRepository.findByUserId(userId)
                .stream()
                .map(this::mapToTrainingDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteUser(Long userId) {
        validateUserExists(userId);
        // Najpierw usuń powiązane treningi i ćwiczenia
        trainingRepository.deleteByUserId(userId);
        exerciseRepository.deleteByUserId(userId);
        // Na końcu usuń użytkownika
        userRepository.deleteById(userId);
    }

    public ExerciseDto updateUserExercise(Long userId, Long exerciseId, ExerciseDto exerciseDto) {
        validateUserExists(userId);
        Exercise exercise = exerciseRepository.findById(exerciseId)
                .orElseThrow(() -> new RuntimeException("Exercise not found"));

        if (!exercise.getUser().getId().equals(userId)) {
            throw new RuntimeException("Exercise doesn't belong to specified user");
        }

        exercise.setName(exerciseDto.getName());
        exercise.setDescription(exerciseDto.getDescription());
        exercise.setMuscleGroup(exerciseDto.getMuscleGroup());

        Exercise updatedExercise = exerciseRepository.save(exercise);
        return mapToExerciseDto(updatedExercise);
    }

    public TrainingDto updateUserTraining(Long userId, Long trainingId, TrainingDto trainingDto) {
        validateUserExists(userId);
        Training training = trainingRepository.findById(trainingId)
                .orElseThrow(() -> new RuntimeException("Training not found"));

        if (!training.getUser().getId().equals(userId)) {
            throw new RuntimeException("Training doesn't belong to specified user");
        }

        training.setName(trainingDto.getName());
        training.setDate(trainingDto.getDate());

        Set<TrainingExercise> trainingExercises = new HashSet<>();

        trainingDto.getExercises().forEach(exerciseRequest -> {
            TrainingExercise te = new TrainingExercise();
            te.setTraining(training);
            te.setExercise(exerciseRepository.findById(exerciseRequest.getExerciseId())
                    .orElseThrow(() -> new RuntimeException("Exercise not found")));
            te.setSets(exerciseRequest.getSets());
            te.setReps(exerciseRequest.getReps());
            trainingExercises.add(te);
        });

        training.setTrainingExercises(trainingExercises);
        Training updatedTraining = trainingRepository.save(training);
        return mapToTrainingDto(updatedTraining);
    }

    @Transactional
    public void deleteUserExercise(Long userId, Long exerciseId) {
        validateUserExists(userId);
        Exercise exercise = exerciseRepository.findById(exerciseId)
                .orElseThrow(() -> new RuntimeException("Exercise not found"));

        if (!exercise.getUser().getId().equals(userId)) {
            throw new RuntimeException("Exercise doesn't belong to specified user");
        }

        exerciseRepository.delete(exercise);
    }

    @Transactional
    public void deleteUserTraining(Long userId, Long trainingId) {
        validateUserExists(userId);
        Training training = trainingRepository.findById(trainingId)
                .orElseThrow(() -> new RuntimeException("Training not found"));

        if (!training.getUser().getId().equals(userId)) {
            throw new RuntimeException("Training doesn't belong to specified user");
        }

        trainingRepository.delete(training);
    }

    private void validateUserExists(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found");
        }
    }

    private UserDto mapToUserDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .build();
    }

    private ExerciseDto mapToExerciseDto(Exercise exercise) {
        return ExerciseDto.builder()
                .id(exercise.getId())
                .name(exercise.getName())
                .description(exercise.getDescription())
                .muscleGroup(exercise.getMuscleGroup())
                .build();
    }

    private TrainingDto mapToTrainingDto(Training training) {
        Set<TrainingDto.ExerciseRequest> exercises = training.getTrainingExercises().stream()
                .map(te -> TrainingDto.ExerciseRequest.builder()
                        .exerciseId(te.getExercise().getId())
                        .sets(te.getSets())
                        .reps(te.getReps())
                        .build())
                .collect(Collectors.toSet());

        return TrainingDto.builder()
                .id(training.getId())
                .name(training.getName())
                .date(training.getDate())
                .exercises(exercises)
                .build();
    }
}
