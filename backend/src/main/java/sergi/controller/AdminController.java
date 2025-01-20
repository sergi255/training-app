package sergi.controller;

import sergi.dto.ExerciseDto;
import sergi.dto.TrainingDto;
import sergi.dto.UserDto;
import sergi.service.AdminService;
import sergi.service.TrainingService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.stereotype.Controller;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@Controller
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAuthority('ADMIN')")
public class AdminController {
    private final AdminService adminService;
    private final TrainingService trainingService;

    @Autowired
    public AdminController(AdminService adminService, TrainingService trainingService) {
        this.adminService = adminService;
        this.trainingService = trainingService;
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @GetMapping("/users/{userId}/exercises")
    public ResponseEntity<List<ExerciseDto>> getUserExercises(@PathVariable Long userId) {
        return ResponseEntity.ok(adminService.getUserExercises(userId));
    }

    @GetMapping("/users/{userId}/trainings")
    public ResponseEntity<List<TrainingDto>> getUserTrainings(@PathVariable Long userId) {
        return ResponseEntity.ok(adminService.getUserTrainings(userId));
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
        adminService.deleteUser(userId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/exercises/{exerciseId}")
    public ResponseEntity<?> deleteExercise(@PathVariable Long exerciseId) {
        adminService.deleteExercise(exerciseId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/exercises/{exerciseId}")
    public ResponseEntity<?> updateExercise(
            @PathVariable Long exerciseId,
            @RequestBody ExerciseDto exerciseDto) {
        return ResponseEntity.ok(adminService.updateExercise(exerciseId, exerciseDto));
    }

    @DeleteMapping("/trainings/{trainingId}")
    public ResponseEntity<?> deleteTraining(@PathVariable Long trainingId) {
        adminService.deleteTraining(trainingId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/trainings/{trainingId}")
    public ResponseEntity<?> updateTraining(
            @PathVariable Long trainingId,
            @RequestBody TrainingDto trainingDto) {
        return ResponseEntity.ok(adminService.updateTraining(trainingId, trainingDto));
    }
}
