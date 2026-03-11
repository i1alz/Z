import React, { useState, useEffect } from 'react';
import {
  FiUsers, FiCalendar, FiUserPlus, FiBriefcase,
  FiCreditCard, FiBarChart2, FiCheckCircle, FiChevronRight,
  FiEye, FiActivity, FiBell
} from 'react-icons/fi';

// ═══════════════════════════════════════════════
// SVG Donut Chart - matches HR1 exactly
// ═══════════════════════════════════════════════
function AttendanceDonut({ present, absent, onLeave, language }) {
  const total = present + absent + onLeave;
  const pct = Math.round((present / total) * 100);
  const r = 70;
  const circ = 2 * Math.PI * r;
  const presentArc = (present / total) * circ;
  const absentArc  = (absent  / total) * circ;
  const leaveArc   = (onLeave / total) * circ;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem', flexWrap: 'wrap' }}>
      {/* Donut */}
      <div style={{ position: 'relative', width: 180, height: 180, flexShrink: 0 }}>
        <svg width="180" height="180" style={{ transform: 'rotate(-90deg)' }}>
          {/* bg ring */}
          <circle cx="90" cy="90" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="22" />
          {/* present - gold */}
          <circle cx="90" cy="90" r={r} fill="none"
            stroke="#d4a574" strokeWidth="22"
            strokeDasharray={`${presentArc} ${circ - presentArc}`}
            strokeDashoffset={0} strokeLinecap="round"
          />
          {/* absent - dark */}
          <circle cx="90" cy="90" r={r} fill="none"
            stroke="#3a2520" strokeWidth="22"
            strokeDasharray={`${absentArc} ${circ - absentArc}`}
            strokeDashoffset={-presentArc} strokeLinecap="round"
          />
          {/* leave - red */}
          <circle cx="90" cy="90" r={r} fill="none"
            stroke="#9b0d16" strokeWidth="22"
            strokeDasharray={`${leaveArc} ${circ - leaveArc}`}
            strokeDashoffset={-(presentArc + absentArc)} strokeLinecap="round"
          />
        </svg>
        {/* Center text */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)', textAlign: 'center',
        }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#d4a574', lineHeight: 1 }}>{pct}%</div>
          <div style={{ fontSize: '0.65rem', color: 'rgba(212,165,116,0.8)', marginTop: '0.25rem', fontWeight: 600 }}>
            {language === 'ar' ? 'نسبة الحضور' : 'Attendance Rate'}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {[
          { label: language === 'ar' ? 'حاضر' : 'Present',  val: present, color: '#d4a574' },
          { label: language === 'ar' ? 'غائب' : 'Absent',   val: absent,  color: '#3a2520' },
          { label: language === 'ar' ? 'إجازة' : 'On Leave', val: onLeave, color: '#9b0d16' },
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 14, height: 14, borderRadius: '50%', background: item.color, border: '2px solid rgba(212,165,116,0.3)', flexShrink: 0 }} />
            <span style={{ color: 'rgba(245,230,211,0.85)', fontSize: '0.95rem', fontWeight: 500, flex: 1 }}>{item.label}</span>
            <span style={{ color: '#d4a574', fontSize: '1.1rem', fontWeight: 800, minWidth: 30, textAlign: 'right' }}>{item.val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// Main HRDashboard Component
// ═══════════════════════════════════════════════
export default function HRDashboard({ theme, language, isDarkMode }) {
  const [attendancePeriod, setAttendancePeriod] = useState(language === 'ar' ? 'هذا الشهر' : 'This Month');
  const [animIn, setAnimIn] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimIn(true), 50);
    return () => clearTimeout(t);
  }, []);

  // ───── Data ─────
  const userName  = language === 'ar' ? 'زيد العزام' : 'Zaid Al-Azzam';
  const userTitle = language === 'ar' ? 'مدير الموارد البشرية' : 'HR Manager';

  const attendance = { present: 215, absent: 18, onLeave: 15 };

  const recentEmployees = [
    { name: language === 'ar' ? 'أحمد الفارسي'  : 'Ahmed Al-Farsi',  pos: language === 'ar' ? 'مسؤول HR'          : 'HR Officer',         dept: language === 'ar' ? 'الموارد البشرية' : 'Human Resources', date: '2/04/2023' },
    { name: language === 'ar' ? 'ريم الحربي'    : 'Reem Al-Harbi',   pos: language === 'ar' ? 'متخصصة توظيف'      : 'Recruiter',          dept: language === 'ar' ? 'التوظيف'          : 'Recruitment',      date: '2/00/2023' },
    { name: language === 'ar' ? 'عمر آل سعود'   : 'Omar AL Saud',    pos: language === 'ar' ? 'متخصص رواتب'       : 'Payroll Specialist', dept: language === 'ar' ? 'المالية'          : 'Finance',          date: '2/04/2023' },
  ];

  const upcomingLeaves = [
    { name: language === 'ar' ? 'مها الزهراني'     : 'Maha Al-Zahrani',   period: '23 – 26 Apr' },
    { name: language === 'ar' ? 'فيصل القحطاني'    : 'Faisal Al-Qahtani', period: '23 – 25 Apr' },
  ];

  const quickActions = [
    { label: language === 'ar' ? 'الموظفين\nإضافة موظف' : 'Employees\nإضافة موظف',    icon: FiUsers,     color: '#7d0a12' },
    { label: language === 'ar' ? 'التوظيف\nالتوظيفة'   : 'Recruitment\nالتوظيفة',      icon: FiUserPlus,  color: '#7d0a12' },
    { label: language === 'ar' ? 'الأداء\nإدارة الأداء' : 'Performance\nإدارة الأداء', icon: FiBarChart2, color: '#7d0a12' },
    { label: language === 'ar' ? 'الرواتب\nإدارة الرواتب' : 'Payroll\nإدارة الرواتب', icon: FiCreditCard, color: '#7d0a12' },
  ];

  // ───── Styles ─────
  const card = {
    background: 'linear-gradient(145deg, #2a1f18 0%, #1f1611 100%)',
    borderRadius: '16px',
    border: '1px solid rgba(212,165,116,0.18)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.45)',
    overflow: 'hidden',
  };

  return (
    <div style={{
      opacity: animIn ? 1 : 0,
      transform: animIn ? 'translateY(0)' : 'translateY(16px)',
      transition: 'all 0.5s ease',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
    }}>

      {/* ── Row 1: Welcome + Stats ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '1.25rem', alignItems: 'stretch' }}>

        {/* Welcome Card */}
        <div style={{
          ...card,
          padding: '2rem 2.5rem',
          position: 'relative',
          background: 'linear-gradient(135deg, #2a1f18 0%, #3a2520 50%, #2a1f18 100%)',
          overflow: 'hidden',
        }}>
          {/* Gold leaf decoration */}
          <div style={{
            position: 'absolute', top: 0, right: language === 'ar' ? 'auto' : 0, left: language === 'ar' ? 0 : 'auto',
            width: 180, height: '100%', opacity: 0.12,
            background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 300'%3E%3Cpath d='M100 20 Q140 60 120 120 Q160 100 180 150 Q140 160 120 200 Q150 220 140 280 Q100 250 80 200 Q40 230 30 280 Q20 220 60 200 Q40 160 0 150 Q20 100 60 120 Q40 60 100 20Z' fill='%23d4a574'/%3E%3C/svg%3E") center/contain no-repeat`,
            pointerEvents: 'none',
          }} />
          {/* Gold corner ornament circles */}
          <div style={{ position: 'absolute', top: -40, right: language === 'ar' ? 'auto' : -40, left: language === 'ar' ? -40 : 'auto', width: 150, height: 150, borderRadius: '50%', background: 'rgba(212,165,116,0.06)', pointerEvents: 'none' }} />

          <h2 style={{
            margin: 0,
            fontSize: '2.4rem',
            fontWeight: 900,
            color: '#f5e6d3',
            letterSpacing: '-0.5px',
            lineHeight: 1.2,
          }}>
            {language === 'ar' ? `مرحباً، ${userName}` : `Welcome, ${userName}`}
          </h2>
          <p style={{ margin: '0.6rem 0 0', color: 'rgba(212,165,116,0.85)', fontSize: '1.05rem', fontWeight: 500 }}>
            {language === 'ar' ? 'أدر فريقك بكفاءة' : 'Manage your team efficiently'}
          </p>
          <div style={{
            display: 'inline-block',
            marginTop: '1.25rem',
            background: 'linear-gradient(135deg, #7d0a12, #9b0d16)',
            borderRadius: '8px',
            padding: '0.4rem 1.1rem',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: '#f5e6d3',
          }}>
            {userTitle}
          </div>
        </div>

        {/* Total Employees */}
        <div style={{
          ...card,
          padding: '2rem',
          minWidth: 180,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          justifyContent: 'center',
          background: 'linear-gradient(145deg, #2a1f18 0%, #221813 100%)',
        }}>
          <p style={{ margin: 0, color: 'rgba(212,165,116,0.7)', fontSize: '0.85rem', fontWeight: 600, textAlign: 'right' }}>
            {language === 'ar' ? 'إجمالي الموظفين' : 'Total Employees'}
          </p>
          <p style={{ margin: 0, color: 'rgba(212,165,116,0.55)', fontSize: '0.75rem', marginTop: '0.2rem', textAlign: 'right' }}>
            {language === 'ar' ? 'إجمالي الموظفين' : 'إجمالي الموظفين'}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.75rem' }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #221813, #3a2520)', border: '2px solid rgba(212,165,116,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FiUsers size={22} color="#d4a574" />
            </div>
            <span style={{ fontSize: '3rem', fontWeight: 900, color: '#f5e6d3', lineHeight: 1 }}>248</span>
          </div>
          <div style={{ width: '100%', height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, marginTop: '1rem', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: '75%', background: 'linear-gradient(90deg, #7d0a12, #d4a574)', borderRadius: 2 }} />
          </div>
        </div>

        {/* New Hires */}
        <div style={{
          ...card,
          padding: '2rem',
          minWidth: 160,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          justifyContent: 'center',
          background: 'linear-gradient(145deg, #2a1f18 0%, #221813 100%)',
        }}>
          <p style={{ margin: 0, color: 'rgba(212,165,116,0.7)', fontSize: '0.85rem', fontWeight: 600, textAlign: 'right' }}>
            {language === 'ar' ? 'موظفون جدد' : 'New Hires'}
          </p>
          <p style={{ margin: 0, color: 'rgba(212,165,116,0.55)', fontSize: '0.75rem', marginTop: '0.2rem', textAlign: 'right' }}>
            {language === 'ar' ? 'موظفون جدد' : 'موظفون جدد'}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.75rem' }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #221813, #3a2520)', border: '2px solid rgba(212,165,116,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FiUserPlus size={22} color="#d4a574" />
            </div>
            <span style={{ fontSize: '3rem', fontWeight: 900, color: '#f5e6d3', lineHeight: 1 }}>12</span>
          </div>
          <div style={{ width: '100%', height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, marginTop: '1rem', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: '30%', background: 'linear-gradient(90deg, #d4a574, #f5d9b8)', borderRadius: 2 }} />
          </div>
        </div>
      </div>

      {/* ── Row 2: Attendance + Quick Actions ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>

        {/* Attendance Overview */}
        <div style={{ ...card, padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#f5e6d3' }}>
              {language === 'ar' ? 'نظرة عامة على الحضور' : 'Attendance Overview'}
              <span style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(212,165,116,0.6)', fontWeight: 500, marginTop: '0.15rem' }}>
                {language === 'ar' ? 'نظرة عامة على الحضور' : 'نظرة عامة على الحضور'}
              </span>
            </h3>
            <button style={{
              background: 'rgba(212,165,116,0.1)',
              border: '1px solid rgba(212,165,116,0.25)',
              borderRadius: '8px',
              padding: '0.4rem 0.9rem',
              color: '#d4a574',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontFamily: 'inherit',
            }}>
              {language === 'ar' ? 'هذا الشهر' : 'This Month'} ▾
            </button>
          </div>
          <AttendanceDonut {...attendance} language={language} />
        </div>

        {/* Quick Actions */}
        <div style={{ ...card, padding: '2rem' }}>
          <h3 style={{ margin: '0 0 1.5rem', fontSize: '1.15rem', fontWeight: 800, color: '#f5e6d3' }}>
            {language === 'ar' ? 'إجراءات سريعة' : 'Quick Actions'}
            <span style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(212,165,116,0.6)', fontWeight: 500, marginTop: '0.15rem' }}>
              {language === 'ar' ? 'إجراءات سريعة' : 'إجراءات سريعة'}
            </span>
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', height: 'calc(100% - 80px)' }}>
            {quickActions.map((action, i) => {
              const Icon = action.icon;
              const [line1, line2] = action.label.split('\n');
              return (
                <div
                  key={i}
                  style={{
                    background: 'linear-gradient(145deg, #3a1a1a, #2a1210)',
                    border: '1px solid rgba(155,13,22,0.35)',
                    borderRadius: '14px',
                    padding: '1.25rem',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.6rem',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    textAlign: 'center',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'linear-gradient(145deg, #4a1f1f, #3a1515)';
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 12px 30px rgba(155,13,22,0.3)';
                    e.currentTarget.style.borderColor = 'rgba(212,165,116,0.5)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'linear-gradient(145deg, #3a1a1a, #2a1210)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = 'rgba(155,13,22,0.35)';
                  }}
                >
                  <div style={{
                    width: 48, height: 48, borderRadius: '12px',
                    background: 'linear-gradient(135deg, #7d0a12, #9b0d16)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 15px rgba(155,13,22,0.4)',
                  }}>
                    <Icon size={22} color="#f5e6d3" />
                  </div>
                  <div>
                    <p style={{ margin: 0, color: '#f5e6d3', fontWeight: 700, fontSize: '0.9rem' }}>{line1}</p>
                    <p style={{ margin: 0, color: 'rgba(212,165,116,0.65)', fontSize: '0.75rem', marginTop: '0.15rem' }}>{line2}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Row 3: Recent Employees + Upcoming Leaves ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '1.25rem' }}>

        {/* Recent Employees Table */}
        <div style={{ ...card, padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#f5e6d3' }}>
              {language === 'ar' ? 'الموظفون الجدد' : 'Recent Employees'}
              <span style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(212,165,116,0.6)', fontWeight: 500, marginTop: '0.1rem' }}>
                {language === 'ar' ? 'Recent Employees' : 'الموظفون الجدد'}
              </span>
            </h3>
            <button style={{
              background: 'transparent', border: '1px solid rgba(212,165,116,0.3)',
              borderRadius: '8px', padding: '0.4rem 0.9rem',
              color: '#d4a574', fontSize: '0.8rem', fontWeight: 600,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem',
              fontFamily: 'inherit',
            }}>
              <FiEye size={14} /> {language === 'ar' ? 'عرض الكل' : 'View All'}
            </button>
          </div>

          {/* Table Header */}
          <div style={{
            display: 'grid', gridTemplateColumns: '2fr 1.5fr 1.5fr 1fr',
            padding: '0.6rem 1rem', borderRadius: '8px',
            background: 'rgba(212,165,116,0.08)',
            marginBottom: '0.5rem',
          }}>
            {[
              language === 'ar' ? 'الاسم' : 'Name',
              language === 'ar' ? 'المسمى' : 'Position',
              language === 'ar' ? 'القسم' : 'Department',
              language === 'ar' ? 'التاريخ' : 'View All',
            ].map((h, i) => (
              <span key={i} style={{ color: 'rgba(212,165,116,0.7)', fontSize: '0.78rem', fontWeight: 700, textAlign: i === 3 ? 'center' : 'inherit' }}>{h}</span>
            ))}
          </div>

          {/* Table Rows */}
          {recentEmployees.map((emp, i) => (
            <div
              key={i}
              style={{
                display: 'grid', gridTemplateColumns: '2fr 1.5fr 1.5fr 1fr',
                padding: '0.9rem 1rem',
                borderBottom: i < recentEmployees.length - 1 ? '1px solid rgba(212,165,116,0.08)' : 'none',
                alignItems: 'center',
                transition: 'background 0.2s',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,165,116,0.05)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            >
              {/* Avatar + Name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: 38, height: 38, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #7d0a12, #3a1a1a)',
                  border: '1.5px solid rgba(212,165,116,0.35)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.8rem', fontWeight: 700, color: '#d4a574', flexShrink: 0,
                }}>
                  {emp.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <span style={{ color: '#f5e6d3', fontWeight: 600, fontSize: '0.9rem' }}>{emp.name}</span>
              </div>
              <span style={{ color: 'rgba(245,230,211,0.7)', fontSize: '0.85rem' }}>{emp.pos}</span>
              <span style={{ color: 'rgba(245,230,211,0.7)', fontSize: '0.85rem' }}>{emp.dept}</span>
              <div style={{ textAlign: 'center' }}>
                <span style={{
                  background: 'rgba(212,165,116,0.12)', color: '#d4a574',
                  padding: '0.25rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600,
                }}>{emp.date}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Upcoming Leaves */}
        <div style={{ ...card, padding: '2rem' }}>
          <h3 style={{ margin: '0 0 1.5rem', fontSize: '1.15rem', fontWeight: 800, color: '#f5e6d3' }}>
            {language === 'ar' ? 'الإجازات القادمة' : 'Upcoming Leaves'}
            <span style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(212,165,116,0.6)', fontWeight: 500, marginTop: '0.1rem' }}>
              {language === 'ar' ? 'Upcoming Leaves' : 'الإجازات القادمة'}
            </span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {upcomingLeaves.map((lv, i) => (
              <div
                key={i}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '1rem 1.25rem',
                  background: 'linear-gradient(135deg, rgba(125,10,18,0.2), rgba(42,31,24,0.5))',
                  borderRadius: '12px',
                  border: '1px solid rgba(155,13,22,0.25)',
                  cursor: 'pointer',
                  transition: 'all 0.25s',
                  borderLeft: '3px solid #9b0d16',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(212,165,116,0.4)'; e.currentTarget.style.background = 'rgba(212,165,116,0.07)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(155,13,22,0.25)'; e.currentTarget.style.background = 'linear-gradient(135deg, rgba(125,10,18,0.2), rgba(42,31,24,0.5))'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #7d0a12, #3a1a1a)', border: '1.5px solid rgba(212,165,116,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <FiCalendar size={16} color="#d4a574" />
                  </div>
                  <span style={{ color: '#f5e6d3', fontWeight: 600, fontSize: '0.88rem' }}>{lv.name}</span>
                </div>
                <span style={{ color: 'rgba(212,165,116,0.85)', fontSize: '0.82rem', fontWeight: 600, background: 'rgba(212,165,116,0.1)', padding: '0.25rem 0.6rem', borderRadius: '6px' }}>{lv.period}</span>
              </div>
            ))}
          </div>

          {/* Stats cards at bottom */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '1.5rem' }}>
            {[
              { label: language === 'ar' ? 'أيام الإجازة المتبقية' : 'Days Remaining', value: '18', color: '#d4a574' },
              { label: language === 'ar' ? 'طلبات معلقة' : 'Pending Requests', value: '5', color: '#9b0d16' },
            ].map((s, i) => (
              <div key={i} style={{ background: 'rgba(212,165,116,0.06)', borderRadius: '10px', padding: '0.9rem', border: `1px solid ${s.color}25`, textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(212,165,116,0.65)', marginTop: '0.2rem', fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Global animation */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}