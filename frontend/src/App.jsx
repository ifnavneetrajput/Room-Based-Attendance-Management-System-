import { useEffect, useState } from "react";
import {
  getRooms,
  createRoom,
  getPeople,
  createPerson,
  markAttendance,
  getAttendanceReport,
} from "./api";
import "./App.css";

function App() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showRoomForm, setShowRoomForm] = useState(false);
  const [roomNumber, setRoomNumber] = useState("");
  const [creatingRoom, setCreatingRoom] = useState(false);
  const [roomMessage, setRoomMessage] = useState("");
  const [people, setPeople] = useState([]);
  const [showPersonForm, setShowPersonForm] = useState(false);
  const [personName, setPersonName] = useState("");
  const [personCode, setPersonCode] = useState("");
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [creatingPerson, setCreatingPerson] = useState(false);
  const [personMessage, setPersonMessage] = useState("");
  const [attendanceRoomId, setAttendanceRoomId] = useState("");
  const [attendanceStatuses, setAttendanceStatuses] = useState({});
  const [savingAttendance, setSavingAttendance] = useState({});
  const [attendanceMessage, setAttendanceMessage] = useState("");
  const [reportDate, setReportDate] = useState(
    new Date().toLocaleDateString("en-CA"),
  );
  const [reports, setReports] = useState([]);
  const [loadingReport, setLoadingReport] = useState(false);
  const [reportError, setReportError] = useState("");

  useEffect(() => {
    async function fetchRooms() {
      try {
        const data = await getRooms();
        setRooms(data);
        const peopleData = await getPeople();
        setPeople(peopleData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchRooms();
  }, []);


    async function handleCreateRoom(event) {
      event.preventDefault();

      const trimmedRoomNumber = roomNumber.trim();

      if (!trimmedRoomNumber) {
        setRoomMessage("Please enter a room number.");
        return;
      }

      try {
        setCreatingRoom(true);
        setRoomMessage("");

        await createRoom(trimmedRoomNumber);

        const updatedRooms = await getRooms();
        setRooms(updatedRooms);

        setRoomNumber("");
        setShowRoomForm(false);
        setRoomMessage("Room created successfully!");
      } catch (error) {
        setRoomMessage(error.message);
      } finally {
        setCreatingRoom(false);
      }
    }
  async function handleCreatePerson(event) {
    event.preventDefault();

    if (!personName.trim() || !personCode.trim() || !selectedRoomId) {
      setPersonMessage("Please fill in all fields.");
      return;
    }

    try {
      setCreatingPerson(true);
      setPersonMessage("");

      await createPerson({
        name: personName.trim(),
        personCode: personCode.trim(),
        roomId: Number(selectedRoomId),
      });

      const updatedPeople = await getPeople();
      setPeople(updatedPeople);

      setPersonName("");
      setPersonCode("");
      setSelectedRoomId("");
      setShowPersonForm(false);
      setPersonMessage("Person added successfully!");
    } catch (error) {
      setPersonMessage(error.message);
    } finally {
      setCreatingPerson(false);
    }
  }
  async function fetchAttendanceReport() {
    try {
      setLoadingReport(true);
      setReportError("");

      const data = await getAttendanceReport(reportDate);
      setReports(data);
    } catch (error) {
      setReportError(error.message);
    } finally {
      setLoadingReport(false);
    }
  }
  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white p-6 md:block">
        <h1 className="text-xl font-bold text-indigo-600">AttendEase</h1>

        <p className="mt-1 text-xs text-slate-500">Attendance Management</p>

        <nav className="mt-10 space-y-2">
          <div className="rounded-xl bg-indigo-50 px-4 py-3 font-semibold text-indigo-700">
            Dashboard
          </div>

          <div className="rounded-xl px-4 py-3 text-slate-600">Rooms</div>

          <div className="rounded-xl px-4 py-3 text-slate-600">People</div>

          <div className="rounded-xl px-4 py-3 text-slate-600">Attendance</div>

          <div className="rounded-xl px-4 py-3 text-slate-600">Reports</div>
        </nav>

        <div className="absolute bottom-6 left-6 right-6 rounded-xl bg-slate-50 p-4">
          <p className="text-sm font-semibold">Local System</p>
          <p className="mt-1 text-xs text-slate-500">
            Connected to your workspace
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="px-5 py-8 md:ml-64 md:px-10">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm text-slate-500">Workspace / Dashboard</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">
              Dashboard
            </h2>
            <p className="mt-2 text-slate-500">
              Manage your rooms and daily attendance.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <p className="text-xs text-slate-500">Today's date</p>
            <p className="mt-1 font-semibold">
              {new Date().toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        </header>

        {/* Statistics */}
        <section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Total Rooms" value={rooms.length} icon="🏢" />
          <StatCard title="Total People" value="—" icon="👥" />
          <StatCard title="Present Today" value="—" icon="✅" />
          <StatCard title="Absent Today" value="—" icon="📋" />
        </section>

        {/* Rooms */}
        <section className="mt-10">
          {showRoomForm && (
            <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold">Create a New Room</h3>

              <p className="mt-1 text-sm text-slate-500">
                Enter a unique room number.
              </p>

              <form onSubmit={handleCreateRoom} className="mt-5">
                <label
                  htmlFor="roomNumber"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Room Number
                </label>

                <input
                  id="roomNumber"
                  type="text"
                  value={roomNumber}
                  onChange={(event) => setRoomNumber(event.target.value)}
                  placeholder="e.g. 102"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:max-w-md"
                  required
                />

                <div className="mt-4 flex gap-3">
                  <button
                    type="submit"
                    disabled={creatingRoom}
                    className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {creatingRoom ? "Creating..." : "Save Room"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowRoomForm(false);
                      setRoomMessage("");
                    }}
                    className="rounded-xl border border-slate-300 px-5 py-3 font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {roomMessage && (
            <p
              role="status"
              className={`mb-5 rounded-xl p-4 text-sm ${
                roomMessage.toLowerCase().includes("successfully")
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {roomMessage}
            </p>
          )}
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-xl font-bold">Your Rooms</h3>
              <p className="mt-1 text-sm text-slate-500">
                View the rooms configured in your system.
              </p>
            </div>

            <button
              onClick={() => {
                setShowRoomForm(!showRoomForm);
                setRoomMessage("");
              }}
              className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-indigo-700"
            >
              + Create Room
            </button>

            <span className="w-fit rounded-lg bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700">
              {rooms.length} {rooms.length === 1 ? "Room" : "Rooms"}
            </span>
          </div>

          {loading && (
            <p className="mt-6 rounded-xl bg-white p-6 text-slate-500">
              Loading rooms...
            </p>
          )}

          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
              <p className="font-semibold">Couldn't load rooms</p>
              <p className="mt-1 text-sm">{error}</p>
              <p className="mt-2 text-sm">
                Make sure your Spring Boot backend is running.
              </p>
            </div>
          )}

          {!loading && !error && rooms.length === 0 && (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <div className="text-4xl">🏢</div>
              <h4 className="mt-4 font-semibold">No rooms yet</h4>
              <p className="mt-2 text-sm text-slate-500">
                Create a room to get started.
              </p>
            </div>
          )}

          {!loading && !error && rooms.length > 0 && (
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-2xl">
                      🏢
                    </div>

                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                      Active
                    </span>
                  </div>

                  <h4 className="mt-5 text-lg font-bold">
                    Room {room.roomNumber}
                  </h4>

                  <p className="mt-1 text-sm text-slate-500">
                    Room ID: {room.id}
                  </p>

                  <div className="mt-5 border-t border-slate-100 pt-4">
                    <p className="text-sm text-slate-500">
                      Attendance management
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* People Section */}
        <section className="mt-12">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-xl font-bold">People</h3>
              <p className="mt-1 text-sm text-slate-500">
                Register people and assign them to rooms.
              </p>
            </div>

            <button
              onClick={() => {
                setShowPersonForm(!showPersonForm);
                setPersonMessage("");
              }}
              className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
            >
              + Add Person
            </button>
          </div>

          {showPersonForm && (
            <form
              onSubmit={handleCreatePerson}
              className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h4 className="text-lg font-bold">Register a Person</h4>

              <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={personName}
                    onChange={(event) => setPersonName(event.target.value)}
                    placeholder="e.g. Aman Verma"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Person ID
                  </label>
                  <input
                    type="text"
                    value={personCode}
                    onChange={(event) => setPersonCode(event.target.value)}
                    placeholder="e.g. P002"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Assign Room
                  </label>
                  <select
                    value={selectedRoomId}
                    onChange={(event) => setSelectedRoomId(event.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    required
                  >
                    <option value="">Select a room</option>
                    {rooms.map((room) => (
                      <option key={room.id} value={room.id}>
                        Room {room.roomNumber}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-5 flex gap-3">
                <button
                  type="submit"
                  disabled={creatingPerson}
                  className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
                >
                  {creatingPerson ? "Adding..." : "Save Person"}
                </button>

                <button
                  type="button"
                  onClick={() => setShowPersonForm(false)}
                  className="rounded-xl border border-slate-300 px-5 py-3 font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {personMessage && (
            <p
              role="status"
              className={`mt-4 rounded-xl p-4 text-sm ${
                personMessage.toLowerCase().includes("successfully")
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {personMessage}
            </p>
          )}

          <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-medium">Person ID</th>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Room</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {people.map((person) => (
                  <tr key={person.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-indigo-700">
                      {person.personCode}
                    </td>
                    <td className="px-6 py-4">{person.name}</td>
                    <td className="px-6 py-4">
                      Room {person.roomNumber ?? person.room?.roomNumber ?? "—"}
                    </td>
                  </tr>
                ))}

                {people.length === 0 && (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-6 py-10 text-center text-slate-500"
                    >
                      No people registered yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
        {/* Attendance Section */}
        <section className="mt-12">
          <div>
            <h3 className="text-xl font-bold">Mark Attendance</h3>
            <p className="mt-1 text-sm text-slate-500">
              Select a room and mark each person's attendance.
            </p>
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <label
              htmlFor="attendanceRoom"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Select Room
            </label>

            <select
              id="attendanceRoom"
              value={attendanceRoomId}
              onChange={(event) => {
                setAttendanceRoomId(event.target.value);
                setAttendanceMessage("");
              }}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:max-w-md"
            >
              <option value="">Choose a room</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  Room {room.roomNumber}
                </option>
              ))}
            </select>

            {attendanceRoomId && (
              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-4 py-4 font-medium">Person</th>
                      <th className="px-4 py-4 font-medium">ID</th>
                      <th className="px-4 py-4 font-medium">Status</th>
                      <th className="px-4 py-4 font-medium">Action</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {people
                      .filter(
                        (person) =>
                          String(person.roomId ?? person.room?.id) ===
                          attendanceRoomId,
                      )
                      .map((person) => {
                        const status =
                          attendanceStatuses[person.id] || "PRESENT";

                        return (
                          <tr key={person.id} className="hover:bg-slate-50">
                            <td className="px-4 py-4 font-medium">
                              {person.name}
                            </td>

                            <td className="px-4 py-4 text-slate-500">
                              {person.personCode}
                            </td>

                            <td className="px-4 py-4">
                              <select
                                value={status}
                                onChange={(event) =>
                                  setAttendanceStatuses((previous) => ({
                                    ...previous,
                                    [person.id]: event.target.value,
                                  }))
                                }
                                className="rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-indigo-500"
                              >
                                <option value="PRESENT">Present</option>
                                <option value="ABSENT">Absent</option>
                                <option value="LATE">Late</option>
                              </select>
                            </td>

                            <td className="px-4 py-4">
                              <button
                                disabled={Boolean(savingAttendance[person.id])}
                                onClick={async () => {
                                  try {
                                    setSavingAttendance((previous) => ({
                                      ...previous,
                                      [person.id]: true,
                                    }));
                                    setAttendanceMessage("");

                                    await markAttendance({
                                      personId: person.id,
                                      roomId: Number(attendanceRoomId),
                                      observerId: 1,
                                      status,
                                    });

                                    setAttendanceMessage(
                                      `Attendance saved for ${person.name}.`,
                                    );
                                  } catch (error) {
                                    setAttendanceMessage(error.message);
                                  } finally {
                                    setSavingAttendance((previous) => ({
                                      ...previous,
                                      [person.id]: false,
                                    }));
                                  }
                                }}
                                className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                              >
                                {savingAttendance[person.id]
                                  ? "Saving..."
                                  : "Save"}
                              </button>
                            </td>
                          </tr>
                        );
                      })}

                    {people.filter(
                      (person) =>
                        String(person.roomId ?? person.room?.id) ===
                        attendanceRoomId,
                    ).length === 0 && (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-4 py-8 text-center text-slate-500"
                        >
                          No people are assigned to this room.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {attendanceMessage && (
              <p
                role="status"
                className="mt-5 rounded-xl bg-indigo-50 p-4 text-sm text-indigo-700"
              >
                {attendanceMessage}
              </p>
            )}
          </div>
        </section>
        {/* Reports Section */}
        <section className="mt-12 pb-12">
          <div>
            <h3 className="text-xl font-bold">Attendance Reports</h3>
            <p className="mt-1 text-sm text-slate-500">
              Review attendance statistics and absent people by room.
            </p>
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <label
                  htmlFor="reportDate"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Select Date
                </label>

                <input
                  id="reportDate"
                  type="date"
                  value={reportDate}
                  onChange={(event) => setReportDate(event.target.value)}
                  className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <button
                onClick={fetchAttendanceReport}
                disabled={loadingReport}
                className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
              >
                {loadingReport ? "Loading Report..." : "Generate Report"}
              </button>
            </div>

            {reportError && (
              <p className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">
                {reportError}
              </p>
            )}

            {reports.length > 0 && !reportError && (
              <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Rooms</p>
                  <p className="mt-2 text-2xl font-bold">{reports.length}</p>
                </div>

                <div className="rounded-xl bg-indigo-50 p-4">
                  <p className="text-sm text-slate-500">Total People</p>
                  <p className="mt-2 text-2xl font-bold text-indigo-700">
                    {reports.reduce(
                      (sum, report) => sum + report.totalPeople,
                      0,
                    )}
                  </p>
                </div>

                <div className="rounded-xl bg-emerald-50 p-4">
                  <p className="text-sm text-slate-500">Present</p>
                  <p className="mt-2 text-2xl font-bold text-emerald-700">
                    {reports.reduce(
                      (sum, report) => sum + report.presentCount,
                      0,
                    )}
                  </p>
                </div>

                <div className="rounded-xl bg-red-50 p-4">
                  <p className="text-sm text-slate-500">Absent</p>
                  <p className="mt-2 text-2xl font-bold text-red-700">
                    {reports.reduce(
                      (sum, report) => sum + report.absentCount,
                      0,
                    )}
                  </p>
                </div>

                <div className="rounded-xl bg-amber-50 p-4">
                  <p className="text-sm text-slate-500">Late</p>
                  <p className="mt-2 text-2xl font-bold text-amber-700">
                    {reports.reduce((sum, report) => sum + report.lateCount, 0)}
                  </p>
                </div>
              </div>
            )}

            {!loadingReport && reports.length === 0 && !reportError && (
              <p className="mt-6 rounded-xl bg-slate-50 p-5 text-sm text-slate-500">
                Select a date and generate a report to view attendance details.
              </p>
            )}

            {reports.length > 0 && !reportError && (
              <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-4 py-4 font-medium">Room</th>
                      <th className="px-4 py-4 font-medium">Total</th>
                      <th className="px-4 py-4 font-medium">Present</th>
                      <th className="px-4 py-4 font-medium">Absent</th>
                      <th className="px-4 py-4 font-medium">Late</th>
                      <th className="px-4 py-4 font-medium">Unmarked</th>
                      <th className="px-4 py-4 font-medium">Absent People</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {reports.map((report) => (
                      <tr key={report.roomId} className="hover:bg-slate-50">
                        <td className="px-4 py-4 font-semibold">
                          {report.roomNumber}
                        </td>

                        <td className="px-4 py-4">{report.totalPeople}</td>

                        <td className="px-4 py-4 font-medium text-emerald-700">
                          {report.presentCount}
                        </td>

                        <td className="px-4 py-4 font-medium text-red-700">
                          {report.absentCount}
                        </td>

                        <td className="px-4 py-4 font-medium text-amber-700">
                          {report.lateCount}
                        </td>

                        <td className="px-4 py-4">{report.unmarkedCount}</td>

                        <td className="px-4 py-4">
                          {report.absentPeople.length > 0 ? (
                            <ul className="space-y-1">
                              {report.absentPeople.map((person, index) => (
                                <li
                                  key={`${report.roomId}-${index}`}
                                  className="text-red-700"
                                >
                                  {person}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <span className="text-slate-400">None</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <span className="text-xl">{icon}</span>
      </div>

      <p className="mt-4 text-3xl font-bold">{value}</p>
    </div>
  );
}

export default App;
