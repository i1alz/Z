import React, { useState, useEffect } from 'react';
import {
  FiUsers, FiCalendar, FiClock, FiDollarSign, FiFileText,
  FiCheckCircle, FiUserCheck, FiUserX, FiBriefcase,
  FiPhone, FiMail, FiSearch, FiPlus, FiDownload,
  FiChevronRight, FiTrendingUp, FiAward, FiClipboard,
  FiPieChart, FiEdit, FiEye, FiStar, FiTarget,
  FiUserPlus, FiCreditCard, FiAlertCircle
} from 'react-icons/fi';

// ═══════════════════════════════════════════════
// Brand Colors - Eatemad Official Palette
// ═══════════════════════════════════════════════
const Colors = {
  bronze: "#995d26",
  bronzeDark: "#7a4a1e",
  bronzeLight: "#b37840",
  gold: "#d4a574",
  goldLight: "#e8c9a0",
  goldDark: "#b8935f",
  darkRed: "#7d0a12",
  red: "#9b0d16",
  redLight: "#b91a23",
  bgDark: "#0a0806",
  bgPrimary: "#1a1512",
  bgSecondary: "#1c1410",
  bgCard: "#221a15",
  bgCardHover: "#2d231c",
  success: "#22c55e",
  warning: "#f59e0b",
  error: "#ef4444",
  info: "#3b82f6",
};

// ═══════════════════════════════════════════════
// SVG Donut Chart Component
// ═══════════════════════════════════════════════
function AttendanceDonut({ present, absent, onLeave, isDarkMode, language }) {
  const total = present + absent + onLeave;
  const percentage = Math.round((present / total) * 100);
  
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  
  const presentArc = (present / total) * circumference;
  const absentArc = (absent / total) * circumference;
  const leaveArc = (onLeave / total) * circumference;
  
  const presentOffset = 0;
  const absentOffset = presentArc;
  const leaveOffset = presentArc + absentArc;

  return (
    <div style={{ position: 'relative', width: '220px', height: '220px', margin: '0 auto' }}>
      <svg width="220" height="220" viewBox="0 0 220 220">
        {/* Background circle */}
        <circle
          cx="110" cy="110" r={radius}
          fill="none"
          stroke={isDarkMode ? 'rgba(212,165,116,0.1)' : '#f0f0f0'}
          strokeWidth="24"
        />
        {/* Present arc */}
        <circle
          cx="110" cy="110" r={radius}
          fill="none"
          stroke={Colors.darkRed}
          strokeWidth="24"
          strokeDasharray={`${presentArc} ${circumference - presentArc}`}
          strokeDashoffset={-presentOffset}
          strokeLinecap="round"
          transform="rotate(-90 110 110)"
          style={{ transition: 'all 1s ease-out' }}
        />
        {/* Absent arc */}
        <circle
          cx="110" cy="110" r={radius}
          fill="none"
          stroke={isDarkMode ? '#333' : '#666'}
          strokeWidth="24"
          strokeDasharray={`${absentArc} ${circumference - absentArc}`}
          strokeDashoffset={-absentOffset}
          strokeLinecap="round"
          transform="rotate(-90 110 110)"
          style={{ transition: 'all 1s ease-out' }}
        />
        {/* On Leave arc */}
        <circle
          cx="110" cy="110" r={radius}
          fill="none"
          stroke={Colors.gold}
          strokeWidth="24"
          strokeDasharray={`${leaveArc} ${circumference - leaveArc}`}
          strokeDashoffset={-leaveOffset}
          strokeLinecap="round"
          transform="rotate(-90 110 110)"
          style={{ transition: 'all 1s ease-out' }}
        />
      </svg>
      {/* Center Text */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
      }}>
        <div style={{
          fontSize: '2.5rem',
          fontWeight: 900,
          color: Colors.darkRed,
          lineHeight: 1,
        }}>
          {percentage}%
        </div>
        <div style={{
          fontSize: '0.8rem',
          color: isDarkMode ? '#a89580' : '#666',
          marginTop: '4px',
          fontWeight: 600,
        }}>
          {language === 'ar' ? 'نسبة الحضور' : 'Attendance Rate'}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// Main HR Dashboard Component
// ═══════════════════════════════════════════════
function HRDashboard({ language = 'ar', isDarkMode = true, theme }) {
  const [animateIn, setAnimateIn] = useState(false);
  const [selectedTab, setSelectedTab] = useState('overview');

  useEffect(() => {
    setTimeout(() => setAnimateIn(true), 100);
  }, []);

  const isRTL = language === 'ar';

  // HR Manager data
  const hrManager = {
    name: language === 'ar' ? 'أكرم قاسم' : 'Akram Qasim',
    role: language === 'ar' ? 'مدير الموارد البشرية' : 'HR Manager',
    avatar: 'AQ',
  };

  // Theme colors
  const t = {
    bg: isDarkMode ? Colors.bgPrimary : '#f8f9fa',
    card: isDarkMode ? Colors.bgCard : '#ffffff',
    cardHover: isDarkMode ? Colors.bgCardHover : '#f5f5f5',
    text: isDarkMode ? '#e8d5c4' : '#1a1a1c',
    textMuted: isDarkMode ? '#a89580' : '#6b6c70',
    border: isDarkMode ? 'rgba(212,165,116,0.2)' : 'rgba(153,93,38,0.15)',
    accent: isDarkMode ? Colors.gold : Colors.bronze,
    accentLight: isDarkMode ? Colors.goldLight : Colors.bronzeLight,
    surface: isDarkMode ? Colors.bgPrimary : '#faf8f5',
    shadow: isDarkMode ? '0 8px 32px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.08)',
    glass: isDarkMode ? 'rgba(34,26,21,0.8)' : 'rgba(255,255,255,0.9)',
  };

  // Sample data
  const recentEmployees = [
    { name: 'Ahmed Al-Farsi', nameAr: 'أحمد الفارسي', position: 'HR Officer', positionAr: 'مسؤول موارد بشرية', department: 'Human Resources', departmentAr: 'الموارد البشرية', date: '2/04/2026', avatar: 'AF' },
    { name: 'Reem Al-Harbi', nameAr: 'ريم الحربي', position: 'Recruiter', positionAr: 'أخصائي توظيف', department: 'Recruitment', departmentAr: 'التوظيف', date: '2/04/2026', avatar: 'RH' },
    { name: 'Omar Al-Saud', nameAr: 'عمر آل سعود', position: 'Payroll Specialist', positionAr: 'أخصائي رواتب', department: 'Finance', departmentAr: 'المالية', date: '20/03/2026', avatar: 'OS' },
    { name: 'Layla Ibrahim', nameAr: 'ليلى إبراهيم', position: 'Training Coordinator', positionAr: 'منسق تدريب', department: 'Development', departmentAr: 'التطوير', date: '15/03/2026', avatar: 'LI' },
    { name: 'Hassan Al-Qahtani', nameAr: 'حسن القحطاني', position: 'IT Support', positionAr: 'دعم تقنية المعلومات', department: 'IT', departmentAr: 'تقنية المعلومات', date: '10/03/2026', avatar: 'HQ' },
  ];

  const upcomingLeaves = [
    { name: 'Maha Al-Zahrani', nameAr: 'مها الزهراني', dates: '23 - 26 Apr', datesAr: '23 - 26 أبريل', type: 'Annual', typeAr: 'سنوية', avatar: 'MZ' },
    { name: 'Faisal Al-Qahtani', nameAr: 'فيصل القحطاني', dates: '23 - 25 Apr', datesAr: '23 - 25 أبريل', type: 'Sick', typeAr: 'مرضية', avatar: 'FQ' },
    { name: 'Noura Al-Salem', nameAr: 'نورة السالم', dates: '28 - 30 Apr', datesAr: '28 - 30 أبريل', type: 'Personal', typeAr: 'شخصية', avatar: 'NS' },
  ];

  const quickActions = [
    { label: language === 'ar' ? 'الموظفين' : 'Employees', labelSub: language === 'ar' ? 'إدارة الموظفين' : 'Manage staff', icon: FiUsers, color: Colors.darkRed },
    { label: language === 'ar' ? 'التوظيف' : 'Recruitment', labelSub: language === 'ar' ? 'التوظيف' : 'Recruiting', icon: FiUserPlus, color: Colors.bronze },
    { label: language === 'ar' ? 'التقييمات' : 'Performance', labelSub: language === 'ar' ? 'إدارة الأداء' : 'Reviews', icon: FiTarget, color: Colors.info },
    { label: language === 'ar' ? 'الرواتب' : 'Payroll', labelSub: language === 'ar' ? 'إدارة الرواتب' : 'Salary mgmt', icon: FiCreditCard, color: Colors.success },
  ];

  return (
    <div style={{
      animation: animateIn ? 'fadeIn 0.6s ease' : 'none',
      opacity: animateIn ? 1 : 0,
      direction: isRTL ? 'rtl' : 'ltr',
      fontFamily: isRTL ? "'Cairo', 'Tajawal', sans-serif" : "'Inter', 'Segoe UI', sans-serif",
    }}>
      {/* ═══ Welcome Banner ═══ */}
      <div style={{
        background: `linear-gradient(135deg, ${Colors.bgCard} 0%, ${isDarkMode ? '#2a1f18' : '#f9f5f0'} 50%, ${Colors.bgCard} 100%)`,
        borderRadius: '24px',
        padding: '2rem 2.5rem',
        marginBottom: '2rem',
        border: `1px solid ${t.border}`,
        boxShadow: t.shadow,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem',
      }}>
        {/* Decorative background elements */}
        <div style={{
          position: 'absolute',
          top: -60,
          [isRTL ? 'left' : 'right']: -40,
          width: '200px',
          height: '200px',
          background: `radial-gradient(circle, ${t.accent}15 0%, transparent 70%)`,
          borderRadius: '50%',
        }} />
        <div style={{
          position: 'absolute',
          bottom: -30,
          [isRTL ? 'right' : 'left']: '30%',
          width: '120px',
          height: '120px',
          background: `radial-gradient(circle, ${Colors.darkRed}10 0%, transparent 70%)`,
          borderRadius: '50%',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: `linear-gradient(135deg, ${Colors.darkRed}, ${Colors.red})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 800,
              fontSize: '1.2rem',
              boxShadow: `0 8px 24px ${Colors.darkRed}40`,
            }}>
              {hrManager.avatar}
            </div>
            <div>
              <h2 style={{
                fontSize: '1.8rem',
                fontWeight: 800,
                margin: 0,
                color: t.text,
              }}>
                {language === 'ar' ? `مرحباً، ${hrManager.name}` : `Welcome, ${hrManager.name}`}
              </h2>
              <p style={{
                margin: 0,
                color: t.textMuted,
                fontSize: '1rem',
                fontWeight: 500,
              }}>
                {language === 'ar' ? 'أدر فريقك بكفاءة' : 'Manage your team efficiently'}
              </p>
            </div>
          </div>
        </div>

        {/* Stats in welcome banner */}
        <div style={{ display: 'flex', gap: '1.5rem', position: 'relative', zIndex: 1, flexWrap: 'wrap' }}>
          {/* Total Employees */}
          <div style={{
            background: t.glass,
            backdropFilter: 'blur(12px)',
            borderRadius: '16px',
            padding: '1.25rem 1.75rem',
            border: `1px solid ${t.border}`,
            minWidth: '140px',
            textAlign: 'center',
            transition: 'all 0.3s',
          }}>
            <p style={{ margin: 0, fontSize: '0.85rem', color: t.textMuted, marginBottom: '0.5rem' }}>
              {language === 'ar' ? 'إجمالي الموظفين' : 'Total Employees'}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <span style={{
                fontSize: '2.2rem',
                fontWeight: 900,
                color: t.text,
              }}>248</span>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: `${Colors.info}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <FiUsers size={16} style={{ color: Colors.info }} />
              </div>
            </div>
          </div>

          {/* New Hires */}
          <div style={{
            background: t.glass,
            backdropFilter: 'blur(12px)',
            borderRadius: '16px',
            padding: '1.25rem 1.75rem',
            border: `1px solid ${t.border}`,
            minWidth: '140px',
            textAlign: 'center',
            transition: 'all 0.3s',
          }}>
            <p style={{ margin: 0, fontSize: '0.85rem', color: t.textMuted, marginBottom: '0.5rem' }}>
              {language === 'ar' ? 'موظفون جدد' : 'New Hires'}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <span style={{
                fontSize: '2.2rem',
                fontWeight: 900,
                color: t.text,
              }}>12</span>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: `${Colors.success}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <FiUserPlus size={16} style={{ color: Colors.success }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Main Content Grid ═══ */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1.75rem',
        marginBottom: '1.75rem',
      }}>
        {/* ═══ Attendance Overview ═══ */}
        <div style={{
          background: t.card,
          borderRadius: '20px',
          padding: '1.75rem',
          border: `1px solid ${t.border}`,
          boxShadow: t.shadow,
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
          }}>
            <h3 style={{
              margin: 0,
              fontSize: '1.2rem',
              fontWeight: 700,
              color: t.text,
            }}>
              {language === 'ar' ? 'نظرة عامة على الحضور' : 'Attendance Overview'}
            </h3>
            <select style={{
              background: t.surface,
              border: `1px solid ${t.border}`,
              borderRadius: '10px',
              padding: '0.4rem 0.75rem',
              color: t.text,
              fontSize: '0.85rem',
              cursor: 'pointer',
              outline: 'none',
              fontFamily: 'inherit',
            }}>
              <option>{language === 'ar' ? 'هذا الشهر' : 'This Month'}</option>
              <option>{language === 'ar' ? 'الأسبوع' : 'This Week'}</option>
            </select>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
          }}>
            <AttendanceDonut
              present={215}
              absent={18}
              onLeave={15}
              isDarkMode={isDarkMode}
              language={language}
            />
            
            <div style={{ flex: 1 }}>
              {[
                { label: language === 'ar' ? 'حاضر' : 'Present', value: 215, color: Colors.darkRed, dot: Colors.darkRed },
                { label: language === 'ar' ? 'غائب' : 'Absent', value: 18, color: isDarkMode ? '#555' : '#666', dot: isDarkMode ? '#555' : '#666' },
                { label: language === 'ar' ? 'إجازة' : 'On Leave', value: 15, color: Colors.gold, dot: Colors.gold },
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 0',
                  borderBottom: i < 2 ? `1px solid ${t.border}` : 'none',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: item.dot,
                    }} />
                    <span style={{ color: t.textMuted, fontSize: '0.95rem' }}>{item.label}</span>
                  </div>
                  <span style={{
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    color: t.text,
                  }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══ Quick Actions ═══ */}
        <div style={{
          background: t.card,
          borderRadius: '20px',
          padding: '1.75rem',
          border: `1px solid ${t.border}`,
          boxShadow: t.shadow,
        }}>
          <h3 style={{
            margin: 0,
            fontSize: '1.2rem',
            fontWeight: 700,
            color: t.text,
            marginBottom: '1.5rem',
          }}>
            {language === 'ar' ? 'إجراءات سريعة' : 'Quick Actions'}
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
          }}>
            {quickActions.map((action, i) => {
              const Icon = action.icon;
              return (
                <button
                  key={i}
                  style={{
                    background: t.surface,
                    border: `1px solid ${t.border}`,
                    borderRadius: '16px',
                    padding: '1.25rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    textAlign: isRTL ? 'right' : 'left',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = `0 12px 28px ${action.color}20`;
                    e.currentTarget.style.borderColor = action.color;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = t.border;
                  }}
                >
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: `${action.color}18`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '0.75rem',
                  }}>
                    <Icon size={22} style={{ color: action.color }} />
                  </div>
                  <div style={{
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    color: t.text,
                    marginBottom: '0.25rem',
                  }}>
                    {action.label}
                  </div>
                  <div style={{
                    fontSize: '0.8rem',
                    color: t.textMuted,
                  }}>
                    {action.labelSub}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ═══ Second Row: Recent Employees + Upcoming Leaves ═══ */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.6fr 1fr',
        gap: '1.75rem',
        marginBottom: '1.75rem',
      }}>
        {/* ═══ Recent Employees Table ═══ */}
        <div style={{
          background: t.card,
          borderRadius: '20px',
          padding: '1.75rem',
          border: `1px solid ${t.border}`,
          boxShadow: t.shadow,
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
          }}>
            <h3 style={{
              margin: 0,
              fontSize: '1.2rem',
              fontWeight: 700,
              color: t.text,
            }}>
              {language === 'ar' ? 'الموظفون الجدد' : 'Recent Employees'}
            </h3>
            <button style={{
              background: 'transparent',
              border: 'none',
              color: t.accent,
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontFamily: 'inherit',
            }}>
              {language === 'ar' ? 'عرض الكل' : 'View All'}
              <FiChevronRight size={16} style={{ transform: isRTL ? 'rotate(180deg)' : 'none' }} />
            </button>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{
                  borderBottom: `2px solid ${t.border}`,
                }}>
                  {[
                    language === 'ar' ? 'الاسم' : 'Name',
                    language === 'ar' ? 'المنصب' : 'Position',
                    language === 'ar' ? 'القسم' : 'Department',
                    language === 'ar' ? 'التاريخ' : 'Date',
                  ].map((header, i) => (
                    <th key={i} style={{
                      padding: '0.75rem',
                      textAlign: isRTL ? 'right' : 'left',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      color: t.textMuted,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentEmployees.map((emp, idx) => (
                  <tr
                    key={idx}
                    style={{
                      borderBottom: `1px solid ${t.border}`,
                      transition: 'all 0.2s',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = isDarkMode ? 'rgba(212,165,116,0.06)' : 'rgba(0,0,0,0.02)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <td style={{ padding: '0.9rem 0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '10px',
                          background: `linear-gradient(135deg, ${Colors.bronze}40, ${Colors.gold}30)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: t.accent,
                          fontWeight: 700,
                          fontSize: '0.8rem',
                        }}>
                          {emp.avatar}
                        </div>
                        <span style={{ fontWeight: 600, color: t.text, fontSize: '0.9rem' }}>
                          {isRTL ? emp.nameAr : emp.name}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '0.9rem 0.75rem', color: t.textMuted, fontSize: '0.9rem' }}>
                      {isRTL ? emp.positionAr : emp.position}
                    </td>
                    <td style={{ padding: '0.9rem 0.75rem' }}>
                      <span style={{
                        background: `${Colors.info}15`,
                        color: Colors.info,
                        padding: '4px 10px',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                      }}>
                        {isRTL ? emp.departmentAr : emp.department}
                      </span>
                    </td>
                    <td style={{ padding: '0.9rem 0.75rem', color: t.textMuted, fontSize: '0.85rem' }}>
                      {emp.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ═══ Upcoming Leaves ═══ */}
        <div style={{
          background: t.card,
          borderRadius: '20px',
          padding: '1.75rem',
          border: `1px solid ${t.border}`,
          boxShadow: t.shadow,
        }}>
          <h3 style={{
            margin: 0,
            fontSize: '1.2rem',
            fontWeight: 700,
            color: t.text,
            marginBottom: '1.5rem',
          }}>
            {language === 'ar' ? 'الإجازات القادمة' : 'Upcoming Leaves'}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {upcomingLeaves.map((leave, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem',
                  background: t.surface,
                  borderRadius: '14px',
                  border: `1px solid transparent`,
                  transition: 'all 0.3s',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = t.accent;
                  e.currentTarget.style.transform = `translateX(${isRTL ? '5px' : '-5px'})`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'transparent';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: `linear-gradient(135deg, ${Colors.darkRed}30, ${Colors.red}20)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: Colors.darkRed,
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  flexShrink: 0,
                }}>
                  {leave.avatar}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{
                    margin: 0,
                    fontWeight: 600,
                    color: t.text,
                    fontSize: '0.9rem',
                  }}>
                    {isRTL ? leave.nameAr : leave.name}
                  </p>
                  <span style={{
                    fontSize: '0.8rem',
                    color: t.textMuted,
                  }}>
                    {isRTL ? leave.typeAr : leave.type}
                  </span>
                </div>
                <div style={{
                  textAlign: isRTL ? 'left' : 'right',
                }}>
                  <span style={{
                    background: `${Colors.warning}18`,
                    color: Colors.warning,
                    padding: '4px 10px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                  }}>
                    {isRTL ? leave.datesAr : leave.dates}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Leave Stats */}
          <div style={{
            marginTop: '1.5rem',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.75rem',
          }}>
            <div style={{
              background: `${Colors.success}10`,
              borderRadius: '12px',
              padding: '1rem',
              textAlign: 'center',
              border: `1px solid ${Colors.success}20`,
            }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: Colors.success }}>18</div>
              <div style={{ fontSize: '0.8rem', color: t.textMuted }}>
                {language === 'ar' ? 'تمت الموافقة' : 'Approved'}
              </div>
            </div>
            <div style={{
              background: `${Colors.warning}10`,
              borderRadius: '12px',
              padding: '1rem',
              textAlign: 'center',
              border: `1px solid ${Colors.warning}20`,
            }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: Colors.warning }}>5</div>
              <div style={{ fontSize: '0.8rem', color: t.textMuted }}>
                {language === 'ar' ? 'معلق' : 'Pending'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Bottom Stats Row ═══ */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '1.25rem',
      }}>
        {[
          {
            label: language === 'ar' ? 'الرواتب المعالجة' : 'Payroll Processed',
            value: '₹ 2.4M',
            icon: FiCreditCard,
            change: '+12%',
            color: Colors.success,
            gradient: `linear-gradient(135deg, ${Colors.success}20, ${Colors.success}05)`,
          },
          {
            label: language === 'ar' ? 'التوظيف المفتوح' : 'Open Positions',
            value: '8',
            icon: FiBriefcase,
            change: '3 urgent',
            color: Colors.warning,
            gradient: `linear-gradient(135deg, ${Colors.warning}20, ${Colors.warning}05)`,
          },
          {
            label: language === 'ar' ? 'رضا الموظفين' : 'Employee Satisfaction',
            value: '94%',
            icon: FiStar,
            change: '+2.3%',
            color: Colors.gold,
            gradient: `linear-gradient(135deg, ${Colors.gold}20, ${Colors.gold}05)`,
          },
          {
            label: language === 'ar' ? 'معدل الدوران' : 'Turnover Rate',
            value: '3.2%',
            icon: FiTrendingUp,
            change: '-0.5%',
            color: Colors.info,
            gradient: `linear-gradient(135deg, ${Colors.info}20, ${Colors.info}05)`,
          },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              style={{
                background: t.card,
                borderRadius: '18px',
                padding: '1.5rem',
                border: `1px solid ${t.border}`,
                boxShadow: t.shadow,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = `0 16px 40px ${stat.color}15`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = t.shadow;
              }}
            >
              {/* Background decoration */}
              <div style={{
                position: 'absolute',
                top: -20,
                [isRTL ? 'left' : 'right']: -20,
                width: '80px',
                height: '80px',
                background: stat.gradient,
                borderRadius: '50%',
              }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', position: 'relative' }}>
                <div>
                  <p style={{
                    margin: 0,
                    color: t.textMuted,
                    fontSize: '0.85rem',
                    marginBottom: '0.5rem',
                    fontWeight: 500,
                  }}>
                    {stat.label}
                  </p>
                  <h3 style={{
                    margin: 0,
                    fontSize: '1.6rem',
                    fontWeight: 800,
                    color: t.text,
                  }}>
                    {stat.value}
                  </h3>
                  <span style={{
                    fontSize: '0.8rem',
                    color: stat.color,
                    fontWeight: 600,
                    marginTop: '0.25rem',
                    display: 'inline-block',
                  }}>
                    {stat.change}
                  </span>
                </div>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  background: `${stat.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: stat.color,
                }}>
                  <Icon size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ═══ Animations ═══ */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default HRDashboard;