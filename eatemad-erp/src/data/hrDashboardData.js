function t(language, ar, en) {
  return language === "ar" ? ar : en;
}

function toDate(value) {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function isRecentDate(value, days = 30) {
  const d = toDate(value);
  if (!d) return false;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  return diffMs >= 0 && diffMs <= days * 24 * 60 * 60 * 1000;
}

function formatEmployeeDate(value) {
  const d = toDate(value);
  if (!d) return "--";
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

function buildRecentEmployees(language, employees = []) {
  return employees.slice(0, 3).map((emp) => ({
    name: emp.full_name || emp.name || t(language, "موظف", "Employee"),
    position: emp.position || emp.job_title || t(language, "غير محدد", "N/A"),
    department: emp.department || t(language, "غير محدد", "N/A"),
    date: formatEmployeeDate(emp.created_at || emp.join_date || emp.date),
  }));
}

function buildUpcomingLeaves(language, leaves = []) {
  return leaves.slice(0, 3).map((leave) => {
    const start = toDate(leave.start_date);
    const end = toDate(leave.end_date);
    const period =
      start && end
        ? `${start.getDate()} - ${end.getDate()} ${start.toLocaleString("en-US", { month: "short" })}`
        : leave.period || "--";
    return {
      name:
        leave.employee_name ||
        leave.full_name ||
        leave.name ||
        t(language, "موظف", "Employee"),
      period,
    };
  });
}

function buildAttendanceSummary(attendance = []) {
  if (!attendance.length) {
    return { present: 215, absent: 18, onLeave: 15 };
  }
  let present = 0;
  let absent = 0;
  let onLeave = 0;
  for (const item of attendance) {
    const status = String(item.status || "").toLowerCase();
    if (status === "present") present += 1;
    else if (status === "absent") absent += 1;
    else if (status === "leave" || status === "on_leave") onLeave += 1;
    else if (status === "late") present += 1;
  }
  if (!present && !absent && !onLeave) {
    return { present: 215, absent: 18, onLeave: 15 };
  }
  return { present, absent, onLeave };
}

export function buildHRDashboardData({
  language = "ar",
  permissions = [],
  source = {},
} = {}) {
  const canAccess = (permission) =>
    permissions.includes("*") || permissions.includes(permission);
  const employees = Array.isArray(source.employees) ? source.employees : [];
  const attendanceRows = Array.isArray(source.attendance)
    ? source.attendance
    : [];
  const leaves = Array.isArray(source.leaves) ? source.leaves : [];

  const recentEmployees = buildRecentEmployees(language, employees);
  const upcomingLeaves = buildUpcomingLeaves(language, leaves);
  const attendance = buildAttendanceSummary(attendanceRows);
  const totalEmployees =
    employees.length || source?.stats?.activeEmployees || 248;
  const newHires =
    employees.filter((emp) => isRecentDate(emp.created_at || emp.join_date, 30))
      .length || 12;

  const pendingLeaveRequests =
    leaves.filter((leave) => {
      const status = String(leave.status || "").toLowerCase();
      return status === "pending" || status === "submitted";
    }).length || 5;

  const quickActions = [
    {
      permission: "employees",
      iconKey: "users",
      title: t(language, "الموظفين", "Employees"),
      subtitle: t(language, "إضافة موظف", "Add Employee"),
      color: "#7d0a12",
    },
    {
      permission: "recruitment",
      iconKey: "userPlus",
      title: t(language, "التوظيف", "Recruitment"),
      subtitle: t(language, "إدارة التوظيف", "Manage Hiring"),
      color: "#7d0a12",
    },
    {
      permission: "performance",
      iconKey: "barChart",
      title: t(language, "الأداء", "Performance"),
      subtitle: t(language, "إدارة الأداء", "Performance Ops"),
      color: "#7d0a12",
    },
    {
      permission: "payroll",
      iconKey: "creditCard",
      title: t(language, "الرواتب", "Payroll"),
      subtitle: t(language, "إدارة الرواتب", "Manage Payroll"),
      color: "#7d0a12",
    },
  ].filter((action) => canAccess(action.permission));

  return {
    attendance,
    stats: {
      totalEmployees,
      newHires,
      leaveDaysRemaining: 18,
      pendingLeaveRequests,
    },
    recentEmployees:
      recentEmployees.length > 0
        ? recentEmployees
        : [
            {
              name: t(language, "أحمد الفارسي", "Ahmed Al-Farsi"),
              position: t(language, "مسؤول HR", "HR Officer"),
              department: t(language, "الموارد البشرية", "Human Resources"),
              date: "02/04/2023",
            },
            {
              name: t(language, "ريم الحربي", "Reem Al-Harbi"),
              position: t(language, "متخصصة توظيف", "Recruiter"),
              department: t(language, "التوظيف", "Recruitment"),
              date: "20/03/2023",
            },
            {
              name: t(language, "عمر آل سعود", "Omar Al-Saud"),
              position: t(language, "متخصص رواتب", "Payroll Specialist"),
              department: t(language, "المالية", "Finance"),
              date: "20/04/2023",
            },
          ],
    upcomingLeaves:
      upcomingLeaves.length > 0
        ? upcomingLeaves
        : [
            {
              name: t(language, "مها الزهراني", "Maha Al-Zahrani"),
              period: "23 - 26 Apr",
            },
            {
              name: t(language, "فيصل القحطاني", "Faisal Al-Qahtani"),
              period: "23 - 25 Apr",
            },
          ],
    quickActions,
    attendancePeriods: {
      current: t(language, "هذا الشهر", "This Month"),
      options: [
        t(language, "هذا الأسبوع", "This Week"),
        t(language, "هذا الشهر", "This Month"),
        t(language, "هذا الربع", "This Quarter"),
      ],
    },
  };
}
