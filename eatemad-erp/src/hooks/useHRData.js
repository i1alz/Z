import { useCallback, useEffect, useMemo, useState } from "react";
import { api, getAuthToken } from "../config/supabase";
import { buildHRDashboardData } from "../data/hrDashboardData";

const fallbackEmployees = [
  {
    id: "emp-1001",
    full_name: "Ahmed Al-Farsi",
    name: "Ahmed Al-Farsi",
    position: "HR Officer",
    department: "Human Resources",
    created_at: "2023-04-02T10:00:00Z",
  },
  {
    id: "emp-1002",
    full_name: "Reem Al-Harbi",
    name: "Reem Al-Harbi",
    position: "Recruiter",
    department: "Recruitment",
    created_at: "2023-03-20T10:00:00Z",
  },
  {
    id: "emp-1003",
    full_name: "Omar Al-Saud",
    name: "Omar Al-Saud",
    position: "Payroll Specialist",
    department: "Finance",
    created_at: "2023-04-20T10:00:00Z",
  },
];

const fallbackAttendance = [
  { employee_name: "Ahmed Al-Farsi", status: "present", time_in: "08:00", date: "2026-03-10" },
  { employee_name: "Reem Al-Harbi", status: "present", time_in: "08:15", date: "2026-03-10" },
  { employee_name: "Omar Al-Saud", status: "late", time_in: "09:30", date: "2026-03-10" },
];

const fallbackLeaves = [
  { employee_name: "Maha Al-Zahrani", status: "pending", start_date: "2026-04-23", end_date: "2026-04-26" },
  { employee_name: "Faisal Al-Qahtani", status: "approved", start_date: "2026-04-23", end_date: "2026-04-25" },
];

const fallbackPayroll = [
  { name: "Management", status: "paid", amount: 85000, period: "2026-03" },
  { name: "IT Dept", status: "paid", amount: 120000, period: "2026-03" },
];

const fallbackRecruitment = [
  { title: "Software Engineer", status: "open", applicants_count: 12 },
  { title: "Accountant", status: "interview", applicants_count: 5 },
];

const fallbackPerformance = [
  { employee_name: "Ahmed Al-Farsi", score: 95, rating: "excellent" },
  { employee_name: "Reem Al-Harbi", score: 88, rating: "very_good" },
];

const isArabic = (language) => language === "ar";

const t = (language, ar, en) => (isArabic(language) ? ar : en);

function formatRange(startDate, endDate) {
  if (!startDate || !endDate) return "--";
  const start = new Date(startDate);
  const end = new Date(endDate);
  const month = start.toLocaleString("en-US", { month: "short" });
  return `${start.getDate()} - ${end.getDate()} ${month}`;
}

function normalizeStatus(status = "") {
  return String(status).toLowerCase().trim();
}

function mapModuleRecords(language, module, records = []) {
  if (!Array.isArray(records)) return [];

  if (module === "employees") {
    return records.slice(0, 40).map((item, index) => ({
      id: item.id || `emp-${index}`,
      name: item.full_name || item.name || item.employee_name || t(language, "موظف", "Employee"),
      status: item.status || t(language, "نشط", "Active"),
      meta: item.position || item.department || item.employee_code || "--",
      color: "#22c55e",
    }));
  }

  if (module === "attendance") {
    return records.slice(0, 40).map((item, index) => {
      const status = normalizeStatus(item.status);
      const color =
        status === "present" ? "#22c55e" : status === "late" ? "#f59e0b" : "#ef4444";
      const translatedStatus =
        status === "present"
          ? t(language, "حاضر", "Present")
          : status === "late"
            ? t(language, "متأخر", "Late")
            : status === "absent"
              ? t(language, "غائب", "Absent")
              : item.status || "--";
      return {
        id: item.id || `att-${index}`,
        name: item.employee_name || item.full_name || item.name || t(language, "موظف", "Employee"),
        status: translatedStatus,
        meta: item.time_in || item.date || "--",
        color,
      };
    });
  }

  if (module === "leaves") {
    return records.slice(0, 40).map((item, index) => {
      const status = normalizeStatus(item.status);
      const color = status === "approved" ? "#22c55e" : status === "rejected" ? "#ef4444" : "#f59e0b";
      const translatedStatus =
        status === "approved"
          ? t(language, "موافق عليه", "Approved")
          : status === "rejected"
            ? t(language, "مرفوض", "Rejected")
            : t(language, "معلق", "Pending");
      return {
        id: item.id || `lev-${index}`,
        name: item.employee_name || item.full_name || item.name || t(language, "موظف", "Employee"),
        status: translatedStatus,
        meta: formatRange(item.start_date, item.end_date),
        color,
      };
    });
  }

  if (module === "payroll") {
    return records.slice(0, 40).map((item, index) => {
      const status = normalizeStatus(item.status);
      const color = status === "paid" ? "#22c55e" : status === "processing" ? "#f59e0b" : "#ef4444";
      return {
        id: item.id || `pay-${index}`,
        name: item.department_name || item.name || item.employee_name || t(language, "قسم", "Department"),
        status:
          status === "paid"
            ? t(language, "تم الدفع", "Paid")
            : status === "processing"
              ? t(language, "قيد المعالجة", "Processing")
              : item.status || "--",
        meta: typeof item.amount === "number" ? `${item.amount.toLocaleString()} SAR` : item.period || "--",
        color,
      };
    });
  }

  if (module === "recruitment") {
    return records.slice(0, 40).map((item, index) => ({
      id: item.id || `rec-${index}`,
      name: item.title || item.position || t(language, "وظيفة شاغرة", "Open Position"),
      status:
        normalizeStatus(item.status) === "open"
          ? t(language, "مفتوح", "Open")
          : normalizeStatus(item.status) === "interview"
            ? t(language, "مقابلات", "Interviews")
            : item.status || "--",
      meta: item.applicants_count ? `${item.applicants_count} applicants` : "--",
      color: "#3b82f6",
    }));
  }

  if (module === "performance") {
    return records.slice(0, 40).map((item, index) => ({
      id: item.id || `per-${index}`,
      name: item.employee_name || item.full_name || item.name || t(language, "موظف", "Employee"),
      status:
        item.score >= 90
          ? t(language, "ممتاز", "Excellent")
          : item.score >= 80
            ? t(language, "جيد جداً", "Very Good")
            : t(language, "جيد", "Good"),
      meta: item.score ? `${item.score}%` : item.rating || "--",
      color: "#8b5cf6",
    }));
  }

  return [];
}

function buildModuleData(language, raw) {
  return {
    employees: {
      title: t(language, "الموظفون", "Employees"),
      subtitle: t(language, "إدارة بيانات الموظفين الأساسية", "Manage employee records"),
      records: mapModuleRecords(language, "employees", raw.employees),
    },
    attendance: {
      title: t(language, "الحضور والانصراف", "Attendance"),
      subtitle: t(language, "تتبع حضور وانصراف الموظفين", "Track attendance records"),
      records: mapModuleRecords(language, "attendance", raw.attendance),
    },
    leaves: {
      title: t(language, "إدارة الإجازات", "Leave Management"),
      subtitle: t(language, "عرض وإدارة طلبات الإجازات", "Manage leave requests"),
      records: mapModuleRecords(language, "leaves", raw.leaves),
    },
    payroll: {
      title: t(language, "إدارة الرواتب", "Payroll"),
      subtitle: t(language, "تشغيل الرواتب وإدارة الدورات", "Process payroll cycles"),
      records: mapModuleRecords(language, "payroll", raw.payroll),
    },
    recruitment: {
      title: t(language, "التوظيف", "Recruitment"),
      subtitle: t(language, "إدارة الوظائف والمقابلات", "Hiring pipeline and interviews"),
      records: mapModuleRecords(language, "recruitment", raw.recruitment),
    },
    performance: {
      title: t(language, "تقييم الأداء", "Performance"),
      subtitle: t(language, "متابعة تقييمات الموظفين", "Track employee reviews"),
      records: mapModuleRecords(language, "performance", raw.performance),
    },
  };
}

export function useHRData({ language = "ar", user } = {}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rawData, setRawData] = useState({
    employees: fallbackEmployees,
    attendance: fallbackAttendance,
    leaves: fallbackLeaves,
    payroll: fallbackPayroll,
    recruitment: fallbackRecruitment,
    performance: fallbackPerformance,
    stats: {},
  });

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    const token = getAuthToken();

    const [employeesRes, attendanceRes, leavesRes, payrollRes, recruitmentRes, performanceRes, statsRes] =
      await Promise.all([
        api.getEmployees(token),
        api.getAttendanceRecords(token),
        api.getLeaveRequests(token),
        api.getPayrollRecords(token),
        api.getRecruitmentRecords(token),
        api.getPerformanceRecords(token),
        api.getDashboardStats(token),
      ]);

    const employees = employeesRes?.success && employeesRes.data.length ? employeesRes.data : fallbackEmployees;
    const attendance = attendanceRes?.success && attendanceRes.data.length ? attendanceRes.data : fallbackAttendance;
    const leaves = leavesRes?.success && leavesRes.data.length ? leavesRes.data : fallbackLeaves;
    const payroll = payrollRes?.success && payrollRes.data.length ? payrollRes.data : fallbackPayroll;
    const recruitment =
      recruitmentRes?.success && recruitmentRes.data.length ? recruitmentRes.data : fallbackRecruitment;
    const performance =
      performanceRes?.success && performanceRes.data.length ? performanceRes.data : fallbackPerformance;
    const stats = statsRes?.success ? statsRes.data || {} : {};

    const hasApiFailure = [employeesRes, attendanceRes, leavesRes, payrollRes, recruitmentRes, performanceRes].some(
      (res) => res && !res.success
    );

    if (hasApiFailure) {
      setError(
        t(
          language,
          "تم تحميل بعض البيانات من النسخة الاحتياطية بسبب تعذر الوصول الكامل لقاعدة البيانات.",
          "Some records were loaded from fallback data due to partial database connectivity."
        )
      );
    }

    setRawData({
      employees,
      attendance,
      leaves,
      payroll,
      recruitment,
      performance,
      stats,
    });
    setLoading(false);
  }, [language]);

  useEffect(() => {
    refresh();
  }, [refresh, language, user?.id]);

  const dashboardData = useMemo(
    () =>
      buildHRDashboardData({
        language,
        permissions: user?.permissions || [],
        source: rawData,
      }),
    [language, rawData, user?.permissions]
  );

  const moduleData = useMemo(() => buildModuleData(language, rawData), [language, rawData]);

  return {
    loading,
    error,
    dashboardData,
    moduleData,
    refresh,
  };
}
