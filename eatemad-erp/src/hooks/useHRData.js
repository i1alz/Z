import { useCallback, useEffect, useMemo, useState } from "react";
import { api, getAuthToken } from "../config/supabase";
import { userHasPermission } from "../config/roleConfig";
import { buildHRDashboardData } from "../data/hrDashboardData";

const fallbackEmployees = [
  {
    id: "emp-1001",
    full_name: "Ahmed Al-Farsi",
    name: "Ahmed Al-Farsi",
    position: "HR Officer",
    department: "Human Resources",
    status: "active",
    created_at: "2023-04-02T10:00:00Z",
  },
  {
    id: "emp-1002",
    full_name: "Reem Al-Harbi",
    name: "Reem Al-Harbi",
    position: "Recruiter",
    department: "Recruitment",
    status: "active",
    created_at: "2023-03-20T10:00:00Z",
  },
  {
    id: "emp-1003",
    full_name: "Omar Al-Saud",
    name: "Omar Al-Saud",
    position: "Payroll Specialist",
    department: "Finance",
    status: "active",
    created_at: "2023-04-20T10:00:00Z",
  },
];

const fallbackAttendance = [
  {
    employee_name: "Ahmed Al-Farsi",
    status: "present",
    time_in: "08:00",
    date: "2026-03-10",
  },
  {
    employee_name: "Reem Al-Harbi",
    status: "present",
    time_in: "08:15",
    date: "2026-03-10",
  },
  {
    employee_name: "Omar Al-Saud",
    status: "late",
    time_in: "09:30",
    date: "2026-03-10",
  },
];

const fallbackLeaves = [
  {
    employee_name: "Maha Al-Zahrani",
    status: "pending",
    start_date: "2026-04-23",
    end_date: "2026-04-26",
  },
  {
    employee_name: "Faisal Al-Qahtani",
    status: "approved",
    start_date: "2026-04-23",
    end_date: "2026-04-25",
  },
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

function normalizeEmployee(employee = {}) {
  return {
    ...employee,
    id:
      employee.id ??
      employee.employee_id ??
      employee.uuid ??
      employee.code ??
      null,
    full_name:
      employee.full_name || employee.name || employee.employee_name || "",
    name: employee.name || employee.full_name || employee.employee_name || "",
    position: employee.position || employee.job_title || "",
    department: employee.department || employee.branch_name || "",
    status: employee.status || employee.residence_status || "active",
    company_name: employee.company_name || "",
    job_title: employee.job_title || employee.position || "",
    branch_name: employee.branch_name || employee.department || "",
    residence_status: employee.residence_status || employee.status || "",
    nationality: employee.nationality || "",
    email: employee.email || "",
    phone: employee.phone || employee.mobile || "",
    salary: Number(
      employee.salary || employee.total_salary || employee.basic_salary || 0,
    ),
    join_date: employee.join_date || employee.start_date || "",
    start_date: employee.start_date || employee.join_date || "",
    basic_salary: Number(employee.basic_salary || 0),
    allowances: Number(employee.allowances || 0),
    incentives: Number(employee.incentives || 0),
    total_salary: Number(employee.total_salary || employee.salary || 0),
    payment_method: employee.payment_method || "",
    insurance_company: employee.insurance_company || "",
    insurance_coverage: employee.insurance_coverage || "",
    food_permit_emirate: employee.food_permit_emirate || "",
    food_permit_expiry: employee.food_permit_expiry || "",
    health_card_emirate: employee.health_card_emirate || "",
    health_card_expiry: employee.health_card_expiry || "",
    passport_expiry: employee.passport_expiry || "",
    passport_held_by: employee.passport_held_by || "",
    residence_expiry: employee.residence_expiry || "",
    work_card_expiry: employee.work_card_expiry || "",
    created_at:
      employee.created_at || employee.inserted_at || employee.join_date || "",
  };
}

function uniquePayloadVariants(variants) {
  const used = new Set();
  return variants.filter((item) => {
    const cleaned = Object.fromEntries(
      Object.entries(item).filter(
        ([, value]) => value !== "" && value !== null && value !== undefined,
      ),
    );
    const key = JSON.stringify(cleaned);
    if (!key || key === "{}" || used.has(key)) return false;
    used.add(key);
    return true;
  });
}

function buildEmployeePayloadVariants(employeeInput) {
  const normalized = normalizeEmployee(employeeInput);

  return uniquePayloadVariants([
    {
      full_name: normalized.full_name,
      company_name: normalized.company_name || "شركة ركن الاعتماد",
      job_title: normalized.job_title || normalized.position,
      nationality: normalized.nationality || undefined,
      phone: normalized.phone || undefined,
      branch_name: normalized.branch_name || normalized.department || undefined,
      residence_status:
        normalized.residence_status || normalized.status || undefined,
      start_date: normalized.start_date || normalized.join_date || undefined,
      basic_salary: normalized.basic_salary || undefined,
      allowances: normalized.allowances || undefined,
      incentives: normalized.incentives || undefined,
      total_salary: normalized.total_salary || normalized.salary || undefined,
      payment_method: normalized.payment_method || undefined,
      insurance_company: normalized.insurance_company || undefined,
      insurance_coverage: normalized.insurance_coverage || undefined,
      food_permit_emirate: normalized.food_permit_emirate || undefined,
      food_permit_expiry: normalized.food_permit_expiry || undefined,
      health_card_emirate: normalized.health_card_emirate || undefined,
      health_card_expiry: normalized.health_card_expiry || undefined,
      passport_expiry: normalized.passport_expiry || undefined,
      passport_held_by: normalized.passport_held_by || undefined,
      residence_expiry: normalized.residence_expiry || undefined,
      work_card_expiry: normalized.work_card_expiry || undefined,
    },
    {
      full_name: normalized.full_name,
      name: normalized.name,
      position: normalized.position,
      department: normalized.department,
      status: normalized.status,
      email: normalized.email,
      phone: normalized.phone,
      salary: normalized.salary || undefined,
      join_date: normalized.join_date,
    },
    {
      full_name: normalized.full_name,
      name: normalized.name,
      position: normalized.position,
      department: normalized.department,
      status: normalized.status,
      email: normalized.email,
      phone: normalized.phone,
    },
    {
      full_name: normalized.full_name,
      name: normalized.name,
      position: normalized.position,
      department: normalized.department,
      status: normalized.status,
    },
    {
      full_name: normalized.full_name,
      name: normalized.name,
    },
    {
      name: normalized.name,
    },
  ]);
}

async function attemptEmployeeMutation({ mode, token, id, payloadVariants }) {
  let lastError = "Failed to save employee";

  for (const payload of payloadVariants) {
    let result;
    if (mode === "create") {
      result = await api.createEmployee(payload, token);
    } else {
      result = await api.updateEmployee(id, payload, token);
    }

    if (result?.success) {
      return { success: true, data: result.data || null };
    }

    lastError = result?.error || lastError;
  }

  return { success: false, error: lastError };
}

function mapModuleRecords(language, module, records = []) {
  if (!Array.isArray(records)) return [];

  if (module === "employees") {
    return records.slice(0, 60).map((item, index) => {
      const emp = normalizeEmployee(item);
      return {
        id: emp.id || `emp-${index}`,
        name: emp.full_name || emp.name || t(language, "موظف", "Employee"),
        status: emp.status || t(language, "نشط", "Active"),
        meta: emp.position || emp.department || "--",
        email: emp.email,
        phone: emp.phone,
        department: emp.department,
        position: emp.position,
        joinDate: emp.join_date,
        salary: emp.salary,
        color: "#22c55e",
      };
    });
  }

  if (module === "attendance") {
    return records.slice(0, 40).map((item, index) => {
      const status = normalizeStatus(item.status);
      const color =
        status === "present"
          ? "#22c55e"
          : status === "late"
            ? "#f59e0b"
            : "#ef4444";
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
        name:
          item.employee_name ||
          item.full_name ||
          item.name ||
          t(language, "موظف", "Employee"),
        status: translatedStatus,
        meta: item.time_in || item.date || "--",
        color,
        editValues: {
          name: item.employee_name || item.full_name || item.name || "",
          status: item.status || "present",
          time_in: item.time_in || "",
          date: item.date || "",
        },
      };
    });
  }

  if (module === "leaves") {
    return records.slice(0, 40).map((item, index) => {
      const status = normalizeStatus(item.status);
      const color =
        status === "approved"
          ? "#22c55e"
          : status === "rejected"
            ? "#ef4444"
            : "#f59e0b";
      const translatedStatus =
        status === "approved"
          ? t(language, "موافق عليه", "Approved")
          : status === "rejected"
            ? t(language, "مرفوض", "Rejected")
            : t(language, "معلق", "Pending");
      return {
        id: item.id || `lev-${index}`,
        name:
          item.employee_name ||
          item.full_name ||
          item.name ||
          t(language, "موظف", "Employee"),
        status: translatedStatus,
        meta: formatRange(item.start_date, item.end_date),
        color,
        editValues: {
          name: item.employee_name || item.full_name || item.name || "",
          status: item.status || "pending",
          start_date: item.start_date || "",
          end_date: item.end_date || "",
        },
      };
    });
  }

  if (module === "payroll") {
    return records.slice(0, 40).map((item, index) => {
      const status = normalizeStatus(item.status);
      const color =
        status === "paid"
          ? "#22c55e"
          : status === "processing"
            ? "#f59e0b"
            : "#ef4444";
      return {
        id: item.id || `pay-${index}`,
        name:
          item.department_name ||
          item.name ||
          item.employee_name ||
          t(language, "قسم", "Department"),
        status:
          status === "paid"
            ? t(language, "تم الدفع", "Paid")
            : status === "processing"
              ? t(language, "قيد المعالجة", "Processing")
              : item.status || "--",
        meta:
          typeof item.amount === "number"
            ? `${item.amount.toLocaleString()} AED`
            : item.period || "--",
        color,
        editValues: {
          name: item.department_name || item.name || item.employee_name || "",
          status: item.status || "processing",
          amount: item.amount ?? "",
          period: item.period || "",
        },
      };
    });
  }

  if (module === "recruitment") {
    return records.slice(0, 40).map((item, index) => ({
      id: item.id || `rec-${index}`,
      name:
        item.title ||
        item.position ||
        t(language, "وظيفة شاغرة", "Open Position"),
      status:
        normalizeStatus(item.status) === "open"
          ? t(language, "مفتوح", "Open")
          : normalizeStatus(item.status) === "interview"
            ? t(language, "مقابلات", "Interviews")
            : item.status || "--",
      meta: item.applicants_count
        ? `${item.applicants_count} applicants`
        : "--",
      color: "#3b82f6",
      editValues: {
        title: item.title || item.position || "",
        status: item.status || "open",
        applicants_count: item.applicants_count ?? "",
      },
    }));
  }

  if (module === "performance") {
    return records.slice(0, 40).map((item, index) => ({
      id: item.id || `per-${index}`,
      name:
        item.employee_name ||
        item.full_name ||
        item.name ||
        t(language, "موظف", "Employee"),
      status:
        item.score >= 90
          ? t(language, "ممتاز", "Excellent")
          : item.score >= 80
            ? t(language, "جيد جداً", "Very Good")
            : t(language, "جيد", "Good"),
      meta: item.score ? `${item.score}%` : item.rating || "--",
      color: "#8b5cf6",
      editValues: {
        name: item.employee_name || item.full_name || item.name || "",
        score: item.score ?? "",
        rating: item.rating || "",
        review_date: item.review_date || "",
      },
    }));
  }

  return [];
}

function buildModuleData(language, raw) {
  return {
    employees: {
      title: t(language, "الموظفون", "Employees"),
      subtitle: t(
        language,
        "إدارة بيانات الموظفين الأساسية",
        "Manage employee records",
      ),
      records: mapModuleRecords(language, "employees", raw.employees),
    },
    attendance: {
      title: t(language, "الحضور والانصراف", "Attendance"),
      subtitle: t(
        language,
        "تتبع حضور وانصراف الموظفين",
        "Track attendance records",
      ),
      records: mapModuleRecords(language, "attendance", raw.attendance),
    },
    leaves: {
      title: t(language, "إدارة الإجازات", "Leave Management"),
      subtitle: t(
        language,
        "عرض وإدارة طلبات الإجازات",
        "Manage leave requests",
      ),
      records: mapModuleRecords(language, "leaves", raw.leaves),
    },
    payroll: {
      title: t(language, "إدارة الرواتب", "Payroll"),
      subtitle: t(
        language,
        "تشغيل الرواتب وإدارة الدورات",
        "Process payroll cycles",
      ),
      records: mapModuleRecords(language, "payroll", raw.payroll),
    },
    recruitment: {
      title: t(language, "التوظيف", "Recruitment"),
      subtitle: t(
        language,
        "إدارة الوظائف والمقابلات",
        "Hiring pipeline and interviews",
      ),
      records: mapModuleRecords(language, "recruitment", raw.recruitment),
    },
    performance: {
      title: t(language, "تقييم الأداء", "Performance"),
      subtitle: t(
        language,
        "متابعة تقييمات الموظفين",
        "Track employee reviews",
      ),
      records: mapModuleRecords(language, "performance", raw.performance),
    },
  };
}



const MODULE_PERMISSION = {
  employees: "employees",
  attendance: "attendance",
  leaves: "leaves",
  payroll: "payroll",
  recruitment: "recruitment",
  performance: "performance",
};

function buildModulePayload(module, input = {}, mode = "create") {
  const isUpdate = mode === "update";
  if (module === "attendance") {
    const payload = {
      employee_name: input.name || input.employee_name || "",
      status: input.status || "present",
      time_in: input.time_in || input.meta || null,
      date: input.date,
    };
    if (!isUpdate && !payload.date) {
      payload.date = new Date().toISOString().slice(0, 10);
    }
    if (isUpdate && !input.date) delete payload.date;
    return payload;
  }
  if (module === "leaves") {
    const payload = {
      employee_name: input.name || input.employee_name || "",
      status: input.status || "pending",
      start_date: input.start_date,
      end_date: input.end_date || input.start_date,
    };
    if (!isUpdate) {
      const defaultDate = new Date().toISOString().slice(0, 10);
      payload.start_date = payload.start_date || defaultDate;
      payload.end_date = payload.end_date || payload.start_date || defaultDate;
    } else {
      if (!input.start_date) delete payload.start_date;
      if (!input.end_date && !input.start_date) delete payload.end_date;
    }
    return payload;
  }
  if (module === "payroll") {
    const payload = {
      name: input.name || "",
      department_name: input.department_name || input.name || "",
      status: input.status || "processing",
      amount: Number(input.amount || 0) || null,
      period: input.period,
    };
    if (!isUpdate && !payload.period) payload.period = new Date().toISOString().slice(0, 7);
    if (isUpdate && !input.period) delete payload.period;
    return payload;
  }
  if (module === "recruitment") {
    return {
      title: input.title || input.name || "",
      status: input.status || "open",
      applicants_count: Number(input.applicants_count || 0) || 0,
    };
  }
  if (module === "performance") {
    const payload = {
      employee_name: input.name || input.employee_name || "",
      score: Number(input.score || 0) || 0,
      rating: input.rating || input.status || "good",
      review_date: input.review_date,
    };
    if (!isUpdate && !payload.review_date) {
      payload.review_date = new Date().toISOString().slice(0, 10);
    }
    if (isUpdate && !input.review_date) delete payload.review_date;
    return payload;
  }
  return input;
}

export function useHRData({ language = "ar", user } = {}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mutating, setMutating] = useState({
    employees: false,
    attendance: false,
    leaves: false,
    payroll: false,
    recruitment: false,
    performance: false,
  });
  const [operationError, setOperationError] = useState({
    employees: "",
    attendance: "",
    leaves: "",
    payroll: "",
    recruitment: "",
    performance: "",
  });
  const [rawData, setRawData] = useState({
    employees: fallbackEmployees,
    attendance: fallbackAttendance,
    leaves: fallbackLeaves,
    payroll: fallbackPayroll,
    recruitment: fallbackRecruitment,
    performance: fallbackPerformance,
    stats: {},
  });

  const ensurePermission = useCallback((module) => {
    const permission = MODULE_PERMISSION[module];
    if (userHasPermission(user?.permissions || [], permission)) return null;
    return t(language, "ليس لديك صلاحية لهذه العملية", "You do not have permission for this action");
  }, [language, user?.permissions]);

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
    const recruitment = recruitmentRes?.success && recruitmentRes.data.length ? recruitmentRes.data : fallbackRecruitment;
    const performance = performanceRes?.success && performanceRes.data.length ? performanceRes.data : fallbackPerformance;
    const stats = statsRes?.success ? statsRes.data || {} : {};

    const hasApiFailure = [employeesRes, attendanceRes, leavesRes, payrollRes, recruitmentRes, performanceRes].some(
      (res) => res && !res.success,
    );

    if (hasApiFailure) {
      setError(
        t(
          language,
          "تم تحميل بعض البيانات من النسخة الاحتياطية بسبب تعذر الوصول الكامل لقاعدة البيانات.",
          "Some records were loaded from fallback data due to partial database connectivity.",
        ),
      );
    }

    setRawData({ employees, attendance, leaves, payroll, recruitment, performance, stats });
    setLoading(false);
  }, [language]);

  useEffect(() => {
    refresh();
  }, [refresh, language, user?.id]);

  const runModuleMutation = useCallback(async (module, operation) => {
    const permissionError = ensurePermission(module);
    if (permissionError) {
      setOperationError((prev) => ({ ...prev, [module]: permissionError }));
      return { success: false, error: permissionError };
    }

    setMutating((prev) => ({ ...prev, [module]: true }));
    setOperationError((prev) => ({ ...prev, [module]: "" }));
    setError("");

    const result = await operation();

    if (!result?.success) {
      const message = result?.error || t(language, "تعذر إتمام العملية", "Unable to complete operation");
      setOperationError((prev) => ({ ...prev, [module]: message }));
      setMutating((prev) => ({ ...prev, [module]: false }));
      return { success: false, error: message };
    }

    await refresh();
    setMutating((prev) => ({ ...prev, [module]: false }));
    return { success: true, data: result.data || null };
  }, [ensurePermission, language, refresh]);

  const addEmployee = useCallback(async (employeeInput) => {
    return runModuleMutation("employees", async () => {
      const token = getAuthToken();
      const variants = buildEmployeePayloadVariants(employeeInput);
      return attemptEmployeeMutation({ mode: "create", token, payloadVariants: variants });
    });
  }, [runModuleMutation]);

  const updateEmployee = useCallback(async (id, employeeInput) => {
    return runModuleMutation("employees", async () => {
      const token = getAuthToken();
      const variants = buildEmployeePayloadVariants(employeeInput);
      return attemptEmployeeMutation({ mode: "update", token, id, payloadVariants: variants });
    });
  }, [runModuleMutation]);

  const deleteEmployee = useCallback(async (id) => {
    return runModuleMutation("employees", async () => {
      const token = getAuthToken();
      return api.deleteEmployee(id, token);
    });
  }, [runModuleMutation]);

  const moduleApi = {
    attendance: {
      create: api.createAttendanceRecord.bind(api),
      update: api.updateAttendanceRecord.bind(api),
      remove: api.deleteAttendanceRecord.bind(api),
    },
    leaves: {
      create: api.createLeaveRequest.bind(api),
      update: api.updateLeaveRequest.bind(api),
      remove: api.deleteLeaveRequest.bind(api),
    },
    payroll: {
      create: api.createPayrollRecord.bind(api),
      update: api.updatePayrollRecord.bind(api),
      remove: api.deletePayrollRecord.bind(api),
    },
    recruitment: {
      create: api.createRecruitmentRecord.bind(api),
      update: api.updateRecruitmentRecord.bind(api),
      remove: api.deleteRecruitmentRecord.bind(api),
    },
    performance: {
      create: api.createPerformanceRecord.bind(api),
      update: api.updatePerformanceRecord.bind(api),
      remove: api.deletePerformanceRecord.bind(api),
    },
  };

  const addModuleRecord = useCallback(async (module, input) => {
    return runModuleMutation(module, async () => {
      const token = getAuthToken();
      return moduleApi[module].create(buildModulePayload(module, input, "create"), token);
    });
  }, [runModuleMutation]);

  const updateModuleRecord = useCallback(async (module, id, input) => {
    return runModuleMutation(module, async () => {
      const token = getAuthToken();
      return moduleApi[module].update(id, buildModulePayload(module, input, "update"), token);
    });
  }, [runModuleMutation]);

  const deleteModuleRecord = useCallback(async (module, id) => {
    return runModuleMutation(module, async () => {
      const token = getAuthToken();
      return moduleApi[module].remove(id, token);
    });
  }, [runModuleMutation]);

  const dashboardData = useMemo(() =>
    buildHRDashboardData({ language, permissions: user?.permissions || [], source: rawData }),
    [language, rawData, user?.permissions],
  );

  const moduleData = useMemo(() => buildModuleData(language, rawData), [language, rawData]);

  const employees = useMemo(
    () => (Array.isArray(rawData.employees) ? rawData.employees.map((item) => normalizeEmployee(item)) : []),
    [rawData.employees],
  );

  return {
    loading,
    error,
    operationError,
    dashboardData,
    moduleData,
    employees,
    mutatingEmployees: mutating.employees,
    mutating,
    refresh,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    addModuleRecord,
    updateModuleRecord,
    deleteModuleRecord,
  };
}
