
package com.attendance.attendance_backend.controller;

import com.attendance.attendance_backend.entity.Room;
import com.attendance.attendance_backend.service.RoomService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    // Create a room
    @PostMapping
    public ResponseEntity<?> createRoom(@RequestBody Map<String, String> request) {
        try {
            String roomNumber = request.get("roomNumber");
            Room room = roomService.createRoom(roomNumber);

            return ResponseEntity.status(HttpStatus.CREATED).body(room);

        } catch (IllegalArgumentException exception) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", exception.getMessage()));
        }
    }

    // Get all rooms
    @GetMapping
    public ResponseEntity<List<Room>> getAllRooms() {
        return ResponseEntity.ok(roomService.getAllRooms());
    }
}
