package sergi.service;

import sergi.dto.TrainingDto;
import sergi.dto.ExerciseRequest;
import sergi.entity.Exercise;
import sergi.entity.Training;
import sergi.entity.TrainingExercise;
import sergi.entity.User;
import sergi.repository.ExerciseRepository;
import sergi.repository.TrainingRepository;
import sergi.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.HashSet;

@Service
@RequiredArgsConstructor
public class TrainingService {
    private final TrainingRepository trainingRepository;
    private final ExerciseRepository exerciseRepository;
    private final SecurityUtils securityUtils;

    public List<TrainingDto> getUserTrainings() {
        User currentUser = securityUtils.getCurrentUser();
        return trainingRepository.findByUser(currentUser)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public TrainingDto createTraining(TrainingDto trainingDto) {
        Training training = new Training();
        training.setName(trainingDto.getName());
        training.setDate(trainingDto.getDate());
        training.setUser(securityUtils.getCurrentUser());

        Set<TrainingExercise> trainingExercises = trainingDto.getExercises().stream()
                .map(exerciseRequest -> {
                    TrainingExercise te = new TrainingExercise();
                    te.setTraining(training);
                    te.setExercise(exerciseRepository.findById(exerciseRequest.getExerciseId())
                            .orElseThrow(() -> new RuntimeException("Exercise not found")));
                    te.setSets(exerciseRequest.getSets());
                    te.setReps(exerciseRequest.getReps());
                    return te;
                })
                .collect(Collectors.toSet());

        training.setTrainingExercises(trainingExercises);
        Training savedTraining = trainingRepository.save(training);
        return mapToDto(savedTraining);
    }

    public TrainingDto updateTraining(Long id, TrainingDto trainingDto) {
        Training training = trainingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Training not found"));

        if (!training.getUser().getId().equals(securityUtils.getCurrentUser().getId())) {
            throw new RuntimeException("Not authorized to update this training");
        }

        training.setName(trainingDto.getName());
        training.setDate(trainingDto.getDate());

        Set<TrainingExercise> newExercises = trainingDto.getExercises().stream()
                .map(exerciseRequest -> {
                    TrainingExercise te = new TrainingExercise();
                    te.setExercise(exerciseRepository.findById(exerciseRequest.getExerciseId())
                            .orElseThrow(() -> new RuntimeException("Exercise not found")));
                    te.setSets(exerciseRequest.getSets());
                    te.setReps(exerciseRequest.getReps());
                    return te;
                })
                .collect(Collectors.toSet());

        // Use the entity's method to handle the relationship
        training.setTrainingExercises(newExercises);
        return mapToDto(trainingRepository.save(training));
    }

    public void deleteTraining(Long id) {
        Training training = trainingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Training not found"));

        if (!training.getUser().getId().equals(securityUtils.getCurrentUser().getId())) {
            throw new RuntimeException("Not authorized to delete this training");
        }

        trainingRepository.delete(training);
    }

    public List<TrainingDto> getAllTrainings() {
        return trainingRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private TrainingDto mapToDto(Training training) {
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

    public TrainingDto getTraining(Long id) {
        Training training = trainingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Training not found"));

        return mapToDto(training);
    }
}