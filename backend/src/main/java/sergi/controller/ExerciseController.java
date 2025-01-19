package sergi.controller;

import sergi.dto.ExerciseDto;
import sergi.service.ExerciseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exercises")
@RequiredArgsConstructor
public class ExerciseController {
    private final ExerciseService exerciseService;

    @GetMapping
    public ResponseEntity<List<ExerciseDto>> getUserExercises() {
        return ResponseEntity.ok(exerciseService.getUserExercises());
    }

    @PostMapping
    public ResponseEntity<ExerciseDto> createExercise(@RequestBody ExerciseDto exerciseDto) {
        return ResponseEntity.ok(exerciseService.createExercise(exerciseDto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExerciseDto> updateExercise(
            @PathVariable Long id,
            @RequestBody ExerciseDto exerciseDto) {
        return ResponseEntity.ok(exerciseService.updateExercise(id, exerciseDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExercise(@PathVariable Long id) {
        exerciseService.deleteExercise(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/all")
    public ResponseEntity<List<ExerciseDto>> getAllExercises() {
        return ResponseEntity.ok(exerciseService.getAllExercises());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExerciseDto> getExercise(@PathVariable Long id) {
        return ResponseEntity.ok(exerciseService.getExercise(id));
    }
}
