const schoolsController = require('../controllers/SchoolsController');
const controllers = require('../controllers/index');

function setupRoutes(app) {
  const BASE = '/api/v1';
  const r = controllers.attendanceRouter;

  // ── Schools ──────────────────────────────────────────────
  app.get(`${BASE}/schools`, schoolsController.getSchools);
  app.post(`${BASE}/schools`, schoolsController.createSchool);
  app.get(`${BASE}/schools/:id`, schoolsController.getSchoolById);
  app.put(`${BASE}/schools/:id`, schoolsController.updateSchool);
  app.delete(`${BASE}/schools/:id`, schoolsController.deleteSchool);

  // ── Students ─────────────────────────────────────────────
  app.get(`${BASE}/students`, r.getStudents);
  app.post(`${BASE}/students`, r.createStudent);
  app.get(`${BASE}/students/:id`, r.getStudentById);
  app.put(`${BASE}/students/:id`, r.updateStudent);
  app.delete(`${BASE}/students/:id`, r.deleteStudent);

  // ── Attendance (static routes BEFORE param routes) ───────
  app.get(`${BASE}/attendance/stats`, r.getAttendanceStats);  // must be first
  app.get(`${BASE}/attendance`, r.getAttendance);
  app.post(`${BASE}/attendance`, r.markAttendance);
  app.put(`${BASE}/attendance/:id`, r.updateAttendance);

  // ── Classes ───────────────────────────────────────────────
  app.get(`${BASE}/classes`, r.getClasses);
  app.post(`${BASE}/classes`, r.createClass);
  app.get(`${BASE}/classes/:id`, r.getClassById);
  app.put(`${BASE}/classes/:id`, r.updateClass);
  app.delete(`${BASE}/classes/:id`, r.deleteClass);
}

module.exports = { setupRoutes };
