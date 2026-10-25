
package com.attendance.attendance_backend.service;

import com.attendance.attendance_backend.entity.Room;
import com.attendance.attendance_backend.repository.RoomRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoomService {

    private final RoomRepository roomRepository;

    public RoomService(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    // Create a new room
    public Room createRoom(String roomNumber) {

        if (roomNumber == null || roomNumber.isBlank()) {
            throw new IllegalArgumentException("Room number is required");
        }

        roomNumber = roomNumber.trim();

        if (roomRepository.existsByRoomNumber(roomNumber)) {
            throw new IllegalArgumentException("Room already exists");
        }

        Room room = new Room(roomNumber);

        return roomRepository.save(room);
    }

    // Get all rooms
    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }
}
