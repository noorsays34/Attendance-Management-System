import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../components/StatCard';
import { apiClient } from '../hooks/useApi';
import './Dashboard.css';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentAttendance, setRecentAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, attendanceRes] = await Promise.all([
          apiClient.get('/attendance/stats'),
          apiClient.get('/attendance'),
        ]);
        setStats(statsRes.data);
        setRecentAttendance(attendanceRes.data.slice(-10).reverse());
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="loading">Loading dashboard...</div>;

  const overview = stats?.overview || {};
  const total = overview.total || 0;
  const presentPct = total > 0 ? Math.round((overview.present / total) * 100) : 0;

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="grid-4" style={{ marginBottom: 32 }}>
        <StatCard title="Total Students" value={stats?.totalStudents || 0} subtitle="Enrolled" color="blue" icon="◈" />
        <StatCard title="Present Today" value={overview.present || 0} subtitle={`${presentPct}% attendance rate`} color="green" icon="✓" />
        <StatCard title="Absent Today" value={overview.absent || 0} subtitle="Need follow-up" color="red" icon="✗" />
        <StatCard title="Classes" value={stats?.totalClasses || 0} subtitle="Active sections" color="purple" icon="⬟" />
      </div>

      <div className="dashboard-grid">
        <div className="card" style={{ flex: 2 }}>
          <div className="card-header">
            <h2 className="card-title">Student Attendance Overview</h2>
            <button className="btn btn-outline btn-sm" onClick={() => navigate('/reports')}>
              View Full Report →
            </button>
          </div>
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Roll No.</th>
                <th>Present</th>
                <th>Absent</th>
                <th>Rate</th>
              </tr>
            </thead>
            <tbody>
              {stats?.studentStats?.slice(0, 8).map(s => (
                <tr key={s.studentId}>
                  <td>
                    <div className="student-cell">
                      <div className="student-avatar">{s.name[0]}</div>
                      {s.name}
                    </div>
                  </td>
                  <td><code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{s.rollNumber}</code></td>
                  <td style={{ color: 'var(--accent-green)' }}>{s.present}</td>
                  <td style={{ color: 'var(--accent-red)' }}>{s.absent}</td>
                  <td>
                    <div className="rate-cell">
                      <div className="rate-bar">
                        <div className="rate-fill" style={{
                          width: `${s.percentage}%`,
                          background: s.percentage >= 75 ? 'var(--accent-green)' : s.percentage >= 50 ? 'var(--accent-amber)' : 'var(--accent-red)'
                        }} />
                      </div>
                      <span className="rate-text" style={{
                        color: s.percentage >= 75 ? 'var(--accent-green)' : s.percentage >= 50 ? 'var(--accent-amber)' : 'var(--accent-red)'
                      }}>{s.percentage}%</span>
                    </div>
                  </td>
                </tr>
              ))}
              {(!stats?.studentStats || stats.studentStats.length === 0) && (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 32 }}>No attendance records yet</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <h2 className="card-title" style={{ marginBottom: 16 }}>Quick Actions</h2>
            <div className="quick-actions">
              <button className="quick-action-btn" onClick={() => navigate('/attendance')}>
                <span className="qa-icon qa-blue">✓</span>
                <span>Mark Attendance</span>
              </button>
              <button className="quick-action-btn" onClick={() => navigate('/students')}>
                <span className="qa-icon qa-purple">+</span>
                <span>Add Student</span>
              </button>
              <button className="quick-action-btn" onClick={() => navigate('/reports')}>
                <span className="qa-icon qa-cyan">◉</span>
                <span>View Reports</span>
              </button>
              <button className="quick-action-btn" onClick={() => navigate('/classes')}>
                <span className="qa-icon qa-green">⬟</span>
                <span>Manage Classes</span>
              </button>
            </div>
          </div>

          <div className="card">
            <h2 className="card-title" style={{ marginBottom: 16 }}>Attendance Breakdown</h2>
            <div className="breakdown-list">
              {[
                { label: 'Present', value: overview.present || 0, color: 'var(--accent-green)' },
                { label: 'Absent', value: overview.absent || 0, color: 'var(--accent-red)' },
                { label: 'Late', value: overview.late || 0, color: 'var(--accent-amber)' },
                { label: 'Excused', value: overview.excused || 0, color: 'var(--accent-purple)' },
              ].map(item => (
                <div key={item.label} className="breakdown-item">
                  <div className="breakdown-dot" style={{ background: item.color }} />
                  <span className="breakdown-label">{item.label}</span>
                  <span className="breakdown-value">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
