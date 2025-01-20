package sergi.service;

import sergi.dto.ExerciseDto;
import sergi.dto.TrainingDto;
import sergi.dto.UserDto;
import sergi.dto.ExerciseRequest;
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

import sergi.exceptions.ExerciseNotFoundException;
import sergi.exceptions.TrainingNotFoundException;
import sergi.exceptions.UnauthorizedAccessException;

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

    @Transactional
    public void deleteExercise(Long exerciseId) {
        Exercise exercise = exerciseRepository.findById(exerciseId)
                .orElseThrow(() -> new ExerciseNotFoundException("Exercise not found with id: " + exerciseId));
        
        // Delete related training exercises first
        exerciseRepository.delete(exercise);
    }

    @Transactional
    public ExerciseDto updateExercise(Long exerciseId, ExerciseDto exerciseDto) {
        Exercise exercise = exerciseRepository.findById(exerciseId)
                .orElseThrow(() -> new ExerciseNotFoundException("Exercise not found with id: " + exerciseId));

        exercise.setName(exerciseDto.getName());
        exercise.setDescription(exerciseDto.getDescription());
        exercise.setMuscleGroup(exerciseDto.getMuscleGroup());

        Exercise updatedExercise = exerciseRepository.save(exercise);
        return mapToExerciseDto(updatedExercise);
    }

    @Transactional
    public void deleteTraining(Long trainingId) {
        Training training = trainingRepository.findById(trainingId)
                .orElseThrow(() -> new TrainingNotFoundException("Training not found with id: " + trainingId));
        trainingRepository.delete(training);
    }

    @Transactional
    public TrainingDto updateTraining(Long trainingId, TrainingDto trainingDto) {
        Training training = trainingRepository.findById(trainingId)
                .orElseThrow(() -> new TrainingNotFoundException("Training not found with id: " + trainingId));

        training.setName(trainingDto.getName());
        training.setDate(trainingDto.getDate());
        
        // Clear existing exercises and add new ones
        training.getTrainingExercises().clear();
        
        Set<TrainingExercise> newExercises = trainingDto.getExercises().stream()
                .map(exerciseRequest -> {
                    Exercise exercise = exerciseRepository.findById(exerciseRequest.getExerciseId())
                            .orElseThrow(() -> new ExerciseNotFoundException("Exercise not found"));
                    
                    TrainingExercise te = new TrainingExercise();
                    te.setTraining(training);
                    te.setExercise(exercise);
                    te.setSets(exerciseRequest.getSets());
                    te.setReps(exerciseRequest.getReps());
                    return te;
                })
                .collect(Collectors.toSet());
        
        training.setTrainingExercises(newExercises);
        
        Training updatedTraining = trainingRepository.save(training);
        return mapToTrainingDto(updatedTraining);
    }

    public List<TrainingDto> getAllTrainings() {
        return trainingRepository.findAll()
                .stream()
                .map(this::mapToTrainingDto)
                .collect(Collectors.toList());
    }

    private void validateUserExists(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new UnauthorizedAccessException("User with id " + userId + " not found");
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
        Set<ExerciseRequest> exercises = training.getTrainingExercises().stream()
                .map(te -> ExerciseRequest.builder()
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
