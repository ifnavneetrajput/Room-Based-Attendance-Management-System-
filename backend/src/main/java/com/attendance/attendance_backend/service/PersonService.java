
package com.attendance.attendance_backend.service;

import com.attendance.attendance_backend.entity.Person;
import com.attendance.attendance_backend.entity.Room;
import com.attendance.attendance_backend.repository.PersonRepository;
import com.attendance.attendance_backend.repository.RoomRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PersonService {

    private final PersonRepository personRepository;
    private final RoomRepository roomRepository;

    public PersonService(
            PersonRepository personRepository,
            RoomRepository roomRepository) {
        this.personRepository = personRepository;
        this.roomRepository = roomRepository;
    }

    // Add a person to a room
    public Person createPerson(
            String name,
            String personCode,
            Long roomId) {

        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Person name is required");
        }

        if (personCode == null || personCode.isBlank()) {
            throw new IllegalArgumentException("Person code is required");
        }

        if (roomId == null) {
            throw new IllegalArgumentException("Room ID is required");
        }

        name = name.trim();
        personCode = personCode.trim();

        if (personRepository.existsByPersonCode(personCode)) {
            throw new IllegalArgumentException(
                    "Person code already exists");
        }

        Room room = roomRepository.findById(roomId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Room not found"));

        Person person = new Person(name, personCode, room);

        return personRepository.save(person);
    }

    // Get all people
    public List<Person> getAllPersons() {
        return personRepository.findAll();
    }

    // Get people assigned to a particular room
    public List<Person> getPersonsByRoom(Long roomId) {
        if (!roomRepository.existsById(roomId)) {
            throw new IllegalArgumentException("Room not found");
        }

        return personRepository.findByRoomId(roomId);
    }
}
