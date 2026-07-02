import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { apiClient } from '../hooks/useApi';

const STATUS_OPTIONS = ['present', 'absent', 'late', 'excused'];

export default function Attendance() {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [markMap, setMarkMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState('mark');

  useEffect(() => {
    const load = async () => {
      try {
        const [cRes] = await Promise.all([apiClient.get('/classes')]);
        setClasses(cRes.data);
        if (cRes.data.length > 0) setSelectedClass(cRes.data[0].id);
      } catch (e) {
        toast.error('Failed to load classes');
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!selectedClass) return;
    const load = async () => {
      setLoading(true);
      try {
        const [sRes, aRes] = await Promise.all([
          apiClient.get('/students', { classId: selectedClass }),
          apiClient.get('/attendance', { classId: selectedClass, date: selectedDate }),
        ]);
        setStudents(sRes.data);
        // Prefill existing attendance
        const map = {};
        sRes.data.forEach(s => { map[s.id] = 'present'; });
        aRes.data.forEach(a => { map[a.studentId] = a.status; });
        setMarkMap(map);
      } catch (e) {
        toast.error('Failed to load');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [selectedClass, selectedDate]);

  useEffect(() => {
    if (tab !== 'history') return;
    const load = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get('/attendance', {
          classId: selectedClass || undefined,
        });
        setAttendance(res.data.reverse());
      } catch (e) {
        toast.error('Failed to load history');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [tab, selectedClass]);

  const handleMark = (studentId, status) => {
    setMarkMap(prev => ({ ...prev, [studentId]: status }));
  };

  const handleMarkAll = (status) => {
    const map = {};
    students.forEach(s => { map[s.id] = status; });
    setMarkMap(map);
  };

  const handleSave = async () => {
    if (!selectedClass) return toast.error('Select a class');
    setSaving(true);
    try {
      await Promise.all(students.map(s =>
        apiClient.post('/attendance', {
          studentId: s.id,
          classId: selectedClass,
          date: selectedDate,
          status: markMap[s.id] || 'present',
        })
      ));
      toast.success('Attendance saved!');
    } catch (e) {
      toast.error('Failed to save attendance');
    } finally {
      setSaving(false);
    }
  };

  const statusColor = { present: 'green', absent: 'red', late: 'amber', excused: 'purple' };
  const presentCount = Object.values(markMap).filter(v => v === 'present').length;
  const absentCount = Object.values(markMap).filter(v => v === 'absent').length;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Attendance</h1>
        <p className="page-subtitle">Mark and track daily attendance</p>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {['mark', 'history'].map(t => (
          <button key={t} className={`btn ${tab === t ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setTab(t)}>
            {t === 'mark' ? '✓ Mark Attendance' : '◉ History'}
          </button>
        ))}
      </div>

      {tab === 'mark' && (
        <>
          <div className="card" style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <div className="form-group" style={{ margin: 0, flex: 1, minWidth: 180 }}>
                <label className="form-label">Class</label>
                <select className="form-select" value={selectedClass} onChange={e => setSelectedClass(e.target.value)}>
                  {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ margin: 0, flex: 1, minWidth: 180 }}>
                <label className="form-label">Date</label>
                <input type="date" className="form-input" value={selectedDate}
                  onChange={e => setSelectedDate(e.target.value)} />
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-success btn-sm" onClick={() => handleMarkAll('present')}>All Present</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleMarkAll('absent')}>All Absent</button>
              </div>
            </div>
          </div>

          {students.length > 0 && (
            <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
              <div className="card" style={{ flex: 1, textAlign: 'center', padding: 16 }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-green)' }}>{presentCount}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Present</div>
              </div>
              <div className="card" style={{ flex: 1, textAlign: 'center', padding: 16 }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-red)' }}>{absentCount}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Absent</div>
              </div>
              <div className="card" style={{ flex: 1, textAlign: 'center', padding: 16 }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-blue)' }}>{students.length}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Total</div>
              </div>
            </div>
          )}

          <div className="card">
            {loading ? <div className="loading">Loading students...</div> :
              students.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">◈</div>
                  <div>No students in this class</div>
                </div>
              ) : (
                <>
                  <table>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Student</th>
                        <th>Roll No.</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((s, i) => (
                        <tr key={s.id}>
                          <td style={{ color: 'var(--text-muted)', width: 40 }}>{i + 1}</td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div style={{
                                width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                                background: `linear-gradient(135deg, var(--accent-${statusColor[markMap[s.id]] || 'blue'}), var(--accent-cyan))`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '0.8rem', fontWeight: 600
                              }}>{s.name[0]}</div>
                              <span style={{ fontWeight: 500 }}>{s.name}</span>
                            </div>
                          </td>
                          <td><code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{s.rollNumber}</code></td>
                          <td>
                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                              {STATUS_OPTIONS.map(status => (
                                <button
                                  key={status}
                                  onClick={() => handleMark(s.id, status)}
                                  className="btn btn-sm"
                                  style={{
                                    background: markMap[s.id] === status
                                      ? status === 'present' ? 'var(--accent-green)'
                                        : status === 'absent' ? 'var(--accent-red)'
                                        : status === 'late' ? 'var(--accent-amber)'
                                        : 'var(--accent-purple)'
                                      : 'var(--bg-secondary)',
                                    color: markMap[s.id] === status ? '#fff' : 'var(--text-muted)',
                                    border: '1px solid var(--border)',
                                    padding: '4px 10px',
                                    fontSize: '0.75rem',
                                    textTransform: 'capitalize',
                                  }}
                                >
                                  {status}
                                </button>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
                    <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                      {saving ? 'Saving...' : '✓ Save Attendance'}
                    </button>
                  </div>
                </>
              )
            }
          </div>
        </>
      )}

      {tab === 'history' && (
        <div className="card">
          <div style={{ marginBottom: 16 }}>
            <select className="form-select" style={{ width: 200 }} value={selectedClass}
              onChange={e => setSelectedClass(e.target.value)}>
              <option value="">All Classes</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          {loading ? <div className="loading">Loading...</div> :
            attendance.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">◉</div>
                <div>No attendance records</div>
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Student</th>
                    <th>Class</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map(a => (
                    <tr key={a.id}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{a.date}</td>
                      <td>{a.studentName || a.studentId}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{a.className || a.classId}</td>
                      <td><span className={`badge badge-${a.status}`}>{a.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          }
        </div>
      )}
    </div>
  );
}
