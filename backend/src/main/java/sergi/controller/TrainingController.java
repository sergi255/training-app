package sergi.controller;

import sergi.dto.TrainingDto;
import sergi.service.TrainingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trainings")
@RequiredArgsConstructor
public class TrainingController {
    private final TrainingService trainingService;

    @GetMapping
    public ResponseEntity<List<TrainingDto>> getUserTrainings() {
        return ResponseEntity.ok(trainingService.getUserTrainings());
    }

    @PostMapping
    public ResponseEntity<TrainingDto> createTraining(@RequestBody TrainingDto trainingDto) {
        return ResponseEntity.ok(trainingService.createTraining(trainingDto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TrainingDto> updateTraining(
            @PathVariable Long id,
            @RequestBody TrainingDto trainingDto) {
        return ResponseEntity.ok(trainingService.updateTraining(id, trainingDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTraining(@PathVariable Long id) {
        trainingService.deleteTraining(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/all")
    public ResponseEntity<List<TrainingDto>> getAllTrainings() {
        return ResponseEntity.ok(trainingService.getAllTrainings());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TrainingDto> getTraining(@PathVariable Long id) {
        return ResponseEntity.ok(trainingService.getTraining(id));
    }
}
