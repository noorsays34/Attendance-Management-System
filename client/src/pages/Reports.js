import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { apiClient } from '../hooks/useApi';

export default function Reports() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('name');
  const [sortDir, setSortDir] = useState('asc');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiClient.get('/attendance/stats');
        setStats(res.data);
      } catch (e) {
        toast.error('Failed to load reports');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSort = (col) => {
    if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(col); setSortDir('asc'); }
  };

  const sorted = stats?.studentStats ? [...stats.studentStats].sort((a, b) => {
    let av = a[sortBy], bv = b[sortBy];
    if (typeof av === 'string') av = av.toLowerCase(), bv = bv.toLowerCase();
    return sortDir === 'asc' ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
  }) : [];

  const getGrade = (pct) => {
    if (pct >= 90) return { label: 'Excellent', color: 'var(--accent-green)' };
    if (pct >= 75) return { label: 'Good', color: 'var(--accent-cyan)' };
    if (pct >= 60) return { label: 'Average', color: 'var(--accent-amber)' };
    return { label: 'Poor', color: 'var(--accent-red)' };
  };

  if (loading) return <div className="loading">Loading reports...</div>;

  const overview = stats?.overview || {};
  const total = overview.total || 0;
  const overallPct = total > 0 ? Math.round((overview.present / total) * 100) : 0;

  const SortTh = ({ col, children }) => (
    <th style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => handleSort(col)}>
      {children} {sortBy === col ? (sortDir === 'asc' ? '↑' : '↓') : ''}
    </th>
  );

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Reports & Analytics</h1>
        <p className="page-subtitle">Comprehensive attendance analysis</p>
      </div>

      <div className="grid-4" style={{ marginBottom: 32 }}>
        {[
          { label: 'Overall Rate', value: `${overallPct}%`, color: 'blue' },
          { label: 'Total Records', value: total, color: 'cyan' },
          { label: 'Present', value: overview.present || 0, color: 'green' },
          { label: 'Absent', value: overview.absent || 0, color: 'red' },
        ].map(item => (
          <div key={item.label} className="card" style={{ textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 3,
              background: `var(--accent-${item.color})`
            }} />
            <div style={{ fontSize: '2rem', fontWeight: 700, color: `var(--accent-${item.color})`, letterSpacing: '-0.03em' }}>
              {item.value}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>
              {item.label}
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 20 }}>Overall Attendance Rate</h2>
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>School-wide average</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: overallPct >= 75 ? 'var(--accent-green)' : 'var(--accent-red)' }}>
              {overallPct}%
            </span>
          </div>
          <div style={{ height: 12, background: 'var(--border)', borderRadius: 6, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 6,
              width: `${overallPct}%`,
              background: overallPct >= 75
                ? 'linear-gradient(90deg, var(--accent-green), var(--accent-cyan))'
                : 'linear-gradient(90deg, var(--accent-red), var(--accent-amber))',
              transition: 'width 1s ease',
            }} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {[
            { label: 'Excellent (≥90%)', color: 'var(--accent-green)', count: sorted.filter(s => s.percentage >= 90).length },
            { label: 'Good (75-89%)', color: 'var(--accent-cyan)', count: sorted.filter(s => s.percentage >= 75 && s.percentage < 90).length },
            { label: 'Average (60-74%)', color: 'var(--accent-amber)', count: sorted.filter(s => s.percentage >= 60 && s.percentage < 75).length },
            { label: 'Poor (<60%)', color: 'var(--accent-red)', count: sorted.filter(s => s.percentage < 60).length },
          ].map(item => (
            <div key={item.label} style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px',
              background: 'var(--bg-secondary)', borderRadius: 6, border: '1px solid var(--border)'
            }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color }} />
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.label}</span>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600 }}>Student-wise Attendance</h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{sorted.length} students • Click headers to sort</span>
        </div>

        {sorted.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">◉</div>
            <div>No attendance data yet. Start marking attendance!</div>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <SortTh col="name">Student</SortTh>
                <SortTh col="rollNumber">Roll No.</SortTh>
                <SortTh col="totalDays">Total Days</SortTh>
                <SortTh col="present">Present</SortTh>
                <SortTh col="absent">Absent</SortTh>
                <SortTh col="late">Late</SortTh>
                <SortTh col="percentage">Rate</SortTh>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(s => {
                const grade = getGrade(s.percentage);
                return (
                  <tr key={s.studentId}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                          background: `linear-gradient(135deg, ${grade.color}88, ${grade.color}44)`,
                          border: `1px solid ${grade.color}44`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.75rem', fontWeight: 600, color: grade.color,
                        }}>{s.name[0]}</div>
                        <span style={{ fontWeight: 500 }}>{s.name}</span>
                      </div>
                    </td>
                    <td><code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{s.rollNumber}</code></td>
                    <td style={{ color: 'var(--text-secondary)' }}>{s.totalDays}</td>
                    <td style={{ color: 'var(--accent-green)', fontWeight: 500 }}>{s.present}</td>
                    <td style={{ color: 'var(--accent-red)', fontWeight: 500 }}>{s.absent}</td>
                    <td style={{ color: 'var(--accent-amber)', fontWeight: 500 }}>{s.late}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 50, height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${s.percentage}%`, background: grade.color, borderRadius: 3 }} />
                        </div>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: grade.color, minWidth: 36 }}>
                          {s.percentage}%
                        </span>
                      </div>
                    </td>
                    <td>
                      <span style={{
                        padding: '3px 10px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 600,
                        background: `${grade.color}18`, color: grade.color, border: `1px solid ${grade.color}33`
                      }}>{grade.label}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
