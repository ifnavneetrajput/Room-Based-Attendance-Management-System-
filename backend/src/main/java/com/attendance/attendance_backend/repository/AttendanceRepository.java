
package com.attendance.attendance_backend.repository;

import com.attendance.attendance_backend.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository
        extends JpaRepository<Attendance, Long> {

    Optional<Attendance> findByPersonIdAndAttendanceDate(
            Long personId,
            LocalDate attendanceDate
    );

    List<Attendance> findByRoomIdAndAttendanceDate(
            Long roomId,
            LocalDate attendanceDate
    );

    List<Attendance> findByAttendanceDate(LocalDate attendanceDate);
}
