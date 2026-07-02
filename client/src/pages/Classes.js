import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { apiClient } from '../hooks/useApi';

export default function Classes() {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editClass, setEditClass] = useState(null);
  const [form, setForm] = useState({ name: '', grade: '', teacherName: '' });

  const load = async () => {
    try {
      const [cRes, sRes] = await Promise.all([apiClient.get('/classes'), apiClient.get('/students')]);
      setClasses(cRes.data);
      setStudents(sRes.data);
    } catch (e) {
      toast.error('Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditClass(null);
    setForm({ name: '', grade: '', teacherName: '' });
    setShowModal(true);
  };

  const openEdit = (c) => {
    setEditClass(c);
    setForm({ name: c.name, grade: c.grade, teacherName: c.teacherName || '' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.grade) return toast.error('Name and grade are required');
    try {
      if (editClass) {
        await apiClient.put(`/classes/${editClass.id}`, form);
        toast.success('Class updated!');
      } else {
        await apiClient.post('/classes', form);
        toast.success('Class created!');
      }
      setShowModal(false);
      load();
    } catch (e) {
      toast.error('Failed to save');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete ${name}?`)) return;
    try {
      await apiClient.delete(`/classes/${id}`);
      toast.success('Class deleted');
      load();
    } catch (e) {
      toast.error('Failed to delete');
    }
  };

  const getStudentCount = (classId) => students.filter(s => s.classId === classId).length;

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">Classes</h1>
          <p className="page-subtitle">{classes.length} active sections</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Class</button>
      </div>

      {loading ? <div className="loading">Loading classes...</div> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {classes.map(c => (
            <div key={c.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-cyan))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.2rem'
                }}>⬟</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-outline btn-sm" onClick={() => openEdit(c)}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c.id, c.name)}>×</button>
                </div>
              </div>

              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 4 }}>{c.name}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: 16 }}>
                Grade {c.grade} • {c.teacherName || 'No teacher assigned'}
              </p>

              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent-blue)' }}>
                    {getStudentCount(c.id)}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Students
                  </div>
                </div>
              </div>
            </div>
          ))}
          {classes.length === 0 && (
            <div className="empty-state" style={{ gridColumn: '1/-1' }}>
              <div className="empty-state-icon">⬟</div>
              <div>No classes yet. Add your first class!</div>
            </div>
          )}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <h2 className="modal-title">{editClass ? 'Edit Class' : 'Add New Class'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Class Name *</label>
                <input className="form-input" placeholder="e.g. Class 10-A" value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Grade *</label>
                  <input className="form-input" placeholder="e.g. 10" value={form.grade}
                    onChange={e => setForm({ ...form, grade: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Teacher Name</label>
                  <input className="form-input" placeholder="Teacher's name" value={form.teacherName}
                    onChange={e => setForm({ ...form, teacherName: e.target.value })} />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editClass ? 'Update' : 'Create Class'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
