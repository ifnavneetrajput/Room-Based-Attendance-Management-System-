
package com.attendance.attendance_backend.dto;

import java.util.List;

public class RoomAttendanceReport {

    private Long roomId;
    private String roomNumber;

    private int totalPeople;
    private int presentCount;
    private int absentCount;
    private int lateCount;
    private int unmarkedCount;

    private List<String> absentPeople;

    public RoomAttendanceReport() {
    }

    public Long getRoomId() {
        return roomId;
    }

    public void setRoomId(Long roomId) {
        this.roomId = roomId;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }

    public int getTotalPeople() {
        return totalPeople;
    }

    public void setTotalPeople(int totalPeople) {
        this.totalPeople = totalPeople;
    }

    public int getPresentCount() {
        return presentCount;
    }

    public void setPresentCount(int presentCount) {
        this.presentCount = presentCount;
    }

    public int getAbsentCount() {
        return absentCount;
    }

    public void setAbsentCount(int absentCount) {
        this.absentCount = absentCount;
    }

    public int getLateCount() {
        return lateCount;
    }

    public void setLateCount(int lateCount) {
        this.lateCount = lateCount;
    }

    public int getUnmarkedCount() {
        return unmarkedCount;
    }

    public void setUnmarkedCount(int unmarkedCount) {
        this.unmarkedCount = unmarkedCount;
    }

    public List<String> getAbsentPeople() {
        return absentPeople;
    }

    public void setAbsentPeople(List<String> absentPeople) {
        this.absentPeople = absentPeople;
    }
}
