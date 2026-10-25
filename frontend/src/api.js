const API_BASE_URL = "http://localhost:8080/api";

export async function getRooms() {
  const response = await fetch(`${API_BASE_URL}/rooms`);

  if (!response.ok) {
    throw new Error("Failed to fetch rooms");
  }

  return response.json();
}

export async function getAttendanceReport(date) {
  const response = await fetch(
    `${API_BASE_URL}/attendance/report?date=${date}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch attendance report");
  }

  return response.json();
}

export async function createRoom(roomNumber) {
  const response = await fetch(`${API_BASE_URL}/rooms`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ roomNumber }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to create room");
  }

  return data;
}

export async function getPeople() {
  const response = await fetch(`${API_BASE_URL}/persons`);

  if (!response.ok) {
    throw new Error("Failed to fetch people");
  }

  return response.json();
}

export async function createPerson(person) {
  const response = await fetch(`${API_BASE_URL}/persons`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(person),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to add person");
  }

  return data;
}

export async function markAttendance({ personId, roomId, observerId, status }) {
  const response = await fetch(`${API_BASE_URL}/attendance`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personId,
      roomId,
      observerId,
      status,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to mark attendance");
  }

  return data;
}