const Service = require('../services/Service');
const { v4: uuidv4 } = require('uuid');

// In-memory data stores
const dataStore = {
  students: [
    { id: '1', name: 'Aarav Sharma', rollNumber: 'S001', classId: 'c1', email: 'aarav@school.com', phone: '9841000001', createdAt: new Date().toISOString() },
    { id: '2', name: 'Priya Thapa', rollNumber: 'S002', classId: 'c1', email: 'priya@school.com', phone: '9841000002', createdAt: new Date().toISOString() },
    { id: '3', name: 'Rohan Karki', rollNumber: 'S003', classId: 'c2', email: 'rohan@school.com', phone: '9841000003', createdAt: new Date().toISOString() },
    { id: '4', name: 'Sita Poudel', rollNumber: 'S004', classId: 'c2', email: 'sita@school.com', phone: '9841000004', createdAt: new Date().toISOString() },
    { id: '5', name: 'Bikash Rai', rollNumber: 'S005', classId: 'c1', email: 'bikash@school.com', phone: '9841000005', createdAt: new Date().toISOString() },
    { id: '6', name: 'Anita Gurung', rollNumber: 'S006', classId: 'c3', email: 'anita@school.com', phone: '9841000006', createdAt: new Date().toISOString() },
    { id: '7', name: 'Dipesh Magar', rollNumber: 'S007', classId: 'c3', email: 'dipesh@school.com', phone: '9841000007', createdAt: new Date().toISOString() },
    { id: '8', name: 'Kamala Bista', rollNumber: 'S008', classId: 'c2', email: 'kamala@school.com', phone: '9841000008', createdAt: new Date().toISOString() },
  ],
  attendance: [],
  classes: [
    { id: 'c1', name: 'Class 10-A', grade: '10', teacherName: 'Mr. Ram Bahadur', createdAt: new Date().toISOString() },
    { id: 'c2', name: 'Class 10-B', grade: '10', teacherName: 'Ms. Gita Devi', createdAt: new Date().toISOString() },
    { id: 'c3', name: 'Class 11-A', grade: '11', teacherName: 'Mr. Hari Prasad', createdAt: new Date().toISOString() },
  ],
};

// --- STUDENTS ---
const getStudents = async (req, res) => {
  try {
    const { classId } = req.query;
    let students = dataStore.students;
    if (classId) students = students.filter(s => s.classId === classId);
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createStudent = async (req, res) => {
  try {
    const student = { id: uuidv4(), ...req.body, createdAt: new Date().toISOString() };
    dataStore.students.push(student);
    res.status(201).json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getStudentById = async (req, res) => {
  const student = dataStore.students.find(s => s.id === req.params.id);
  if (!student) return res.status(404).json({ error: 'Student not found' });
  res.json(student);
};

const updateStudent = async (req, res) => {
  const idx = dataStore.students.findIndex(s => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Student not found' });
  dataStore.students[idx] = { ...dataStore.students[idx], ...req.body };
  res.json(dataStore.students[idx]);
};

const deleteStudent = async (req, res) => {
  const idx = dataStore.students.findIndex(s => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Student not found' });
  dataStore.students.splice(idx, 1);
  res.status(204).send();
};

// --- ATTENDANCE ---
const getAttendance = async (req, res) => {
  try {
    const { date, classId, studentId } = req.query;
    let records = dataStore.attendance;
    if (date) records = records.filter(a => a.date === date);
    if (classId) records = records.filter(a => a.classId === classId);
    if (studentId) records = records.filter(a => a.studentId === studentId);

    // Enrich with student data
    const enriched = records.map(record => {
      const student = dataStore.students.find(s => s.id === record.studentId);
      const cls = dataStore.classes.find(c => c.id === record.classId);
      return { ...record, studentName: student?.name, className: cls?.name };
    });

    res.json(enriched);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const markAttendance = async (req, res) => {
  try {
    const { studentId, classId, date, status, notes } = req.body;

    // Check if already exists
    const existingIdx = dataStore.attendance.findIndex(
      a => a.studentId === studentId && a.classId === classId && a.date === date
    );

    if (existingIdx !== -1) {
      dataStore.attendance[existingIdx] = {
        ...dataStore.attendance[existingIdx],
        status,
        notes,
        updatedAt: new Date().toISOString(),
      };
      return res.json(dataStore.attendance[existingIdx]);
    }

    const record = {
      id: uuidv4(),
      studentId,
      classId,
      date,
      status,
      notes: notes || '',
      createdAt: new Date().toISOString(),
    };
    dataStore.attendance.push(record);
    res.status(201).json(record);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateAttendance = async (req, res) => {
  const idx = dataStore.attendance.findIndex(a => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Record not found' });
  dataStore.attendance[idx] = { ...dataStore.attendance[idx], ...req.body, updatedAt: new Date().toISOString() };
  res.json(dataStore.attendance[idx]);
};

const getAttendanceStats = async (req, res) => {
  try {
    const total = dataStore.attendance.length;
    const present = dataStore.attendance.filter(a => a.status === 'present').length;
    const absent = dataStore.attendance.filter(a => a.status === 'absent').length;
    const late = dataStore.attendance.filter(a => a.status === 'late').length;
    const excused = dataStore.attendance.filter(a => a.status === 'excused').length;

    // Per student stats
    const studentStats = dataStore.students.map(student => {
      const records = dataStore.attendance.filter(a => a.studentId === student.id);
      const presentCount = records.filter(a => a.status === 'present').length;
      const totalCount = records.length;
      return {
        studentId: student.id,
        name: student.name,
        rollNumber: student.rollNumber,
        totalDays: totalCount,
        present: presentCount,
        absent: records.filter(a => a.status === 'absent').length,
        late: records.filter(a => a.status === 'late').length,
        percentage: totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0,
      };
    });

    res.json({
      overview: { total, present, absent, late, excused },
      studentStats,
      totalStudents: dataStore.students.length,
      totalClasses: dataStore.classes.length,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- CLASSES ---
const getClasses = async (req, res) => {
  res.json(dataStore.classes);
};

const createClass = async (req, res) => {
  const cls = { id: uuidv4(), ...req.body, createdAt: new Date().toISOString() };
  dataStore.classes.push(cls);
  res.status(201).json(cls);
};

const getClassById = async (req, res) => {
  const cls = dataStore.classes.find(c => c.id === req.params.id);
  if (!cls) return res.status(404).json({ error: 'Class not found' });
  res.json(cls);
};

const updateClass = async (req, res) => {
  const idx = dataStore.classes.findIndex(c => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Class not found' });
  dataStore.classes[idx] = { ...dataStore.classes[idx], ...req.body };
  res.json(dataStore.classes[idx]);
};

const deleteClass = async (req, res) => {
  const idx = dataStore.classes.findIndex(c => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Class not found' });
  dataStore.classes.splice(idx, 1);
  res.status(204).send();
};

module.exports = {
  attendanceRouter: {
    getStudents, createStudent, getStudentById, updateStudent, deleteStudent,
    getAttendance, markAttendance, updateAttendance, getAttendanceStats,
    getClasses, createClass, getClassById, updateClass, deleteClass,
  }
};
