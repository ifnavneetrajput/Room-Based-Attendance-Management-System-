
package com.attendance.attendance_backend.repository;

import com.attendance.attendance_backend.entity.Person;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PersonRepository extends JpaRepository<Person, Long> {

    Optional<Person> findByPersonCode(String personCode);

    boolean existsByPersonCode(String personCode);

    List<Person> findByRoomId(Long roomId);
}
