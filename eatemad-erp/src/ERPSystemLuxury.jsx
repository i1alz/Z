import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  FiSun,
  FiMoon,
  FiUsers,
  FiBarChart2,
  FiSettings,
  FiCalendar,
  FiCreditCard,
  FiGrid,
  FiLogOut,
  FiRefreshCw,
  FiSearch,
  FiChevronDown,
  FiChevronRight,
  FiActivity,
  FiMenu,
  FiX,
  FiCheckCircle,
  FiUserPlus,
} from "react-icons/fi";
import HRDashboard from "./components/HRDashboard";
import EmployeesModule from "./components/EmployeesModule";
import UsersModule from "./components/UsersModule";
import { MODULE_CONFIG } from "./config/moduleConfig";
import { userHasPermission } from "./config/roleConfig";
import { useHRData } from "./hooks/useHRData";

const Colors = {
  gold: "#d4a574",
  goldLight: "#e8c9a0",
  goldDark: "#b8935f",
  darkRed: "#8b2c2c",
  red: "#c73e3e",
  bgDark: "#0f0c0a",
  bgPrimary: "#1a1410",
  bgSecondary: "#201812",
  bgLight: "#ffffff",
  bgLightPrimary: "#faf8f5",
  bgLightSecondary: "#f5f2ed",
  textDark: "#f5e6d3",
  textDarkMuted: "#b8a088",
  textLight: "#1a1a1c",
  textLightMuted: "#6b6c70",
  borderDark: "rgba(212,165,116,0.25)",
  borderLight: "rgba(153,93,38,0.15)",
  shadowDark: "0 20px 60px rgba(0,0,0,0.7)",
  shadowLight: "0 8px 30px rgba(153,93,38,0.12)",
};

const iconMap = {
  grid: FiGrid,
  users: FiUsers,
  checkCircle: FiCheckCircle,
  calendar: FiCalendar,
  creditCard: FiCreditCard,
  activity: FiActivity,
  barChart: FiBarChart2,
  userPlus: FiUserPlus,
};

const ThemeContext = createContext();
export const useTheme = () => useContext(ThemeContext);

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const safeUser = (user, language) => {
  const fullName = user?.fullName || user?.name || "أكرم قاسم";
  return {
    ...user,
    fullName,
    englishName: user?.englishName || "Akram Qasim",
    title:
      user?.title ||
      (language === "ar" ? "مدير الموارد البشرية" : "HR Manager"),
    permissions:
      Array.isArray(user?.permissions) && user.permissions.length
        ? user.permissions
        : ["hr"],
    avatar: user?.avatar || getInitials(fullName),
  };
};

function ERPSystemLuxury({
  user,
  language = "ar",
  isDarkMode = true,
  onLogout,
  onLanguageChange,
  onThemeChange,
}) {
  const [activeModule, setActiveModule] = useState("dashboard");
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewport, setViewport] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1440,
  );

  const currentUser = useMemo(() => safeUser(user, language), [user, language]);
  const isTablet = viewport <= 1024;
  const isMobile = viewport <= 768;

  useEffect(() => {
    const onResize = () => setViewport(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    document.dir = language === "ar" ? "rtl" : "ltr";
    document.body.style.background = isDarkMode
      ? Colors.bgDark
      : Colors.bgLight;
  }, [language, isDarkMode]);

  useEffect(() => {
    if (!isMobile) setMobileSidebarOpen(false);
  }, [isMobile]);

  const theme = isDarkMode
    ? {
        bg: Colors.bgDark,
        bgGradient: `linear-gradient(180deg, ${Colors.bgDark} 0%, ${Colors.bgPrimary} 100%)`,
        surface: Colors.bgPrimary,
        surfaceHover: Colors.bgSecondary,
        sidebar: "#181310",
        text: Colors.textDark,
        textMuted: Colors.textDarkMuted,
        border: Colors.borderDark,
        accent: Colors.gold,
        accentLight: Colors.goldLight,
        shadow: Colors.shadowDark,
        glass: "rgba(26,21,18,0.7)",
      }
    : {
        bg: Colors.bgLight,
        bgGradient: `linear-gradient(180deg, ${Colors.bgLight} 0%, ${Colors.bgLightPrimary} 100%)`,
        surface: Colors.bgLightPrimary,
        surfaceHover: Colors.bgLightSecondary,
        sidebar: Colors.bgLight,
        text: Colors.textLight,
        textMuted: Colors.textLightMuted,
        border: Colors.borderLight,
        accent: Colors.goldDark,
        accentLight: Colors.gold,
        shadow: Colors.shadowLight,
        glass: "rgba(255,255,255,0.85)",
      };

  const modules = useMemo(
    () =>
      MODULE_CONFIG.map((m) => ({
        ...m,
        icon: iconMap[m.iconKey] || FiGrid,
        label: language === "ar" ? m.labels.ar : m.labels.en,
      })).filter((m) =>
        userHasPermission(currentUser.permissions, m.permission),
      ),
    [language, currentUser.permissions],
  );

  useEffect(() => {
    if (!modules.some((m) => m.id === activeModule))
      setActiveModule(modules[0]?.id || "dashboard");
  }, [modules, activeModule]);

  const {
    loading: dataLoading,
    error: dataError,
    dashboardData,
    moduleData,
    employees,
    mutatingEmployees,
    refresh: refreshData,
    addEmployee,
    updateEmployee,
    deleteEmployee,
  } = useHRData({
    language,
    user: currentUser,
  });

  const renderModule = () => {
    if (activeModule === "dashboard") {
      return (
        <HRDashboard
          theme={theme}
          language={language}
          currentUser={currentUser}
          permissions={currentUser.permissions}
          dashboardData={dashboardData}
          onNavigate={setActiveModule}
        />
      );
    }
    if (activeModule === "employees") {
      return (
        <EmployeesModule
          theme={theme}
          language={language}
          isCompact={isTablet}
          employees={employees}
          mutatingEmployees={mutatingEmployees}
          onAddEmployee={addEmployee}
          onUpdateEmployee={updateEmployee}
          onDeleteEmployee={deleteEmployee}
        />
      );
    }
    if (activeModule === "users") {
      return (
        <UsersModule
          theme={theme}
          language={language}
          currentUser={currentUser}
        />
      );
    }
    return (
      <HRSubModule
        module={activeModule}
        theme={theme}
        language={language}
        isCompact={isTablet}
        moduleData={moduleData?.[activeModule]}
      />
    );
  };

  return (
    <ThemeContext.Provider
      value={{ isDarkMode, currentTheme: theme, language }}
    >
      <div
        style={{
          minHeight: "100vh",
          background: theme.bgGradient,
          color: theme.text,
          direction: language === "ar" ? "rtl" : "ltr",
        }}
      >
        {/* header */}
        <header
          style={{
            height: 75,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: isMobile ? "0 1rem" : "0 2rem",
            background: theme.glass,
            borderBottom: `1px solid ${theme.border}`,
            position: "sticky",
            top: 0,
            zIndex: 1000,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.85rem",
              minWidth: 0,
            }}
          >
            <button
              onClick={() => setMobileSidebarOpen((v) => !v)}
              style={{
                display: isMobile ? "inline-flex" : "none",
                background: "transparent",
                border: "none",
                color: theme.accent,
                cursor: "pointer",
              }}
            >
              <FiMenu size={22} />
            </button>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: `linear-gradient(145deg, ${Colors.gold}, ${Colors.goldDark})`,
                display: "grid",
                placeItems: "center",
                border: `2px solid ${Colors.goldLight}`,
              }}
            >
              <img
                src="/eatemad-logo.png"
                alt="logo"
                style={{ width: "82%", height: "82%", objectFit: "contain" }}
              />
            </div>
            <div style={{ minWidth: 0 }}>
              <h1
                style={{
                  margin: 0,
                  fontSize: isMobile ? "1.1rem" : "1.5rem",
                  fontWeight: 800,
                  whiteSpace: "nowrap",
                }}
              >
                {language === "ar"
                  ? "نظام الاعتماد المتكامل"
                  : "Al Eatemad ERP"}
              </h1>
              {!isMobile && (
                <p
                  style={{
                    margin: 0,
                    color: theme.textMuted,
                    fontSize: "0.8rem",
                  }}
                >
                  {language === "ar"
                    ? "إدارة الموارد المؤسسية"
                    : "Enterprise Resource Planning"}
                </p>
              )}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            {!isTablet && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: theme.surface,
                  border: `1px solid ${theme.border}`,
                  borderRadius: 24,
                  padding: "0.5rem 0.9rem",
                  minWidth: 250,
                }}
              >
                <FiSearch size={16} color={theme.accent} />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    language === "ar"
                      ? "البحث في النظام..."
                      : "Search system..."
                  }
                  style={{
                    width: "100%",
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    color: theme.text,
                    fontFamily: "inherit",
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: theme.textMuted,
                      cursor: "pointer",
                    }}
                  >
                    <FiX size={15} />
                  </button>
                )}
              </div>
            )}
            <button
              onClick={() =>
                onLanguageChange?.(language === "ar" ? "en" : "ar")
              }
              style={{
                background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentLight})`,
                border: "none",
                borderRadius: 10,
                padding: "0.55rem 0.8rem",
                fontWeight: 700,
                cursor: "pointer",
                color: isDarkMode ? Colors.bgDark : "#fff",
              }}
            >
              {language === "ar" ? "EN" : "عربي"}
            </button>
            <button
              onClick={() => onThemeChange?.(!isDarkMode)}
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                border: `2px solid ${theme.accent}`,
                background: theme.surface,
                color: theme.accent,
                display: "grid",
                placeItems: "center",
                cursor: "pointer",
              }}
            >
              {isDarkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>
            <button
              onClick={refreshData}
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                border: `1px solid ${theme.border}`,
                background: theme.surface,
                color: theme.accent,
                display: "grid",
                placeItems: "center",
                cursor: "pointer",
              }}
              title={language === "ar" ? "تحديث البيانات" : "Refresh Data"}
            >
              <FiRefreshCw
                size={17}
                style={{
                  animation: dataLoading ? "spin 1s linear infinite" : "none",
                }}
              />
            </button>
            {!isMobile && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  padding: "0.4rem 0.7rem 0.4rem 0.45rem",
                  border: `1px solid ${theme.border}`,
                  borderRadius: 20,
                  background: theme.surface,
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentLight})`,
                    color: isDarkMode ? Colors.bgDark : "#fff",
                    fontWeight: 800,
                    fontSize: "0.85rem",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  {currentUser.avatar}
                </div>
                <div
                  style={{ textAlign: language === "ar" ? "right" : "left" }}
                >
                  <p
                    style={{ margin: 0, fontSize: "0.85rem", fontWeight: 700 }}
                  >
                    {language === "ar"
                      ? currentUser.fullName
                      : currentUser.englishName}
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.72rem",
                      color: theme.textMuted,
                    }}
                  >
                    {currentUser.title}
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.68rem",
                      color: dataError ? "#ef4444" : "#22c55e",
                    }}
                  >
                    {dataError
                      ? language === "ar"
                        ? "وضع احتياطي"
                        : "Fallback Mode"
                      : language === "ar"
                        ? "متصل"
                        : "Connected"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </header>

        <div
          style={{
            display: "flex",
            minHeight: "calc(100vh - 75px)",
            position: "relative",
          }}
        >
          {isMobile && mobileSidebarOpen && (
            <div
              style={{
                position: "fixed",
                top: 75,
                left: 0,
                right: 0,
                bottom: 0,
                background: "rgba(10,8,6,0.8)",
                zIndex: 998,
              }}
              onClick={() => setMobileSidebarOpen(false)}
            />
          )}

          <aside
            style={{
              width: isMobile ? 280 : sidebarExpanded ? 300 : 84,
              background: theme.sidebar,
              borderRight:
                language === "ar" ? `1px solid ${theme.border}` : "none",
              borderLeft:
                language === "en" ? `1px solid ${theme.border}` : "none",
              transition: "all 0.3s ease",
              padding: "1.4rem 0",
              display: "flex",
              flexDirection: "column",
              position: isMobile ? "fixed" : "relative",
              top: isMobile ? 75 : "auto",
              [language === "ar" ? "right" : "left"]: isMobile ? 0 : "auto",
              zIndex: isMobile ? 999 : 1,
              height: isMobile ? "calc(100vh - 75px)" : "auto",
              transform: isMobile
                ? mobileSidebarOpen
                  ? "translateX(0)"
                  : `translateX(${language === "ar" ? "110%" : "-110%"})`
                : "none",
            }}
          >
            {!isMobile && (
              <button
                onClick={() => setSidebarExpanded((v) => !v)}
                style={{
                  position: "absolute",
                  top: 24,
                  [language === "ar" ? "left" : "right"]: -15,
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  border: "none",
                  background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentLight})`,
                  color: isDarkMode ? Colors.bgDark : "#fff",
                  display: "grid",
                  placeItems: "center",
                  cursor: "pointer",
                }}
              >
                {sidebarExpanded ? (
                  language === "ar" ? (
                    <FiChevronRight size={14} />
                  ) : (
                    <FiChevronDown size={14} />
                  )
                ) : language === "ar" ? (
                  <FiChevronDown size={14} />
                ) : (
                  <FiChevronRight size={14} />
                )}
              </button>
            )}

            <nav style={{ padding: "0 0.95rem", flex: 1 }}>
              {modules.map((m) => {
                const Icon = m.icon;
                const active = activeModule === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      setActiveModule(m.id);
                      if (isMobile) setMobileSidebarOpen(false);
                    }}
                    style={{
                      width: "100%",
                      border: "none",
                      borderRadius: 13,
                      marginBottom: "0.6rem",
                      padding:
                        sidebarExpanded || isMobile
                          ? "0.95rem 1rem"
                          : "0.95rem",
                      background: active ? m.gradient : "transparent",
                      color: active ? "#fff" : theme.text,
                      display: "flex",
                      alignItems: "center",
                      justifyContent:
                        sidebarExpanded || isMobile ? "flex-start" : "center",
                      gap: "0.8rem",
                      cursor: "pointer",
                      flexDirection: language === "ar" ? "row-reverse" : "row",
                    }}
                  >
                    <Icon size={20} />
                    {(sidebarExpanded || isMobile) && (
                      <span
                        style={{
                          fontSize: "0.92rem",
                          fontWeight: active ? 700 : 600,
                        }}
                      >
                        {m.label}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {(sidebarExpanded || isMobile) && (
              <div style={{ padding: "0 0.95rem", marginTop: "auto" }}>
                <button
                  style={{
                    width: "100%",
                    padding: "0.85rem",
                    borderRadius: 10,
                    border: `1px solid ${theme.border}`,
                    background: "transparent",
                    color: theme.textMuted,
                    marginBottom: "0.55rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    cursor: "pointer",
                  }}
                >
                  <FiSettings size={17} />
                  <span>{language === "ar" ? "الإعدادات" : "Settings"}</span>
                </button>
                <button
                  onClick={() => onLogout?.()}
                  style={{
                    width: "100%",
                    padding: "0.85rem",
                    borderRadius: 10,
                    border: "none",
                    background: `linear-gradient(135deg, ${Colors.red}, ${Colors.darkRed})`,
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    cursor: "pointer",
                    fontWeight: 700,
                  }}
                >
                  <FiLogOut size={17} />
                  <span>{language === "ar" ? "تسجيل الخروج" : "Logout"}</span>
                </button>
              </div>
            )}
          </aside>

          <main
            style={{
              flex: 1,
              padding: isMobile ? "1rem" : isTablet ? "1.4rem" : "2.2rem",
              overflowY: "auto",
            }}
          >
            {dataError && (
              <div
                style={{
                  marginBottom: "0.9rem",
                  padding: "0.75rem 0.95rem",
                  borderRadius: 10,
                  border: "1px solid rgba(239,68,68,0.4)",
                  background: "rgba(239,68,68,0.12)",
                  color: "#fecaca",
                  fontSize: "0.82rem",
                  fontWeight: 500,
                }}
              >
                {dataError}
              </div>
            )}
            {renderModule()}
          </main>
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </ThemeContext.Provider>
  );
}

function HRSubModule({ module, theme, language, isCompact, moduleData }) {
  const [filter, setFilter] = useState("");
  const t = (ar, en) => (language === "ar" ? ar : en);
  const config = {
    employees: {
      icon: FiUsers,
      title: t("الموظفون", "Employees"),
      sub: t("إدارة بيانات الموظفين", "Manage employee records"),
    },
    attendance: {
      icon: FiCheckCircle,
      title: t("الحضور والانصراف", "Attendance"),
      sub: t("تتبع حضور الموظفين", "Track attendance"),
    },
    leaves: {
      icon: FiCalendar,
      title: t("إدارة الإجازات", "Leave Management"),
      sub: t("طلبات الإجازات", "Leave requests"),
    },
    payroll: {
      icon: FiCreditCard,
      title: t("إدارة الرواتب", "Payroll"),
      sub: t("تشغيل الرواتب", "Process payroll"),
    },
    recruitment: {
      icon: FiUserPlus,
      title: t("التوظيف", "Recruitment"),
      sub: t("الوظائف والمقابلات", "Jobs and interviews"),
    },
    performance: {
      icon: FiBarChart2,
      title: t("تقييم الأداء", "Performance"),
      sub: t("متابعة الأداء", "Performance tracking"),
    },
  };
  const c = moduleData || config[module] || config.employees;
  const Icon = c.icon || config[module]?.icon || FiGrid;
  const fallbackRows = [
    {
      name: t("أحمد الفارسي", "Ahmed Al-Farsi"),
      status: t("نشط", "Active"),
      meta: "ID-1024",
    },
    {
      name: t("ريم الحربي", "Reem Al-Harbi"),
      status: t("معلق", "Pending"),
      meta: "ID-1088",
    },
    {
      name: t("عمر آل سعود", "Omar Al-Saud"),
      status: t("نشط", "Active"),
      meta: "ID-1112",
    },
  ];
  const rows = (
    c.records && c.records.length ? c.records : fallbackRows
  ).filter((row) =>
    `${row.name} ${row.status} ${row.meta}`
      .toLowerCase()
      .includes(filter.toLowerCase()),
  );

  return (
    <div>
      <h2
        style={{
          margin: "0 0 0.35rem",
          fontSize: isCompact ? "1.7rem" : "2rem",
          fontWeight: 800,
          color: theme.accent,
        }}
      >
        {c.title}
      </h2>
      <p style={{ margin: "0 0 1.2rem", color: theme.textMuted }}>
        {c.sub || c.subtitle}
      </p>
      <div
        style={{
          background: theme.surface,
          border: `1px solid ${theme.border}`,
          borderRadius: 14,
          padding: isCompact ? "1rem" : "1.3rem",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "0.7rem",
          }}
        >
          <strong>{t("السجلات", "Records")}</strong>
          <button
            style={{
              border: "none",
              borderRadius: 8,
              background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentLight})`,
              color: "#111",
              padding: "0.45rem 0.75rem",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            <Icon size={15} /> {t("إضافة جديد", "Add New")}
          </button>
        </div>
        <div style={{ marginBottom: "0.65rem" }}>
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder={t("ابحث في السجلات...", "Search records...")}
            style={{
              width: "100%",
              borderRadius: 10,
              border: `1px solid ${theme.border}`,
              background: "transparent",
              color: theme.text,
              padding: "0.55rem 0.7rem",
              outline: "none",
              fontFamily: "inherit",
              fontSize: "0.85rem",
            }}
          />
        </div>
        {rows.map((row) => (
          <div
            key={row.id || row.meta}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: `1px solid ${theme.border}`,
              padding: "0.8rem 0.4rem",
              gap: "0.7rem",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: `${theme.accent}20`,
                  color: theme.accent,
                  display: "grid",
                  placeItems: "center",
                  fontWeight: 700,
                  fontSize: "0.78rem",
                }}
              >
                {getInitials(row.name)}
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: 600 }}>{row.name}</p>
                <small style={{ color: theme.textMuted }}>{row.meta}</small>
              </div>
            </div>
            <span
              style={{
                padding: "0.25rem 0.7rem",
                borderRadius: 14,
                background: `${row.color || theme.accent}22`,
                color: row.color || theme.accent,
                fontSize: "0.78rem",
                fontWeight: 700,
              }}
            >
              {row.status}
            </span>
          </div>
        ))}
        {rows.length === 0 && (
          <div
            style={{
              padding: "1rem 0.4rem",
              color: theme.textMuted,
              textAlign: "center",
              fontSize: "0.85rem",
            }}
          >
            {t("لا توجد نتائج مطابقة.", "No matching results.")}
          </div>
        )}
      </div>
    </div>
  );
}

export default ERPSystemLuxury;
