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
  FiTrash2,
  FiCheck,
  FiAlertCircle,
  FiPlus,
  FiEdit3,
} from "react-icons/fi";
import HRDashboard from "./components/HRDashboard";
import EmployeesModule from "./components/EmployeesModule";
import UsersModule from "./components/UsersModule";
import { MODULE_CONFIG } from "./config/moduleConfig";
import { userHasPermission } from "./config/roleConfig";
import { useHRData } from "./hooks/useHRData";

const Colors = {
  gold: "#b8946a",
  goldLight: "#d7bf9d",
  goldDark: "#966334",
  darkRed: "#7d0a12",
  red: "#9a1b24",
  bgDark: "#1a1718",
  bgPrimary: "#232125",
  bgSecondary: "#2d2e31",
  bgLight: "#ffffff",
  bgLightPrimary: "#faf8f5",
  bgLightSecondary: "#f5f2ed",
  textDark: "#fae8e8",
  textDarkMuted: "#c6b3b3",
  textLight: "#1a1a1c",
  textLightMuted: "#6b6c70",
  borderDark: "rgba(250,232,232,0.18)",
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
    operationError,
    dashboardData,
    moduleData,
    employees,
    mutatingEmployees,
    mutating,
    refresh: refreshData,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    addModuleRecord,
    updateModuleRecord,
    deleteModuleRecord,
  } = useHRData({
    language,
    user: currentUser,
  });

  const [toast, setToast] = useState(null);
  const showToast = (message, type = "success") => setToast({ message, type });

  useEffect(() => {
    if (!toast) return undefined;
    const id = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(id);
  }, [toast]);

  const guardedModuleCreate = async (module, payload) => {
    if (!userHasPermission(currentUser.permissions, module)) {
      showToast(
        language === "ar"
          ? "ليس لديك صلاحية لهذه العملية"
          : "You do not have permission for this action",
        "error",
      );
      return { success: false };
    }
    const result = await addModuleRecord(module, payload);
    showToast(
      result.success
        ? language === "ar"
          ? "تمت العملية بنجاح"
          : "Operation completed successfully"
        : result.error ||
            (language === "ar" ? "فشلت العملية" : "Operation failed"),
      result.success ? "success" : "error",
    );
    return result;
  };

  const guardedModuleUpdate = async (module, id, payload) => {
    if (!userHasPermission(currentUser.permissions, module)) {
      showToast(
        language === "ar"
          ? "ليس لديك صلاحية لهذه العملية"
          : "You do not have permission for this action",
        "error",
      );
      return { success: false };
    }
    const result = await updateModuleRecord(module, id, payload);
    showToast(
      result.success
        ? language === "ar"
          ? "تم التعديل بنجاح"
          : "Updated successfully"
        : result.error || (language === "ar" ? "فشل التعديل" : "Update failed"),
      result.success ? "success" : "error",
    );
    return result;
  };

  const guardedModuleDelete = async (module, id) => {
    if (!userHasPermission(currentUser.permissions, module)) {
      showToast(
        language === "ar"
          ? "ليس لديك صلاحية لهذه العملية"
          : "You do not have permission for this action",
        "error",
      );
      return { success: false };
    }
    const result = await deleteModuleRecord(module, id);
    showToast(
      result.success
        ? language === "ar"
          ? "تم الحذف بنجاح"
          : "Deleted successfully"
        : result.error || (language === "ar" ? "فشل الحذف" : "Delete failed"),
      result.success ? "success" : "error",
    );
    return result;
  };

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
    if (activeModule === "attendance") {
      return (
        <AttendanceModule
          theme={theme}
          language={language}
          isCompact={isTablet}
          moduleData={moduleData?.attendance}
          canManage={userHasPermission(currentUser.permissions, "attendance")}
          loading={mutating.attendance}
          operationError={operationError.attendance}
          onAdd={(payload) => guardedModuleCreate("attendance", payload)}
          onUpdate={(id, payload) => guardedModuleUpdate("attendance", id, payload)}
          onDelete={(id) => guardedModuleDelete("attendance", id)}
        />
      );
    }
    if (activeModule === "leaves") {
      return (
        <LeavesModule
          theme={theme}
          language={language}
          isCompact={isTablet}
          moduleData={moduleData?.leaves}
          canManage={userHasPermission(currentUser.permissions, "leaves")}
          loading={mutating.leaves}
          operationError={operationError.leaves}
          onAdd={(payload) => guardedModuleCreate("leaves", payload)}
          onUpdate={(id, payload) => guardedModuleUpdate("leaves", id, payload)}
          onDelete={(id) => guardedModuleDelete("leaves", id)}
        />
      );
    }
    if (activeModule === "payroll") {
      return (
        <PayrollModule
          theme={theme}
          language={language}
          isCompact={isTablet}
          moduleData={moduleData?.payroll}
          canManage={userHasPermission(currentUser.permissions, "payroll")}
          loading={mutating.payroll}
          operationError={operationError.payroll}
          onAdd={(payload) => guardedModuleCreate("payroll", payload)}
          onUpdate={(id, payload) => guardedModuleUpdate("payroll", id, payload)}
          onDelete={(id) => guardedModuleDelete("payroll", id)}
        />
      );
    }
    if (activeModule === "recruitment") {
      return (
        <RecruitmentModule
          theme={theme}
          language={language}
          isCompact={isTablet}
          moduleData={moduleData?.recruitment}
          canManage={userHasPermission(currentUser.permissions, "recruitment")}
          loading={mutating.recruitment}
          operationError={operationError.recruitment}
          onAdd={(payload) => guardedModuleCreate("recruitment", payload)}
          onUpdate={(id, payload) => guardedModuleUpdate("recruitment", id, payload)}
          onDelete={(id) => guardedModuleDelete("recruitment", id)}
        />
      );
    }
    if (activeModule === "performance") {
      return (
        <PerformanceModule
          theme={theme}
          language={language}
          isCompact={isTablet}
          moduleData={moduleData?.performance}
          canManage={userHasPermission(currentUser.permissions, "performance")}
          loading={mutating.performance}
          operationError={operationError.performance}
          onAdd={(payload) => guardedModuleCreate("performance", payload)}
          onUpdate={(id, payload) => guardedModuleUpdate("performance", id, payload)}
          onDelete={(id) => guardedModuleDelete("performance", id)}
        />
      );
    }
    return null;
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
        {toast && (
          <ToastMessage
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </ThemeContext.Provider>
  );
}

function ToastMessage({ message, type, onClose }) {
  const isSuccess = type === "success";
  return (
    <div
      style={{
        position: "fixed",
        bottom: "1.5rem",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        background: isSuccess ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
        border: `1px solid ${isSuccess ? "rgba(34,197,94,0.45)" : "rgba(239,68,68,0.45)"}`,
        color: isSuccess ? "#86efac" : "#fca5a5",
        borderRadius: 12,
        padding: "0.75rem 1rem",
        display: "flex",
        alignItems: "center",
        gap: "0.6rem",
      }}
    >
      {isSuccess ? <FiCheck size={17} /> : <FiAlertCircle size={17} />}
      <span>{message}</span>
      <button onClick={onClose} style={{ border: "none", background: "none", color: "inherit", cursor: "pointer" }}>
        <FiX size={15} />
      </button>
    </div>
  );
}

function GenericHRModule({
  module,
  theme,
  language,
  isCompact,
  moduleData,
  canManage,
  loading,
  operationError,
  onAdd,
  onUpdate,
  onDelete,
  fields,
}) {
  const [filter, setFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({});
  const t = (ar, en) => (language === "ar" ? ar : en);
  const rows = (moduleData?.records || []).filter((row) =>
    `${row.name} ${row.status} ${row.meta}`.toLowerCase().includes(filter.toLowerCase()),
  );

  const submit = async (event) => {
    event.preventDefault();
    if (!canManage) return;
    const payload = fields.reduce((acc, field) => ({ ...acc, [field.key]: form[field.key] || "" }), {});
    const result = editingId ? await onUpdate(editingId, payload) : await onAdd(payload);
    if (result?.success) {
      setForm({});
      setEditingId(null);
      setShowForm(false);
    }
  };

  return (
    <div>
      <h2 style={{ margin: "0 0 0.35rem", fontSize: isCompact ? "1.7rem" : "2rem", fontWeight: 800, color: theme.accent }}>
        {moduleData?.title}
      </h2>
      <p style={{ margin: "0 0 1.2rem", color: theme.textMuted }}>{moduleData?.subtitle}</p>
      {operationError && <div style={{ marginBottom: "0.7rem", color: "#fca5a5" }}>{operationError}</div>}
      <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 14, padding: isCompact ? "1rem" : "1.3rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.7rem", gap: "0.6rem", flexWrap: "wrap" }}>
          <strong>{t("السجلات", "Records")}</strong>
          {canManage && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm({});
                setShowForm((v) => !v);
              }}
              style={{ border: "none", borderRadius: 8, background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentLight})`, color: "#111", padding: "0.45rem 0.75rem", display: "flex", alignItems: "center", gap: "0.4rem", cursor: "pointer", fontWeight: 700 }}
            >
              <FiPlus size={15} /> {t("إضافة جديد", "Add New")}
            </button>
          )}
        </div>
        {showForm && canManage && (
          <form onSubmit={submit} style={{ display: "grid", gridTemplateColumns: isCompact ? "1fr" : "repeat(3, 1fr)", gap: "0.5rem", marginBottom: "0.7rem" }}>
            {fields.map((field) => (
              <input
                key={field.key}
                value={form[field.key] || ""}
                onChange={(e) => setForm((p) => ({ ...p, [field.key]: e.target.value }))}
                placeholder={language === "ar" ? field.labelAr : field.labelEn}
                required={Boolean(field.required)}
                style={{ borderRadius: 8, border: `1px solid ${theme.border}`, background: "transparent", color: theme.text, padding: "0.45rem 0.6rem", fontSize: "0.78rem" }}
              />
            ))}
            <button type="submit" disabled={loading} style={{ border: "none", borderRadius: 8, padding: "0.45rem", cursor: "pointer" }}>
              {loading ? t("جارٍ الحفظ...", "Saving...") : t("حفظ", "Save")}
            </button>
          </form>
        )}
        <div style={{ marginBottom: "0.65rem" }}>
          <input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder={t("ابحث في السجلات...", "Search records...")} style={{ width: "100%", borderRadius: 10, border: `1px solid ${theme.border}`, background: "transparent", color: theme.text, padding: "0.55rem 0.7rem", outline: "none", fontFamily: "inherit", fontSize: "0.85rem" }} />
        </div>
        {rows.map((row) => (
          <div key={row.id || row.meta} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${theme.border}`, padding: "0.8rem 0.4rem", gap: "0.7rem" }}>
            <div>
              <p style={{ margin: 0, fontWeight: 600 }}>{row.name}</p>
              <small style={{ color: theme.textMuted }}>{row.meta}</small>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
              <span style={{ padding: "0.25rem 0.7rem", borderRadius: 14, background: `${row.color || theme.accent}22`, color: row.color || theme.accent, fontSize: "0.78rem", fontWeight: 700 }}>{row.status}</span>
              {canManage && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      const nextForm = row.editValues || fields.reduce((acc, field) => ({ ...acc, [field.key]: row[field.key] || "" }), {});
                      setEditingId(row.id);
                      setForm(nextForm);
                      setShowForm(true);
                    }}
                    style={{ border: "none", background: "none", color: theme.accent, cursor: "pointer" }}
                  >
                    <FiEdit3 size={15} />
                  </button>
                  <button type="button" onClick={() => onDelete(row.id)} style={{ border: "none", background: "none", color: "#ef4444", cursor: "pointer" }}>
                    <FiTrash2 size={15} />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AttendanceModule(props) {
  return <GenericHRModule {...props} module="attendance" fields={[{ key: "name", labelAr: "اسم الموظف", labelEn: "Employee Name", required: true }, { key: "status", labelAr: "الحالة", labelEn: "Status", required: true }, { key: "time_in", labelAr: "وقت الحضور", labelEn: "Time In" }]} />;
}

function LeavesModule(props) {
  return <GenericHRModule {...props} module="leaves" fields={[{ key: "name", labelAr: "اسم الموظف", labelEn: "Employee Name", required: true }, { key: "status", labelAr: "الحالة", labelEn: "Status", required: true }, { key: "start_date", labelAr: "تاريخ البداية", labelEn: "Start Date" }, { key: "end_date", labelAr: "تاريخ النهاية", labelEn: "End Date" }]} />;
}

function PayrollModule(props) {
  return <GenericHRModule {...props} module="payroll" fields={[{ key: "name", labelAr: "القسم/الموظف", labelEn: "Department/Employee", required: true }, { key: "status", labelAr: "الحالة", labelEn: "Status", required: true }, { key: "amount", labelAr: "المبلغ", labelEn: "Amount" }, { key: "period", labelAr: "الفترة", labelEn: "Period" }]} />;
}

function RecruitmentModule(props) {
  return <GenericHRModule {...props} module="recruitment" fields={[{ key: "title", labelAr: "المسمى الوظيفي", labelEn: "Job Title", required: true }, { key: "status", labelAr: "الحالة", labelEn: "Status", required: true }, { key: "applicants_count", labelAr: "عدد المتقدمين", labelEn: "Applicants" }]} />;
}

function PerformanceModule(props) {
  return <GenericHRModule {...props} module="performance" fields={[{ key: "name", labelAr: "اسم الموظف", labelEn: "Employee Name", required: true }, { key: "score", labelAr: "النتيجة", labelEn: "Score", required: true }, { key: "rating", labelAr: "التقييم", labelEn: "Rating" }]} />;
}

export default ERPSystemLuxury;
