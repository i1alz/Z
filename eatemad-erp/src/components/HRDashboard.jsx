import React, { useEffect, useMemo, useState } from "react";
import {
  FiUsers,
  FiCalendar,
  FiUserPlus,
  FiCreditCard,
  FiBarChart2,
  FiEye,
  FiChevronRight,
} from "react-icons/fi";

const ACTION_ICONS = {
  users: FiUsers,
  userPlus: FiUserPlus,
  creditCard: FiCreditCard,
  barChart: FiBarChart2,
};

const fallbackData = {
  attendance: { present: 215, absent: 18, onLeave: 15 },
  stats: {
    totalEmployees: 248,
    newHires: 12,
    leaveDaysRemaining: 18,
    pendingLeaveRequests: 5,
  },
  attendancePeriods: { current: "This Month" },
  recentEmployees: [],
  upcomingLeaves: [],
  quickActions: [],
};

function AttendanceDonut({ present, absent, onLeave, language }) {
  const total = Math.max(present + absent + onLeave, 1);
  const pct = Math.round((present / total) * 100);
  const r = 70;
  const circ = 2 * Math.PI * r;
  const presentArc = (present / total) * circ;
  const absentArc = (absent / total) * circ;
  const leaveArc = (onLeave / total) * circ;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "2rem",
        flexWrap: "wrap",
      }}
    >
      <div
        style={{ position: "relative", width: 180, height: 180, flexShrink: 0 }}
      >
        <svg width="180" height="180" style={{ transform: "rotate(-90deg)" }}>
          <circle
            cx="90"
            cy="90"
            r={r}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="22"
          />
          <circle
            cx="90"
            cy="90"
            r={r}
            fill="none"
            stroke="#d4a574"
            strokeWidth="22"
            strokeDasharray={`${presentArc} ${circ - presentArc}`}
            strokeDashoffset={0}
            strokeLinecap="round"
          />
          <circle
            cx="90"
            cy="90"
            r={r}
            fill="none"
            stroke="#3a2520"
            strokeWidth="22"
            strokeDasharray={`${absentArc} ${circ - absentArc}`}
            strokeDashoffset={-presentArc}
            strokeLinecap="round"
          />
          <circle
            cx="90"
            cy="90"
            r={r}
            fill="none"
            stroke="#9b0d16"
            strokeWidth="22"
            strokeDasharray={`${leaveArc} ${circ - leaveArc}`}
            strokeDashoffset={-(presentArc + absentArc)}
            strokeLinecap="round"
          />
        </svg>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "1.8rem",
              fontWeight: 900,
              color: "#d4a574",
              lineHeight: 1,
            }}
          >
            {pct}%
          </div>
          <div
            style={{
              fontSize: "0.68rem",
              color: "rgba(212,165,116,0.8)",
              marginTop: "0.25rem",
              fontWeight: 600,
            }}
          >
            {language === "ar" ? "نسبة الحضور" : "Attendance Rate"}
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.9rem",
          flex: 1,
          minWidth: 180,
        }}
      >
        {[
          {
            label: language === "ar" ? "حاضر" : "Present",
            value: present,
            color: "#d4a574",
          },
          {
            label: language === "ar" ? "غائب" : "Absent",
            value: absent,
            color: "#3a2520",
          },
          {
            label: language === "ar" ? "إجازة" : "On Leave",
            value: onLeave,
            color: "#9b0d16",
          },
        ].map((item) => (
          <div
            key={item.label}
            style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
          >
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                background: item.color,
                border: "2px solid rgba(212,165,116,0.3)",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                color: "rgba(245,230,211,0.85)",
                fontSize: "0.95rem",
                fontWeight: 500,
                flex: 1,
              }}
            >
              {item.label}
            </span>
            <span
              style={{ color: "#d4a574", fontSize: "1.1rem", fontWeight: 800 }}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function getNameByLanguage(language, currentUser) {
  if (!currentUser) {
    return language === "ar" ? "أكرم قاسم" : "Akram Qasim";
  }
  if (language === "ar") {
    return currentUser.fullName || currentUser.name || "أكرم قاسم";
  }
  return (
    currentUser.englishName ||
    currentUser.fullName ||
    currentUser.name ||
    "Akram Qasim"
  );
}

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function HRDashboard({
  theme,
  language,
  currentUser,
  permissions = [],
  dashboardData,
  onNavigate,
}) {
  const [animIn, setAnimIn] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1440,
  );
  const [attendancePeriod, setAttendancePeriod] = useState(
    language === "ar" ? "هذا الشهر" : "This Month",
  );

  useEffect(() => {
    const timer = setTimeout(() => setAnimIn(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const data = useMemo(
    () => ({ ...fallbackData, ...dashboardData }),
    [dashboardData],
  );

  useEffect(() => {
    if (data?.attendancePeriods?.current) {
      setAttendancePeriod(data.attendancePeriods.current);
    }
  }, [data, language]);

  const isLaptop = viewportWidth <= 1440;
  const isTablet = viewportWidth <= 1024;
  const isMobile = viewportWidth <= 768;
  const isPhone = viewportWidth <= 390;

  const card = {
    background: "linear-gradient(145deg, #2a1f18 0%, #1f1611 100%)",
    borderRadius: isPhone ? "12px" : "16px",
    border: "1px solid rgba(212,165,116,0.18)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.45)",
    overflow: "hidden",
  };

  const userName = getNameByLanguage(language, currentUser);
  const userTitle =
    currentUser?.title ||
    (language === "ar" ? "مدير الموارد البشرية" : "HR Manager");
  const hasFullAccess = permissions.includes("*");

  const quickActions = (data.quickActions || [])
    .filter(
      (action) => hasFullAccess || permissions.includes(action.permission),
    )
    .map((action) => ({
      ...action,
      Icon: ACTION_ICONS[action.iconKey] || FiUsers,
    }));

  const topGridColumns = isMobile
    ? "1fr"
    : isTablet
      ? "1fr 1fr"
      : "1fr minmax(190px, 240px) minmax(170px, 220px)";

  return (
    <div
      style={{
        opacity: animIn ? 1 : 0,
        transform: animIn ? "translateY(0)" : "translateY(16px)",
        transition: "all 0.5s ease",
        display: "flex",
        flexDirection: "column",
        gap: "1.25rem",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: topGridColumns,
          gap: "1rem",
          alignItems: "stretch",
        }}
      >
        <div
          style={{
            ...card,
            padding: isPhone ? "1.2rem" : "1.8rem",
            position: "relative",
            background:
              "linear-gradient(135deg, #2a1f18 0%, #3a2520 50%, #2a1f18 100%)",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: isPhone
                ? "1.4rem"
                : isMobile
                  ? "1.7rem"
                  : isLaptop
                    ? "2rem"
                    : "2.4rem",
              fontWeight: 900,
              color: "#f5e6d3",
              lineHeight: 1.2,
            }}
          >
            {language === "ar" ? `مرحباً، ${userName}` : `Welcome, ${userName}`}
          </h2>
          <p
            style={{
              margin: "0.6rem 0 0",
              color: "rgba(212,165,116,0.85)",
              fontSize: "1rem",
              fontWeight: 500,
            }}
          >
            {language === "ar"
              ? "أدر فريقك بكفاءة"
              : "Manage your team efficiently"}
          </p>
          <div
            style={{
              display: "inline-block",
              marginTop: "1.1rem",
              background: "linear-gradient(135deg, #7d0a12, #9b0d16)",
              borderRadius: "8px",
              padding: "0.4rem 1rem",
              fontSize: "0.85rem",
              fontWeight: 600,
              color: "#f5e6d3",
            }}
          >
            {userTitle}
          </div>
        </div>

        <div
          style={{
            ...card,
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
            alignItems: language === "ar" ? "flex-end" : "flex-start",
            justifyContent: "center",
            background: "linear-gradient(145deg, #2a1f18 0%, #221813 100%)",
          }}
        >
          <p
            style={{
              margin: 0,
              color: "rgba(212,165,116,0.7)",
              fontSize: "0.85rem",
              fontWeight: 600,
            }}
          >
            {language === "ar" ? "إجمالي الموظفين" : "Total Employees"}
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.65rem",
              marginTop: "0.6rem",
            }}
          >
            <FiUsers size={20} color="#d4a574" />
            <span
              style={{
                fontSize: "2.2rem",
                fontWeight: 900,
                color: "#f5e6d3",
                lineHeight: 1,
              }}
            >
              {data.stats.totalEmployees}
            </span>
          </div>
          <div
            style={{
              width: "100%",
              height: 4,
              background: "rgba(255,255,255,0.06)",
              borderRadius: 2,
              marginTop: "0.8rem",
            }}
          >
            <div
              style={{
                height: "100%",
                width: "75%",
                background: "linear-gradient(90deg, #7d0a12, #d4a574)",
              }}
            />
          </div>
        </div>

        <div
          style={{
            ...card,
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
            alignItems: language === "ar" ? "flex-end" : "flex-start",
            justifyContent: "center",
            background: "linear-gradient(145deg, #2a1f18 0%, #221813 100%)",
          }}
        >
          <p
            style={{
              margin: 0,
              color: "rgba(212,165,116,0.7)",
              fontSize: "0.85rem",
              fontWeight: 600,
            }}
          >
            {language === "ar" ? "موظفون جدد" : "New Hires"}
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.65rem",
              marginTop: "0.6rem",
            }}
          >
            <FiUserPlus size={20} color="#d4a574" />
            <span
              style={{
                fontSize: "2.2rem",
                fontWeight: 900,
                color: "#f5e6d3",
                lineHeight: 1,
              }}
            >
              {data.stats.newHires}
            </span>
          </div>
          <div
            style={{
              width: "100%",
              height: 4,
              background: "rgba(255,255,255,0.06)",
              borderRadius: 2,
              marginTop: "0.8rem",
            }}
          >
            <div
              style={{
                height: "100%",
                width: "30%",
                background: "linear-gradient(90deg, #d4a574, #f5d9b8)",
              }}
            />
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isTablet ? "1fr" : "1fr 1fr",
          gap: "1rem",
        }}
      >
        <div style={{ ...card, padding: isPhone ? "1rem" : "1.6rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.25rem",
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: "1.1rem",
                fontWeight: 800,
                color: "#f5e6d3",
              }}
            >
              {language === "ar"
                ? "نظرة عامة على الحضور"
                : "Attendance Overview"}
            </h3>
            <button
              onClick={() =>
                setAttendancePeriod((prev) =>
                  prev === (language === "ar" ? "هذا الشهر" : "This Month")
                    ? language === "ar"
                      ? "هذا الأسبوع"
                      : "This Week"
                    : language === "ar"
                      ? "هذا الشهر"
                      : "This Month",
                )
              }
              style={{
                background: "rgba(212,165,116,0.1)",
                border: "1px solid rgba(212,165,116,0.25)",
                borderRadius: "8px",
                padding: "0.4rem 0.8rem",
                color: "#d4a574",
                fontSize: "0.8rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {attendancePeriod} ▾
            </button>
          </div>
          <AttendanceDonut {...data.attendance} language={language} />
        </div>

        <div style={{ ...card, padding: isPhone ? "1rem" : "1.6rem" }}>
          <h3
            style={{
              margin: "0 0 1rem",
              fontSize: "1.1rem",
              fontWeight: 800,
              color: "#f5e6d3",
            }}
          >
            {language === "ar" ? "إجراءات سريعة" : "Quick Actions"}
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isPhone ? "1fr" : "1fr 1fr",
              gap: "0.85rem",
            }}
          >
            {quickActions.map((action) => (
              <div
                key={`${action.permission}-${action.title}`}
                className="quick-action-card"
                style={{
                  background: "linear-gradient(145deg, #3a1a1a, #2a1210)",
                  border: "1px solid rgba(155,13,22,0.35)",
                  borderRadius: "14px",
                  padding: "1rem",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  textAlign: "center",
                  cursor: "pointer",
                }}
                onClick={() => onNavigate && onNavigate(action.permission)}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "12px",
                    background: "linear-gradient(135deg, #7d0a12, #9b0d16)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <action.Icon size={20} color="#f5e6d3" />
                </div>
                <p
                  style={{
                    margin: 0,
                    color: "#f5e6d3",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                  }}
                >
                  {action.title}
                </p>
                <p
                  style={{
                    margin: 0,
                    color: "rgba(212,165,116,0.65)",
                    fontSize: "0.74rem",
                  }}
                >
                  {action.subtitle}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isTablet ? "1fr" : "1.6fr 1fr",
          gap: "1rem",
        }}
      >
        <div style={{ ...card, padding: isPhone ? "1rem" : "1.6rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: "1.1rem",
                fontWeight: 800,
                color: "#f5e6d3",
              }}
            >
              {language === "ar" ? "الموظفون الجدد" : "Recent Employees"}
            </h3>
            {!isMobile && (
              <button
                className="view-all-btn"
                style={{
                  background: "transparent",
                  border: "1px solid rgba(212,165,116,0.3)",
                  borderRadius: "8px",
                  padding: "0.35rem 0.8rem",
                  color: "#d4a574",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  cursor: "pointer",
                }}
                onClick={() => onNavigate && onNavigate("employees")}
              >
                <FiEye size={14} />
                {language === "ar" ? "عرض الكل" : "View All"}
              </button>
            )}
          </div>

          {isMobile ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              {data.recentEmployees.map((emp) => (
                <div
                  key={`${emp.name}-${emp.date}`}
                  style={{
                    padding: "0.85rem",
                    border: "1px solid rgba(212,165,116,0.15)",
                    borderRadius: "10px",
                    background: "rgba(212,165,116,0.05)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.6rem",
                      marginBottom: "0.45rem",
                    }}
                  >
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #7d0a12, #3a1a1a)",
                        border: "1px solid rgba(212,165,116,0.35)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#d4a574",
                        fontWeight: 700,
                        fontSize: "0.75rem",
                      }}
                    >
                      {getInitials(emp.name)}
                    </div>
                    <strong style={{ color: "#f5e6d3", fontSize: "0.9rem" }}>
                      {emp.name}
                    </strong>
                  </div>
                  <p
                    style={{
                      margin: "0 0 0.2rem",
                      color: "rgba(245,230,211,0.75)",
                      fontSize: "0.8rem",
                    }}
                  >
                    {emp.position} • {emp.department}
                  </p>
                  <span
                    style={{
                      color: "#d4a574",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                    }}
                  >
                    {emp.date}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1.5fr 1.5fr 1fr",
                  padding: "0.55rem 0.85rem",
                  borderRadius: "8px",
                  background: "rgba(212,165,116,0.08)",
                  marginBottom: "0.45rem",
                }}
              >
                {[
                  language === "ar" ? "الاسم" : "Name",
                  language === "ar" ? "المسمى" : "Position",
                  language === "ar" ? "القسم" : "Department",
                  language === "ar" ? "التاريخ" : "Date",
                ].map((header) => (
                  <span
                    key={header}
                    style={{
                      color: "rgba(212,165,116,0.7)",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                    }}
                  >
                    {header}
                  </span>
                ))}
              </div>

              {data.recentEmployees.map((emp) => (
                <div
                  key={`${emp.name}-${emp.date}`}
                  className="employee-row"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1.5fr 1.5fr 1fr",
                    padding: "0.85rem",
                    borderBottom: "1px solid rgba(212,165,116,0.08)",
                    alignItems: "center",
                    borderRadius: "6px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.65rem",
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #7d0a12, #3a1a1a)",
                        border: "1px solid rgba(212,165,116,0.35)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#d4a574",
                        fontWeight: 700,
                        fontSize: "0.78rem",
                      }}
                    >
                      {getInitials(emp.name)}
                    </div>
                    <span
                      style={{
                        color: "#f5e6d3",
                        fontWeight: 600,
                        fontSize: "0.88rem",
                      }}
                    >
                      {emp.name}
                    </span>
                  </div>
                  <span
                    style={{
                      color: "rgba(245,230,211,0.72)",
                      fontSize: "0.84rem",
                    }}
                  >
                    {emp.position}
                  </span>
                  <span
                    style={{
                      color: "rgba(245,230,211,0.72)",
                      fontSize: "0.84rem",
                    }}
                  >
                    {emp.department}
                  </span>
                  <span
                    style={{
                      color: "#d4a574",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                    }}
                  >
                    {emp.date}
                  </span>
                </div>
              ))}
            </>
          )}
        </div>

        <div style={{ ...card, padding: isPhone ? "1rem" : "1.6rem" }}>
          <h3
            style={{
              margin: "0 0 1rem",
              fontSize: "1.1rem",
              fontWeight: 800,
              color: "#f5e6d3",
            }}
          >
            {language === "ar" ? "الإجازات القادمة" : "Upcoming Leaves"}
          </h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            {data.upcomingLeaves.map((leave) => (
              <div
                key={`${leave.name}-${leave.period}`}
                className="leave-item"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.8rem 1rem",
                  background:
                    "linear-gradient(135deg, rgba(125,10,18,0.2), rgba(42,31,24,0.5))",
                  borderRadius: "12px",
                  border: "1px solid rgba(155,13,22,0.25)",
                  borderLeft: "3px solid #9b0d16",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.65rem",
                  }}
                >
                  <FiCalendar size={16} color="#d4a574" />
                  <span
                    style={{
                      color: "#f5e6d3",
                      fontWeight: 600,
                      fontSize: "0.86rem",
                    }}
                  >
                    {leave.name}
                  </span>
                </div>
                <span
                  style={{
                    color: "rgba(212,165,116,0.9)",
                    fontSize: "0.79rem",
                    fontWeight: 700,
                  }}
                >
                  {leave.period}
                </span>
              </div>
            ))}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.7rem",
              marginTop: "1rem",
            }}
          >
            <div
              style={{
                background: "rgba(212,165,116,0.06)",
                borderRadius: "10px",
                padding: "0.85rem",
                border: "1px solid rgba(212,165,116,0.25)",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "1.6rem",
                  fontWeight: 900,
                  color: "#d4a574",
                }}
              >
                {data.stats.leaveDaysRemaining}
              </div>
              <div
                style={{
                  fontSize: "0.72rem",
                  color: "rgba(212,165,116,0.65)",
                  marginTop: "0.15rem",
                  fontWeight: 500,
                }}
              >
                {language === "ar" ? "أيام الإجازة المتبقية" : "Days Remaining"}
              </div>
            </div>
            <div
              style={{
                background: "rgba(212,165,116,0.06)",
                borderRadius: "10px",
                padding: "0.85rem",
                border: "1px solid rgba(155,13,22,0.35)",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "1.6rem",
                  fontWeight: 900,
                  color: "#9b0d16",
                }}
              >
                {data.stats.pendingLeaveRequests}
              </div>
              <div
                style={{
                  fontSize: "0.72rem",
                  color: "rgba(212,165,116,0.65)",
                  marginTop: "0.15rem",
                  fontWeight: 500,
                }}
              >
                {language === "ar" ? "طلبات معلقة" : "Pending Requests"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
