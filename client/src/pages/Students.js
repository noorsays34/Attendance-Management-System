import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { apiClient } from '../hooks/useApi';

export default function Students() {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const [search, setSearch] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [form, setForm] = useState({ name: '', rollNumber: '', classId: '', email: '', phone: '' });

  const load = async () => {
    try {
      const [sRes, cRes] = await Promise.all([apiClient.get('/students'), apiClient.get('/classes')]);
      setStudents(sRes.data);
      setClasses(cRes.data);
    } catch (e) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditStudent(null);
    setForm({ name: '', rollNumber: '', classId: '', email: '', phone: '' });
    setShowModal(true);
  };

  const openEdit = (s) => {
    setEditStudent(s);
    setForm({ name: s.name, rollNumber: s.rollNumber, classId: s.classId, email: s.email || '', phone: s.phone || '' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.rollNumber || !form.classId) {
      toast.error('Please fill all required fields');
      return;
    }
    try {
      if (editStudent) {
        await apiClient.put(`/students/${editStudent.id}`, form);
        toast.success('Student updated!');
      } else {
        await apiClient.post('/students', form);
        toast.success('Student added!');
      }
      setShowModal(false);
      load();
    } catch (e) {
      toast.error(e.response?.data?.error || 'Failed to save');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete ${name}?`)) return;
    try {
      await apiClient.delete(`/students/${id}`);
      toast.success('Student removed');
      load();
    } catch (e) {
      toast.error('Failed to delete');
    }
  };

  const filtered = students.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(search.toLowerCase());
    const matchClass = !filterClass || s.classId === filterClass;
    return matchSearch && matchClass;
  });

  const getClassName = (classId) => classes.find(c => c.id === classId)?.name || classId;

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">Students</h1>
          <p className="page-subtitle">{students.length} students enrolled</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Student</button>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <input
            className="form-input"
            style={{ flex: 1, minWidth: 200 }}
            placeholder="Search by name or roll number..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="form-select"
            style={{ width: 200 }}
            value={filterClass}
            onChange={e => setFilterClass(e.target.value)}
          >
            <option value="">All Classes</option>
            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div className="loading">Loading students...</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">◈</div>
            <div>No students found</div>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Roll No.</th>
                <th>Class</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                        background: `linear-gradient(135deg, var(--accent-blue), var(--accent-purple))`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.8rem', fontWeight: 600
                      }}>{s.name[0]}</div>
                      <span style={{ fontWeight: 500 }}>{s.name}</span>
                    </div>
                  </td>
                  <td><code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{s.rollNumber}</code></td>
                  <td>
                    <span className="badge" style={{ background: 'rgba(59,130,246,0.1)', color: 'var(--accent-blue)', border: '1px solid rgba(59,130,246,0.2)' }}>
                      {getClassName(s.classId)}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>{s.email || '—'}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{s.phone || '—'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-outline btn-sm" onClick={() => openEdit(s)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s.id, s.name)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <h2 className="modal-title">{editStudent ? 'Edit Student' : 'Add New Student'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input className="form-input" placeholder="Student name" value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Roll Number *</label>
                  <input className="form-input" placeholder="e.g. S001" value={form.rollNumber}
                    onChange={e => setForm({ ...form, rollNumber: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Class *</label>
                <select className="form-select" value={form.classId}
                  onChange={e => setForm({ ...form, classId: e.target.value })}>
                  <option value="">Select Class</option>
                  {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input className="form-input" type="email" placeholder="Email address" value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input className="form-input" placeholder="Phone number" value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })} />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editStudent ? 'Update' : 'Add Student'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
