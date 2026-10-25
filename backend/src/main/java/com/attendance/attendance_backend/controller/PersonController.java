
package com.attendance.attendance_backend.controller;

import com.attendance.attendance_backend.entity.Person;
import com.attendance.attendance_backend.service.PersonService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/persons")
public class PersonController {

    private final PersonService personService;

    public PersonController(PersonService personService) {
        this.personService = personService;
    }

    // Add a person to a room
    @PostMapping
    public ResponseEntity<?> createPerson(
            @RequestBody Map<String, Object> request) {
        try {
            String name = (String) request.get("name");
            String personCode = (String) request.get("personCode");
            Object roomIdValue = request.get("roomId");

            if (!(roomIdValue instanceof Number)) {
                throw new IllegalArgumentException(
                        "A valid room ID is required");
            }

            Long roomId = ((Number) roomIdValue).longValue();

            Person person = personService.createPerson(
                    name, personCode, roomId);

            Map<String, Object> response = Map.of(
                    "id", person.getId(),
                    "name", person.getName(),
                    "personCode", person.getPersonCode(),
                    "roomId", person.getRoom().getId(),
                    "roomNumber", person.getRoom().getRoomNumber()
            );

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(response);

        } catch (IllegalArgumentException exception) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", exception.getMessage()));
        }
    }

    // Get all people
    @GetMapping
    public ResponseEntity<List<Person>> getAllPersons() {
        return ResponseEntity.ok(personService.getAllPersons());
    }

    // Get people assigned to a particular room
    @GetMapping("/room/{roomId}")
    public ResponseEntity<?> getPersonsByRoom(
            @PathVariable Long roomId) {
        try {
            return ResponseEntity.ok(
                    personService.getPersonsByRoom(roomId));
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", exception.getMessage()));
        }
    }
}
