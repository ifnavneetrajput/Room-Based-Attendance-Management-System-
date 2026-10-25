
package com.attendance.attendance_backend.service;
import com.attendance.attendance_backend.dto.RoomAttendanceReport;
import java.util.ArrayList;
import com.attendance.attendance_backend.entity.Attendance;
import com.attendance.attendance_backend.entity.Person;
import com.attendance.attendance_backend.entity.Room;
import com.attendance.attendance_backend.entity.User;
import com.attendance.attendance_backend.enums.AttendanceStatus;
import com.attendance.attendance_backend.repository.AttendanceRepository;
import com.attendance.attendance_backend.repository.PersonRepository;
import com.attendance.attendance_backend.repository.RoomRepository;
import com.attendance.attendance_backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final PersonRepository personRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;

    public AttendanceService(
            AttendanceRepository attendanceRepository,
            PersonRepository personRepository,
            RoomRepository roomRepository,
            UserRepository userRepository) {
        this.attendanceRepository = attendanceRepository;
        this.personRepository = personRepository;
        this.roomRepository = roomRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Attendance markAttendance(
            Long personId,
            Long roomId,
            AttendanceStatus status,
            Long observerId) {

        if (personId == null || roomId == null || observerId == null
                || status == null) {
            throw new IllegalArgumentException(
                    "Person, room, status, and observer are required");
        }

        Person person = personRepository.findById(personId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Person not found"));

        Room room = roomRepository.findById(roomId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Room not found"));

        if (!person.getRoom().getId().equals(roomId)) {
            throw new IllegalArgumentException(
                    "Person is not assigned to this room");
        }

        User observer = userRepository.findById(observerId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Observer not found"));

        LocalDate today = LocalDate.now();

        Attendance attendance = attendanceRepository
                .findByPersonIdAndAttendanceDate(personId, today)
                .orElseGet(Attendance::new);

        attendance.setPerson(person);
        attendance.setRoom(room);
        attendance.setAttendanceDate(today);
        attendance.setStatus(status);
        attendance.setMarkedBy(observer);
        attendance.setMarkedAt(LocalDateTime.now());

        return attendanceRepository.save(attendance);
    }

    public List<Attendance> getAttendanceByRoomAndDate(
            Long roomId,
        LocalDate date) {

      if (roomId == null || date == null) {
        throw new IllegalArgumentException(
            "Room ID and date are required");
      }

      if (!roomRepository.existsById(roomId)) {
        throw new IllegalArgumentException("Room not found");
      }

      return attendanceRepository
          .findByRoomIdAndAttendanceDate(roomId, date);
    }
    
public List<RoomAttendanceReport> getRoomAttendanceReport(
        LocalDate date) {

    if (date == null) {
        throw new IllegalArgumentException(
                "Attendance date is required");
    }

    List<RoomAttendanceReport> reports = new ArrayList<>();

    List<Room> rooms = roomRepository.findAll();

    for (Room room : rooms) {

        List<Person> persons =
                personRepository.findByRoomId(room.getId());

        List<Attendance> attendanceRecords =
                attendanceRepository.findByRoomIdAndAttendanceDate(
                        room.getId(), date);

        RoomAttendanceReport report = new RoomAttendanceReport();

        report.setRoomId(room.getId());
        report.setRoomNumber(room.getRoomNumber());
        report.setTotalPeople(persons.size());

        int present = 0;
        int absent = 0;
        int late = 0;

        List<String> absentPeople = new ArrayList<>();

        for (Attendance attendance : attendanceRecords) {

            switch (attendance.getStatus()) {

                case PRESENT:
                    present++;
                    break;

                case ABSENT:
                    absent++;

                    absentPeople.add(
                            attendance.getPerson().getName()
                            + " ("
                            + attendance.getPerson().getPersonCode()
                            + ")"
                    );
                    break;

                case LATE:
                    late++;
                    break;
            }
        }

        int marked = present + absent + late;
        int unmarked = persons.size() - marked;

        report.setPresentCount(present);
        report.setAbsentCount(absent);
        report.setLateCount(late);
        report.setUnmarkedCount(Math.max(0, unmarked));
        report.setAbsentPeople(absentPeople);

        reports.add(report);
    }

    return reports;
}

}
