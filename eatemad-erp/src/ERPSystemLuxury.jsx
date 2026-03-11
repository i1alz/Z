import React, { useState, useEffect, createContext, useContext } from 'react';
import {
  FiSun, FiMoon, FiHome, FiUsers, FiShoppingCart, FiBarChart2,
  FiSettings, FiBox, FiTruck, FiDollarSign, FiFileText, FiCalendar,
  FiCreditCard, FiDatabase, FiGrid, FiLogOut, FiBell, FiSearch,
  FiChevronDown, FiChevronRight, FiActivity, FiMenu, FiX,
  FiTrendingUp, FiTrendingDown, FiCheckCircle, FiAlertCircle
} from 'react-icons/fi';
import HRDashboard from './components/HRDashboard';

// ═══════════════════════════════════════════════
// Brand Colors - Eatemad Official Palette
// ═══════════════════════════════════════════════
const Colors = {
  // Primary Brand Colors - Bronze & Gold
  bronze: "#995d26",
  bronzeDark: "#7a4a1e",
  bronzeLight: "#b37840",

  beige: "#ead395",
  beigeDark: "#d4b876",
  beigeLight: "#f7edd2",

  // Luxury Gold Accents
  gold: "#d4a574",
  goldLight: "#e8c9a0",
  goldDark: "#b8935f",

  // Secondary Colors
  darkRed: "#7d0a12",
  red: "#9b0d16",
  redLight: "#b91a23",

  // Dark Theme Base
  bgDark: "#0a0806",
  bgPrimary: "#1a1512",
  bgSecondary: "#1c1410",
  bgCard: "#221a15",
  bgCardHover: "#2d231c",
  bgSidebar: "#140f0c",

  // Light Theme Base
  bgLight: "#ffffff",
  bgLightPrimary: "#faf8f5",
  bgLightSecondary: "#f5f2ed",
  bgLightCard: "#ffffff",

  // Text Colors
  textDark: "#e8d5c4",
  textDarkMuted: "#a89580",
  textLight: "#1a1a1c",
  textLightMuted: "#6b6c70",

  // Semantic Colors
  success: "#22c55e",
  warning: "#f59e0b",
  error: "#ef4444",
  info: "#3b82f6",

  // Borders & Overlays
  borderDark: "rgba(212,165,116,0.2)",
  borderLight: "rgba(153,93,38,0.15)",
  overlay: "rgba(10,8,6,0.85)",

  // Shadows
  shadowDark: "0 12px 40px rgba(0,0,0,0.5)",
  shadowLight: "0 8px 30px rgba(153,93,38,0.12)",
};

// ═══════════════════════════════════════════════
// Decorative Wheat/Leaf Element
// ═══════════════════════════════════════════════
function WheatDecor({ size = 100, opacity = 0.15, flip = false, style = {} }) {
  return (
    <svg
      width={size * 0.45}
      height={size}
      viewBox="0 0 50 160"
      fill="none"
      style={{
        display: "block",
        transform: flip ? "scaleX(-1)" : "none",
        opacity,
        pointerEvents: "none",
        ...style
      }}
    >
      <path
        d="M25 5 Q27 80 24 158"
        stroke={Colors.gold}
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      {[[25,15],[32,30],[20,44],[34,58],[18,72],[33,88],[17,104],[31,120],[16,136],[28,150]].map(([cx,cy],i) => {
        const left = i % 2 === 0;
        const cx2 = left ? cx - 16 : cx + 16;
        return (
          <ellipse
            key={i}
            cx={cx2}
            cy={cy}
            rx="11"
            ry="6"
            transform={`rotate(${left ? -38 : 38} ${cx2} ${cy})`}
            fill={Colors.goldLight}
            opacity={0.8 - i * 0.05}
          />
        );
      })}
    </svg>
  );
}

// ═══════════════════════════════════════════════
// Theme Context
// ═══════════════════════════════════════════════
const ThemeContext = createContext();
export const useTheme = () => useContext(ThemeContext);

// ═══════════════════════════════════════════════
// Main ERP System Component
// ═══════════════════════════════════════════════
function ERPSystemLuxury() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeModule, setActiveModule] = useState('dashboard');
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [language, setLanguage] = useState('ar');
  const [notifications] = useState(7);
  const [searchQuery, setSearchQuery] = useState('');

  const user = {
    name: 'زيد العزام',
    role: 'مدير النظام',
    email: 'admin@eatemad.com',
    avatar: 'ZA'
  };

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  // Toggle language
  const toggleLanguage = () => {
    const newLang = language === 'ar' ? 'en' : 'ar';
    setLanguage(newLang);
    document.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  };

  useEffect(() => {
    // Apply saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      setIsDarkMode(false);
    }

    // Set document direction
    document.dir = language === 'ar' ? 'rtl' : 'ltr';

    // Apply background to body
    document.body.style.background = isDarkMode ? Colors.bgDark : Colors.bgLight;
  }, [isDarkMode, language]);

  // Modules configuration - HR-Only System
  const modules = [
    {
      id: 'dashboard',
      label: 'لوحة التحكم',
      labelEn: 'Dashboard',
      icon: FiGrid,
      gradient: `linear-gradient(135deg, ${Colors.gold}, ${Colors.goldDark})`
    },
    {
      id: 'employees',
      label: 'الموظفين',
      labelEn: 'Employees',
      icon: FiUsers,
      gradient: `linear-gradient(135deg, ${Colors.darkRed}, ${Colors.red})`
    },
    {
      id: 'attendance',
      label: 'الحضور والانصراف',
      labelEn: 'Attendance',
      icon: FiCheckCircle,
      gradient: `linear-gradient(135deg, #22c55e, #16a34a)`
    },
    {
      id: 'leaves',
      label: 'الإجازات',
      labelEn: 'Leaves',
      icon: FiCalendar,
      gradient: `linear-gradient(135deg, #3b82f6, #2563eb)`
    },
    {
      id: 'payroll',
      label: 'الرواتب',
      labelEn: 'Payroll',
      icon: FiCreditCard,
      gradient: `linear-gradient(135deg, #f59e0b, #d97706)`
    },
    {
      id: 'recruitment',
      label: 'التوظيف',
      labelEn: 'Recruitment',
      icon: FiActivity,
      gradient: `linear-gradient(135deg, #8b5cf6, #7c3aed)`
    },
    {
      id: 'performance',
      label: 'تقييم الأداء',
      labelEn: 'Performance',
      icon: FiBarChart2,
      gradient: `linear-gradient(135deg, #ef4444, #dc2626)`
    },
  ];

  // Theme configuration
  const theme = {
    dark: {
      bg: Colors.bgDark,
      bgGradient: `linear-gradient(180deg, ${Colors.bgDark} 0%, ${Colors.bgPrimary} 100%)`,
      surface: Colors.bgPrimary,
      surfaceHover: Colors.bgSecondary,
      card: Colors.bgCard,
      cardHover: Colors.bgCardHover,
      sidebar: Colors.bgSidebar,
      text: Colors.textDark,
      textMuted: Colors.textDarkMuted,
      border: Colors.borderDark,
      accent: Colors.gold,
      accentLight: Colors.goldLight,
      shadow: Colors.shadowDark,
      glass: `rgba(26, 21, 18, 0.7)`,
    },
    light: {
      bg: Colors.bgLight,
      bgGradient: `linear-gradient(180deg, ${Colors.bgLight} 0%, ${Colors.bgLightPrimary} 100%)`,
      surface: Colors.bgLightPrimary,
      surfaceHover: Colors.bgLightSecondary,
      card: Colors.bgLightCard,
      cardHover: Colors.bgLightSecondary,
      sidebar: Colors.bgLight,
      text: Colors.textLight,
      textMuted: Colors.textLightMuted,
      border: Colors.borderLight,
      accent: Colors.bronze,
      accentLight: Colors.bronzeLight,
      shadow: Colors.shadowLight,
      glass: `rgba(255, 255, 255, 0.85)`,
    }
  };

  const currentTheme = isDarkMode ? theme.dark : theme.light;

  return (
    <ThemeContext.Provider value={{ isDarkMode, currentTheme, language }}>
      <div
        className="erp-luxury-container"
        style={{
          minHeight: '100vh',
          background: currentTheme.bgGradient,
          color: currentTheme.text,
          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          fontFamily: language === 'ar' ?
            "'Cairo', 'Tajawal', 'Segoe UI', system-ui, sans-serif" :
            "'Inter', 'Segoe UI', system-ui, sans-serif",
          direction: language === 'ar' ? 'rtl' : 'ltr',
          position: 'relative',
        }}
      >
        {/* Background Decorations */}
        <div style={{ position: 'absolute', top: 100, left: 20, zIndex: 0 }}>
          <WheatDecor size={180} opacity={0.05} />
        </div>
        <div style={{ position: 'absolute', bottom: 50, right: 30, zIndex: 0 }}>
          <WheatDecor size={200} opacity={0.04} flip />
        </div>

        {/* Top Header */}
        <header style={{
          height: '75px',
          background: currentTheme.glass,
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderBottom: `1px solid ${currentTheme.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 2.5rem',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          boxShadow: currentTheme.shadow,
        }}>
          {/* Logo and Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            {/* Mobile Menu Toggle */}
            <button
              className="mobile-menu-toggle"
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              style={{
                display: 'none',
                background: 'transparent',
                border: 'none',
                color: currentTheme.accent,
                cursor: 'pointer',
                padding: '8px',
              }}
            >
              <FiMenu size={24} />
            </button>

            <div style={{
              width: '55px',
              height: '55px',
              borderRadius: '16px',
              background: `linear-gradient(145deg, ${Colors.gold}, ${Colors.goldDark})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 8px 24px rgba(212, 165, 116, 0.35)`,
              border: `2px solid ${Colors.goldLight}`,
              position: 'relative',
              overflow: 'hidden',
            }}>
              <img
                src="/eatemad-logo.png"
                alt="Al Eatemad"
                style={{
                  width: '85%',
                  height: '85%',
                  objectFit: 'contain',
                  filter: 'brightness(1.1) contrast(1.1)',
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = '<span style="font-size: 28px;">🥩</span>';
                }}
              />
            </div>

            <div>
              <h1 style={{
                fontSize: '1.65rem',
                fontWeight: 800,
                background: `linear-gradient(135deg, ${currentTheme.accent}, ${currentTheme.accentLight})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                margin: 0,
                letterSpacing: language === 'ar' ? '0.5px' : '-0.5px',
              }}>
                {language === 'ar' ? 'نظام الاعتماد المتكامل' : 'Al Eatemad ERP'}
              </h1>
              <p style={{
                fontSize: '0.85rem',
                color: currentTheme.textMuted,
                margin: 0,
                fontWeight: 500,
              }}>
                {language === 'ar' ? 'إدارة الموارد المؤسسية' : 'Enterprise Resource Planning'}
              </p>
            </div>
          </div>

          {/* Header Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            {/* Premium Search Bar */}
            <div style={{
              position: 'relative',
              background: currentTheme.surface,
              borderRadius: '30px',
              padding: '0.6rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              minWidth: '320px',
              border: `1px solid ${currentTheme.border}`,
              transition: 'all 0.3s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.border = `1px solid ${currentTheme.accent}`;
              e.currentTarget.style.boxShadow = `0 0 20px ${currentTheme.accent}20`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.border = `1px solid ${currentTheme.border}`;
              e.currentTarget.style.boxShadow = 'none';
            }}
            >
              <FiSearch style={{ color: currentTheme.accent, minWidth: '18px' }} size={18} />
              <input
                type="text"
                placeholder={language === 'ar' ? 'البحث في النظام...' : 'Search system...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: currentTheme.text,
                  width: '100%',
                  fontSize: '0.9rem',
                  fontFamily: 'inherit',
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: currentTheme.textMuted,
                    cursor: 'pointer',
                    padding: '2px',
                  }}
                >
                  <FiX size={16} />
                </button>
              )}
            </div>

            {/* Notifications with Animation */}
            <div style={{ position: 'relative' }}>
              <button style={{
                background: currentTheme.surface,
                border: `1px solid ${currentTheme.border}`,
                borderRadius: '12px',
                width: '45px',
                height: '45px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: currentTheme.accent,
                transition: 'all 0.3s',
                position: 'relative',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = currentTheme.shadow;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              >
                <FiBell size={20} />
                {notifications > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    background: `linear-gradient(135deg, ${Colors.red}, ${Colors.darkRed})`,
                    color: '#fff',
                    borderRadius: '10px',
                    minWidth: '22px',
                    height: '22px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    border: `2px solid ${currentTheme.bg}`,
                    animation: 'pulse 2s infinite',
                  }}>
                    {notifications}
                  </span>
                )}
              </button>
            </div>

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              style={{
                background: `linear-gradient(135deg, ${currentTheme.accent}, ${currentTheme.accentLight})`,
                border: 'none',
                borderRadius: '12px',
                padding: '0.6rem 1.25rem',
                color: isDarkMode ? Colors.bgDark : '#fff',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '0.9rem',
                transition: 'all 0.3s',
                boxShadow: `0 4px 15px ${currentTheme.accent}30`,
              }}
              onMouseEnter={e => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = `0 6px 20px ${currentTheme.accent}40`;
              }}
              onMouseLeave={e => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = `0 4px 15px ${currentTheme.accent}30`;
              }}
            >
              {language === 'ar' ? 'EN' : 'عربي'}
            </button>

            {/* Theme Toggle with Animation */}
            <button
              onClick={toggleTheme}
              style={{
                background: currentTheme.surface,
                border: `2px solid ${currentTheme.accent}`,
                borderRadius: '50%',
                width: '45px',
                height: '45px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: currentTheme.accent,
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'rotate(180deg) scale(1.1)';
                e.currentTarget.style.background = currentTheme.accent;
                e.currentTarget.style.color = currentTheme.bg;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'rotate(0) scale(1)';
                e.currentTarget.style.background = currentTheme.surface;
                e.currentTarget.style.color = currentTheme.accent;
              }}
            >
              {isDarkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>

            {/* User Profile Card */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.5rem 1rem 0.5rem 0.5rem',
              background: currentTheme.surface,
              borderRadius: '30px',
              cursor: 'pointer',
              border: `1px solid ${currentTheme.border}`,
              transition: 'all 0.3s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.border = `1px solid ${currentTheme.accent}`;
              e.currentTarget.style.transform = 'translateX(-5px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.border = `1px solid ${currentTheme.border}`;
              e.currentTarget.style.transform = 'translateX(0)';
            }}
            >
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${currentTheme.accent}, ${currentTheme.accentLight})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isDarkMode ? Colors.bgDark : '#fff',
                fontWeight: 800,
                fontSize: '1.1rem',
                boxShadow: `0 4px 12px ${currentTheme.accent}30`,
              }}>
                {user.avatar}
              </div>
              <div style={{
                textAlign: language === 'ar' ? 'right' : 'left',
                paddingRight: language === 'ar' ? '0' : '0.5rem',
                paddingLeft: language === 'ar' ? '0.5rem' : '0',
              }}>
                <p style={{
                  margin: 0,
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  color: currentTheme.text,
                }}>
                  {user.name}
                </p>
                <p style={{
                  margin: 0,
                  fontSize: '0.8rem',
                  color: currentTheme.textMuted,
                  fontWeight: 500,
                }}>
                  {user.role}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Layout */}
        <div style={{ display: 'flex', minHeight: 'calc(100vh - 75px)', position: 'relative' }}>
          {/* Mobile Sidebar Overlay */}
          {mobileSidebarOpen && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: currentTheme.overlay,
                zIndex: 998,
                display: 'none',
              }}
              onClick={() => setMobileSidebarOpen(false)}
            />
          )}

          {/* Sidebar */}
          <aside style={{
            width: sidebarExpanded ? '300px' : '85px',
            background: currentTheme.sidebar,
            borderRight: language === 'ar' ? `1px solid ${currentTheme.border}` : 'none',
            borderLeft: language === 'en' ? `1px solid ${currentTheme.border}` : 'none',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            padding: '2rem 0',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: isDarkMode ? '4px 0 24px rgba(0,0,0,0.3)' : '2px 0 16px rgba(0,0,0,0.05)',
          }}>
            {/* Sidebar Toggle Button */}
            <button
              onClick={() => setSidebarExpanded(!sidebarExpanded)}
              style={{
                position: 'absolute',
                top: '30px',
                [language === 'ar' ? 'left' : 'right']: '-15px',
                background: `linear-gradient(135deg, ${currentTheme.accent}, ${currentTheme.accentLight})`,
                border: 'none',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isDarkMode ? Colors.bgDark : '#fff',
                cursor: 'pointer',
                transition: 'all 0.3s',
                zIndex: 10,
                boxShadow: `0 4px 12px ${currentTheme.accent}40`,
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              {sidebarExpanded ?
                (language === 'ar' ? <FiChevronRight size={16} /> : <FiChevronDown size={16} />) :
                (language === 'ar' ? <FiChevronDown size={16} /> : <FiChevronRight size={16} />)
              }
            </button>

            {/* Decorative Element */}
            <div style={{ position: 'absolute', bottom: -20, [language === 'ar' ? 'right' : 'left']: -30 }}>
              <WheatDecor size={160} opacity={0.03} />
            </div>

            {/* Module List */}
            <nav style={{ padding: '0 1.25rem', flex: 1, marginTop: '1rem' }}>
              {modules.map((module) => {
                const Icon = module.icon;
                const isActive = activeModule === module.id;

                return (
                  <button
                    key={module.id}
                    onClick={() => setActiveModule(module.id)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: sidebarExpanded ? '1.1rem 1.25rem' : '1.1rem',
                      marginBottom: '0.75rem',
                      background: isActive ? module.gradient : 'transparent',
                      border: 'none',
                      borderRadius: '16px',
                      color: isActive ? '#fff' : currentTheme.text,
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      textAlign: language === 'ar' ? 'right' : 'left',
                      flexDirection: language === 'ar' ? 'row-reverse' : 'row',
                      justifyContent: sidebarExpanded ? 'flex-start' : 'center',
                      position: 'relative',
                      overflow: 'hidden',
                      boxShadow: isActive ? `0 8px 24px ${Colors.gold}25` : 'none',
                    }}
                    onMouseEnter={e => {
                      if (!isActive) {
                        e.currentTarget.style.background = currentTheme.surfaceHover;
                        e.currentTarget.style.transform = 'translateX(' + (language === 'ar' ? '-5px' : '5px') + ')';
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.transform = 'translateX(0)';
                      }
                    }}
                  >
                    <Icon size={22} style={{ minWidth: '22px' }} />
                    {sidebarExpanded && (
                      <>
                        <span style={{
                          fontWeight: isActive ? 700 : 600,
                          fontSize: '0.95rem',
                          whiteSpace: 'nowrap',
                          letterSpacing: '0.3px',
                        }}>
                          {language === 'ar' ? module.label : module.labelEn}
                        </span>
                        {isActive && (
                          <div style={{
                            position: 'absolute',
                            [language === 'ar' ? 'right' : 'left']: 0,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            width: '4px',
                            height: '70%',
                            background: '#fff',
                            borderRadius: '0 4px 4px 0',
                            boxShadow: '0 0 10px rgba(255,255,255,0.5)',
                          }} />
                        )}
                      </>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Sidebar Footer */}
            {sidebarExpanded && (
              <div style={{ padding: '0 1.25rem', marginTop: 'auto' }}>
                {/* Settings Button */}
                <button
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '0.9rem 1.25rem',
                    marginBottom: '0.75rem',
                    background: 'transparent',
                    border: `1px solid ${currentTheme.border}`,
                    borderRadius: '12px',
                    color: currentTheme.textMuted,
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    flexDirection: language === 'ar' ? 'row-reverse' : 'row',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = currentTheme.accent;
                    e.currentTarget.style.color = currentTheme.accent;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = currentTheme.border;
                    e.currentTarget.style.color = currentTheme.textMuted;
                  }}
                >
                  <FiSettings size={20} />
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                    {language === 'ar' ? 'الإعدادات' : 'Settings'}
                  </span>
                </button>

                {/* Logout Button */}
                <button
                  onClick={() => {
                    // Use the global logout function
                    if (window.handleLogout) {
                      window.handleLogout();
                    }
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem',
                    padding: '0.9rem',
                    background: `linear-gradient(135deg, ${Colors.red}, ${Colors.darkRed})`,
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = `0 8px 20px ${Colors.red}30`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <FiLogOut size={18} />
                  <span>{language === 'ar' ? 'تسجيل الخروج' : 'Logout'}</span>
                </button>
              </div>
            )}
          </aside>

          {/* Main Content Area */}
          <main style={{
            flex: 1,
            padding: '2.5rem',
            overflowY: 'auto',
            position: 'relative',
          }}>
            {activeModule === 'dashboard' && (
              <DashboardModule theme={currentTheme} language={language} isDarkMode={isDarkMode} />
            )}
            {activeModule === 'employees' && (
              <HRDashboard theme={currentTheme} language={language} isDarkMode={isDarkMode} />
            )}
            {activeModule === 'attendance' && (
              <HRSubModule module="attendance" theme={currentTheme} language={language} isDarkMode={isDarkMode} />
            )}
            {activeModule === 'leaves' && (
              <HRSubModule module="leaves" theme={currentTheme} language={language} isDarkMode={isDarkMode} />
            )}
            {activeModule === 'payroll' && (
              <HRSubModule module="payroll" theme={currentTheme} language={language} isDarkMode={isDarkMode} />
            )}
            {activeModule === 'recruitment' && (
              <HRSubModule module="recruitment" theme={currentTheme} language={language} isDarkMode={isDarkMode} />
            )}
            {activeModule === 'performance' && (
              <HRSubModule module="performance" theme={currentTheme} language={language} isDarkMode={isDarkMode} />
            )}
          </main>
        </div>
      </div>

      {/* Global Styles */}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        * {
          box-sizing: border-box;
        }

        ::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }

        ::-webkit-scrollbar-track {
          background: ${currentTheme.surface};
        }

        ::-webkit-scrollbar-thumb {
          background: ${currentTheme.accent};
          border-radius: 5px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: ${currentTheme.accentLight};
        }

        @media (max-width: 768px) {
          .mobile-menu-toggle {
            display: block !important;
          }
        }
      `}</style>
    </ThemeContext.Provider>
  );
}

// ═══════════════════════════════════════════════
// Dashboard Module - HR Focused
// ═══════════════════════════════════════════════
function DashboardModule({ theme, language, isDarkMode }) {
  const stats = [
    { label: language === 'ar' ? 'إجمالي الموظفين' : 'Total Employees', value: '248', unit: language === 'ar' ? 'موظف' : 'Staff', change: '+5%', icon: FiUsers, gradient: `linear-gradient(135deg, #3b82f6, #2563eb)`, trending: 'up' },
    { label: language === 'ar' ? 'الحضور اليوم' : 'Present Today', value: '215', unit: language === 'ar' ? 'حاضر' : 'Present', change: '86.7%', icon: FiCheckCircle, gradient: `linear-gradient(135deg, #22c55e, #16a34a)`, trending: 'up' },
    { label: language === 'ar' ? 'طلبات الإجازة' : 'Leave Requests', value: '12', unit: language === 'ar' ? 'طلب' : 'Request', change: '5 pending', icon: FiCalendar, gradient: `linear-gradient(135deg, #f59e0b, #d97706)`, trending: 'up' },
    { label: language === 'ar' ? 'وظائف شاغرة' : 'Open Positions', value: '8', unit: language === 'ar' ? 'وظيفة' : 'Position', change: '3 urgent', icon: FiActivity, gradient: `linear-gradient(135deg, #8b5cf6, #7c3aed)`, trending: 'down' },
  ];

  return (
    <div style={{ animation: 'fadeIn 0.5s ease' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.5rem', background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentLight})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          {language === 'ar' ? 'لوحة تحكم الموارد البشرية' : 'HR Dashboard'}
        </h2>
        <p style={{ color: theme.textMuted, fontSize: '1rem' }}>
          {language === 'ar' ? 'مرحباً بك، زيد العزام! إليك نظرة عامة على قسم الموارد البشرية اليوم' : "Welcome, Zaid Al-Azzam! Here's your HR department overview for today"}
        </p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.75rem', marginBottom: '3rem' }}>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trending === 'up' ? FiTrendingUp : FiTrendingDown;
          return (
            <div key={index} style={{ background: theme.card, borderRadius: '20px', padding: '1.75rem', border: `1px solid ${theme.border}`, boxShadow: theme.shadow, transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)'; e.currentTarget.style.boxShadow = `0 20px 60px ${Colors.gold}15`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.boxShadow = theme.shadow; }}
            >
              <div style={{ position: 'absolute', top: -50, right: -50, width: 150, height: 150, background: stat.gradient, borderRadius: '50%', opacity: 0.1 }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', position: 'relative' }}>
                <div style={{ flex: 1 }}>
                  <p style={{ color: theme.textMuted, marginBottom: '0.75rem', fontSize: '0.9rem', fontWeight: 500 }}>{stat.label}</p>
                  <h3 style={{ fontSize: '2rem', margin: '0.5rem 0', fontWeight: 800, color: theme.text }}>
                    {stat.value}
                    <span style={{ fontSize: '0.9rem', marginLeft: '0.5rem', color: theme.textMuted, fontWeight: 400 }}>{stat.unit}</span>
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem' }}>
                    <TrendIcon size={16} style={{ color: stat.trending === 'up' ? Colors.success : Colors.error }} />
                    <span style={{ color: stat.trending === 'up' ? Colors.success : Colors.error, fontSize: '0.95rem', fontWeight: 700 }}>{stat.change}</span>
                    <span style={{ color: theme.textMuted, fontSize: '0.85rem' }}>{language === 'ar' ? 'من الشهر الماضي' : 'from last month'}</span>
                  </div>
                </div>
                <div style={{ width: '60px', height: '60px', background: stat.gradient, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: `0 8px 24px ${Colors.gold}20` }}>
                  <Icon size={28} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.75rem' }}>
        <div style={{ background: theme.card, borderRadius: '20px', padding: '2rem', border: `1px solid ${theme.border}`, boxShadow: theme.shadow }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.5rem', color: theme.text }}>{language === 'ar' ? 'الأنشطة الأخيرة' : 'Recent Activities'}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { title: language === 'ar' ? 'تم تعيين موظف جديد' : 'New Employee Hired', time: language === 'ar' ? 'منذ 5 دقائق' : '5 min ago', icon: FiUsers, color: Colors.success },
              { title: language === 'ar' ? 'طلب إجازة جديد' : 'New Leave Request', time: language === 'ar' ? 'منذ 15 دقيقة' : '15 min ago', icon: FiCalendar, color: Colors.info },
              { title: language === 'ar' ? 'تقييم أداء مكتمل' : 'Performance Review Done', time: language === 'ar' ? 'منذ ساعة' : '1 hour ago', icon: FiBarChart2, color: Colors.warning },
              { title: language === 'ar' ? 'تحديث بيانات الرواتب' : 'Payroll Data Updated', time: language === 'ar' ? 'منذ 3 ساعات' : '3 hours ago', icon: FiCreditCard, color: Colors.bronze },
            ].map((a, i) => { const Ic = a.icon; return (
              <div key={i} style={{ padding: '1rem', background: theme.surface, borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '1rem', transition: 'all 0.3s', cursor: 'pointer', border: '1px solid transparent' }}
                onMouseEnter={e => { e.currentTarget.style.border = `1px solid ${theme.accent}`; e.currentTarget.style.transform = 'translateX(-5px)'; }}
                onMouseLeave={e => { e.currentTarget.style.border = '1px solid transparent'; e.currentTarget.style.transform = 'translateX(0)'; }}
              >
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${a.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: a.color }}><Ic size={20} /></div>
                <div style={{ flex: 1 }}><p style={{ margin: 0, fontWeight: 600, color: theme.text }}>{a.title}</p><span style={{ color: theme.textMuted, fontSize: '0.85rem' }}>{a.time}</span></div>
                <FiChevronRight size={16} style={{ color: theme.textMuted, transform: language === 'ar' ? 'rotate(180deg)' : 'none' }} />
              </div>
            ); })}
          </div>
        </div>
        <div style={{ background: theme.card, borderRadius: '20px', padding: '2rem', border: `1px solid ${theme.border}`, boxShadow: theme.shadow }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.5rem', color: theme.text }}>{language === 'ar' ? 'توزيع الأقسام' : 'Department Distribution'}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { name: language === 'ar' ? 'الإدارة' : 'Management', count: 12, color: Colors.gold },
              { name: language === 'ar' ? 'المالية' : 'Finance', count: 35, color: Colors.success },
              { name: language === 'ar' ? 'التقنية' : 'IT', count: 48, color: Colors.info },
              { name: language === 'ar' ? 'الإنتاج' : 'Production', count: 85, color: Colors.bronze },
              { name: language === 'ar' ? 'المبيعات' : 'Sales', count: 42, color: '#8b5cf6' },
              { name: language === 'ar' ? 'اللوجستيات' : 'Logistics', count: 26, color: Colors.warning },
            ].map((dept, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <span style={{ color: theme.text, fontSize: '0.9rem', fontWeight: 500 }}>{dept.name}</span>
                  <span style={{ color: theme.textMuted, fontSize: '0.85rem' }}>{dept.count}</span>
                </div>
                <div style={{ height: '8px', background: theme.surface, borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(dept.count / 85) * 100}%`, background: dept.color, borderRadius: '4px', transition: 'width 1s ease' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// HR Sub-Module Component
// ═══════════════════════════════════════════════
function HRSubModule({ module, theme, language, isDarkMode }) {
  const cfg = {
    attendance: { title: language === 'ar' ? 'الحضور والانصراف' : 'Attendance', subtitle: language === 'ar' ? 'تتبع حضور وانصراف الموظفين' : 'Track attendance', icon: FiCheckCircle, data: [
      { name: language === 'ar' ? 'أحمد الفارسي' : 'Ahmed Al-Farsi', status: language === 'ar' ? 'حاضر' : 'Present', time: '08:00', sc: Colors.success },
      { name: language === 'ar' ? 'ريم الحربي' : 'Reem Al-Harbi', status: language === 'ar' ? 'حاضر' : 'Present', time: '08:15', sc: Colors.success },
      { name: language === 'ar' ? 'عمر آل سعود' : 'Omar Al-Saud', status: language === 'ar' ? 'متأخر' : 'Late', time: '09:30', sc: Colors.warning },
      { name: language === 'ar' ? 'ليلى إبراهيم' : 'Layla Ibrahim', status: language === 'ar' ? 'غائب' : 'Absent', time: '--', sc: Colors.error },
      { name: language === 'ar' ? 'حسن القحطاني' : 'Hassan Al-Qahtani', status: language === 'ar' ? 'حاضر' : 'Present', time: '07:55', sc: Colors.success },
    ]},
    leaves: { title: language === 'ar' ? 'إدارة الإجازات' : 'Leave Management', subtitle: language === 'ar' ? 'عرض وإدارة طلبات الإجازات' : 'Manage leave requests', icon: FiCalendar, data: [
      { name: language === 'ar' ? 'مها الزهراني' : 'Maha Al-Zahrani', status: language === 'ar' ? 'معلق' : 'Pending', time: '23-26 أبريل', sc: Colors.warning },
      { name: language === 'ar' ? 'فيصل القحطاني' : 'Faisal Al-Qahtani', status: language === 'ar' ? 'موافق عليه' : 'Approved', time: '23-25 أبريل', sc: Colors.success },
      { name: language === 'ar' ? 'نورة السالم' : 'Noura Al-Salem', status: language === 'ar' ? 'معلق' : 'Pending', time: '28-30 أبريل', sc: Colors.warning },
    ]},
    payroll: { title: language === 'ar' ? 'إدارة الرواتب' : 'Payroll', subtitle: language === 'ar' ? 'معالجة رواتب الموظفين' : 'Process salaries', icon: FiCreditCard, data: [
      { name: language === 'ar' ? 'قسم الإدارة' : 'Management', status: language === 'ar' ? 'تم الدفع' : 'Paid', time: '85,000 ر.س', sc: Colors.success },
      { name: language === 'ar' ? 'قسم التقنية' : 'IT Dept', status: language === 'ar' ? 'تم الدفع' : 'Paid', time: '120,000 ر.س', sc: Colors.success },
      { name: language === 'ar' ? 'قسم الإنتاج' : 'Production', status: language === 'ar' ? 'قيد المعالجة' : 'Processing', time: '210,000 ر.س', sc: Colors.warning },
    ]},
    recruitment: { title: language === 'ar' ? 'التوظيف' : 'Recruitment', subtitle: language === 'ar' ? 'إدارة التوظيف والمقابلات' : 'Manage hiring', icon: FiActivity, data: [
      { name: language === 'ar' ? 'مهندس برمجيات' : 'Software Engineer', status: language === 'ar' ? 'مفتوح' : 'Open', time: '12 متقدم', sc: Colors.info },
      { name: language === 'ar' ? 'محاسب' : 'Accountant', status: language === 'ar' ? 'مقابلات' : 'Interviews', time: '5 مرشحين', sc: Colors.warning },
      { name: language === 'ar' ? 'مدير مشاريع' : 'Project Manager', status: language === 'ar' ? 'مفتوح' : 'Open', time: '8 متقدم', sc: Colors.info },
    ]},
    performance: { title: language === 'ar' ? 'تقييم الأداء' : 'Performance', subtitle: language === 'ar' ? 'تقييمات أداء الموظفين' : 'Employee reviews', icon: FiBarChart2, data: [
      { name: language === 'ar' ? 'أحمد الفارسي' : 'Ahmed Al-Farsi', status: language === 'ar' ? 'ممتاز' : 'Excellent', time: '95%', sc: Colors.success },
      { name: language === 'ar' ? 'ريم الحربي' : 'Reem Al-Harbi', status: language === 'ar' ? 'جيد جداً' : 'Very Good', time: '88%', sc: Colors.info },
      { name: language === 'ar' ? 'عمر آل سعود' : 'Omar Al-Saud', status: language === 'ar' ? 'جيد' : 'Good', time: '75%', sc: Colors.warning },
    ]},
  };
  const c = cfg[module] || cfg.attendance;
  const Icon = c.icon;
  return (
    <div style={{ animation: 'fadeIn 0.5s ease' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.5rem', background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentLight})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{c.title}</h2>
        <p style={{ color: theme.textMuted, fontSize: '1rem' }}>{c.subtitle}</p>
      </div>
      <div style={{ background: theme.card, borderRadius: '20px', padding: '2rem', border: `1px solid ${theme.border}`, boxShadow: theme.shadow }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 700, color: theme.text }}>{language === 'ar' ? 'السجلات' : 'Records'}</h3>
          <button style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentLight})`, color: isDarkMode ? Colors.bgDark : '#fff', border: 'none', borderRadius: '12px', padding: '0.75rem 1.5rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.3s', fontFamily: 'inherit' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
          ><Icon size={18} />{language === 'ar' ? 'إضافة جديد' : 'Add New'}</button>
        </div>
        {c.data.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1rem', borderBottom: i < c.data.length - 1 ? `1px solid ${theme.border}` : 'none', transition: 'all 0.2s', borderRadius: '12px', cursor: 'pointer' }}
            onMouseEnter={e => { e.currentTarget.style.background = `${theme.accent}08`; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${theme.accent}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.accent, fontWeight: 700, fontSize: '0.85rem' }}>
                {item.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
              </div>
              <div><p style={{ margin: 0, fontWeight: 600, color: theme.text }}>{item.name}</p><span style={{ fontSize: '0.85rem', color: theme.textMuted }}>{item.time}</span></div>
            </div>
            <span style={{ background: `${item.sc}18`, color: item.sc, padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600 }}>{item.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ERPSystemLuxury;