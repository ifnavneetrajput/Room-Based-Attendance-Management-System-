
package com.attendance.attendance_backend.controller;
import com.attendance.attendance_backend.dto.RoomAttendanceReport;
import com.attendance.attendance_backend.entity.Attendance;
import com.attendance.attendance_backend.enums.AttendanceStatus;
import com.attendance.attendance_backend.service.AttendanceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    // Mark or update attendance
    @PostMapping
    public ResponseEntity<?> markAttendance(
            @RequestBody Map<String, Object> request) {
        try {
            Long personId = getLong(request, "personId");
            Long roomId = getLong(request, "roomId");
            Long observerId = getLong(request, "observerId");

            String statusValue = (String) request.get("status");

            if (statusValue == null || statusValue.isBlank()) {
                throw new IllegalArgumentException(
                        "Attendance status is required");
            }

            AttendanceStatus status;

            try {
                status = AttendanceStatus.valueOf(
                        statusValue.trim().toUpperCase());
            } catch (IllegalArgumentException exception) {
                throw new IllegalArgumentException(
                        "Status must be PRESENT, ABSENT, or LATE");
            }

            Attendance attendance = attendanceService.markAttendance(
                    personId, roomId, status, observerId);

            return ResponseEntity.ok(Map.of(
                    "id", attendance.getId(),
                    "personId", attendance.getPerson().getId(),
                    "personName", attendance.getPerson().getName(),
                    "roomId", attendance.getRoom().getId(),
                    "roomNumber", attendance.getRoom().getRoomNumber(),
                    "date", attendance.getAttendanceDate().toString(),
                    "status", attendance.getStatus().name(),
                    "observerId", attendance.getMarkedBy().getId(),
                    "markedAt", attendance.getMarkedAt().toString()
            ));

        } catch (IllegalArgumentException exception) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", exception.getMessage()));
        }
    }

    // Get attendance for a room on a particular date
    @GetMapping("/room/{roomId}")
    public ResponseEntity<?> getRoomAttendance(
            @PathVariable Long roomId,
            @RequestParam String date) {
        try {
            LocalDate attendanceDate = LocalDate.parse(date);

            List<Attendance> records =
                    attendanceService.getAttendanceByRoomAndDate(
                            roomId, attendanceDate);

            List<Map<String, Object>> response = records.stream()
                    .map(record -> Map.<String, Object>of(
                            "id", record.getId(),
                            "personId", record.getPerson().getId(),
                            "personName", record.getPerson().getName(),
                            "personCode", record.getPerson().getPersonCode(),
                            "roomNumber", record.getRoom().getRoomNumber(),
                            "date", record.getAttendanceDate().toString(),
                            "status", record.getStatus().name(),
                            "observerId", record.getMarkedBy().getId()
                    ))
                    .toList();

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException exception) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", "Invalid room ID or date"));
        }
    }

    private Long getLong(Map<String, Object> request, String key) {
      Object value = request.get(key);

      if (!(value instanceof Number)) {
        throw new IllegalArgumentException(
            key + " must be a valid number");
      }

      return ((Number) value).longValue();
    }
    
@GetMapping("/report")
public ResponseEntity<?> getAttendanceReport(
        @RequestParam String date) {

    try {
        LocalDate attendanceDate = LocalDate.parse(date);

        List<RoomAttendanceReport> report =
                attendanceService.getRoomAttendanceReport(attendanceDate);

        return ResponseEntity.ok(report);

    } catch (java.time.format.DateTimeParseException exception) {
        return ResponseEntity.badRequest()
                .body(Map.of("error", "Date must use YYYY-MM-DD format"));

    } catch (IllegalArgumentException exception) {
        return ResponseEntity.badRequest()
                .body(Map.of("error", exception.getMessage()));
    }
}

}
