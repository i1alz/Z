const DEFAULT_SUPABASE_URL = "https://vobrpyuonesphcqkoxns.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvYnJweXVvbmVzcGhjcWtveG5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzNTMzNDAsImV4cCI6MjA4ODkyOTM0MH0.HvKBCHGCWJhzQz50ngtBXRJRvClWYsjmu7mLw6yH1Ac";

const envUrl = String(import.meta.env?.VITE_SUPABASE_URL || "").trim();
const envAnonKey = String(import.meta.env?.VITE_SUPABASE_ANON_KEY || "").trim();
const hasCustomConfig = Boolean(envUrl || envAnonKey);

export const supabaseUrl = envUrl || DEFAULT_SUPABASE_URL;
export const supabaseAnonKey =
  envAnonKey || (hasCustomConfig ? "" : DEFAULT_SUPABASE_ANON_KEY);

const isUsableJwt = (token) =>
  typeof token === "string" &&
  token.split(".").length === 3 &&
  !token.startsWith("token-") &&
  token !== "demo-token" &&
  token !== "mock-token";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

const makeHeaders = (token, includeJson = true) => ({
  apikey: supabaseAnonKey,
  ...(includeJson ? { "Content-Type": "application/json" } : {}),
  ...(isUsableJwt(token) ? { Authorization: `Bearer ${token}` } : {}),
});

async function parseResponsePayload(response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function formatErrorMessage(payload, fallback = "Request failed") {
  if (!payload) return fallback;
  if (typeof payload === "string") return payload;
  return (
    payload.message || payload.error_description || payload.error || fallback
  );
}

async function request(
  path,
  { method = "GET", token, body, prefer, includeJson = true } = {},
) {
  if (!isSupabaseConfigured) {
    return {
      success: false,
      status: 0,
      data: null,
      error:
        "Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.",
    };
  }

  try {
    const headers = makeHeaders(token, includeJson);
    if (prefer) headers.Prefer = prefer;

    const response = await fetch(`${supabaseUrl}${path}`, {
      method,
      headers,
      ...(body !== undefined
        ? { body: includeJson ? JSON.stringify(body) : body }
        : {}),
    });

    const payload = await parseResponsePayload(response);
    if (!response.ok) {
      return {
        success: false,
        status: response.status,
        data: null,
        error: formatErrorMessage(payload, "Supabase request failed"),
      };
    }

    return {
      success: true,
      status: response.status,
      data: payload,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      status: 0,
      data: null,
      error: error.message || "Network error",
    };
  }
}

function buildSelectQuery({ select = "*", orderBy, limit, filters } = {}) {
  const params = new URLSearchParams();
  params.set("select", select);
  if (orderBy) params.set("order", orderBy);
  if (typeof limit === "number") params.set("limit", String(limit));

  if (filters && typeof filters === "string") {
    const filterText = filters.replace(/^\?/, "");
    if (filterText) return `${params.toString()}&${filterText}`;
  }

  return params.toString();
}

export const api = {
  async createTableRow(table, payload, token) {
    const result = await request(`/rest/v1/${table}`, {
      method: "POST",
      token,
      body: payload,
      prefer: "return=representation",
    });

    if (!result.success) {
      return { success: false, error: result.error, data: null };
    }

    return {
      success: true,
      data: Array.isArray(result.data) ? result.data[0] || null : result.data,
    };
  },

  async updateTableRow(table, id, updates, token) {
    if (!id) return { success: false, error: `Missing ${table} row id` };

    const filter = encodeURIComponent(String(id));
    const result = await request(`/rest/v1/${table}?id=eq.${filter}&select=*`, {
      method: "PATCH",
      token,
      body: updates,
      prefer: "return=representation",
    });

    if (!result.success) {
      return { success: false, error: result.error, data: null };
    }

    return {
      success: true,
      data: Array.isArray(result.data) ? result.data[0] || null : result.data,
    };
  },

  async deleteTableRow(table, id, token) {
    if (!id) return { success: false, error: `Missing ${table} row id` };

    const filter = encodeURIComponent(String(id));
    const result = await request(`/rest/v1/${table}?id=eq.${filter}`, {
      method: "DELETE",
      token,
      prefer: "return=representation",
    });

    if (!result.success) {
      return { success: false, error: result.error };
    }

    return { success: true };
  },

  async signIn(email, password) {
    const result = await request(`/auth/v1/token?grant_type=password`, {
      method: "POST",
      body: { email, password },
    });

    if (!result.success) {
      return { success: false, error: result.error };
    }

    if (!result.data?.access_token) {
      return { success: false, error: "Missing access token from Supabase" };
    }

    localStorage.setItem("authToken", result.data.access_token);
    return { success: true, data: result.data };
  },

  async signOut(token) {
    await request(`/auth/v1/logout`, { method: "POST", token });
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    return { success: true };
  },

  async getSessionUser(token) {
    const result = await request(`/auth/v1/user`, { token });
    if (!result.success) {
      return { success: false, error: result.error, data: null };
    }
    return { success: true, data: result.data };
  },

  async getProfile(userId, token) {
    if (!userId)
      return { success: false, error: "Missing user id", data: null };

    const query = new URLSearchParams({
      select: "*",
      id: `eq.${userId}`,
    }).toString();
    const result = await request(`/rest/v1/profiles?${query}`, { token });

    if (!result.success) {
      return { success: false, error: result.error, data: null };
    }

    return {
      success: true,
      data: Array.isArray(result.data) ? result.data[0] || null : result.data,
    };
  },

  async getTableRows(table, token, options = {}) {
    const query = buildSelectQuery(options);
    const result = await request(`/rest/v1/${table}?${query}`, { token });

    if (!result.success) {
      return { success: false, error: result.error, data: [] };
    }

    return {
      success: true,
      data: Array.isArray(result.data) ? result.data : [],
    };
  },

  async getEmployees(token) {
    return this.getTableRows("employees", token, {
      orderBy: "created_at.desc",
    });
  },

  async createEmployee(employeeData, token) {
    return this.createTableRow("employees", employeeData, token);
  },

  async updateEmployee(id, updates, token) {
    return this.updateTableRow("employees", id, updates, token);
  },

  async deleteEmployee(id, token) {
    return this.deleteTableRow("employees", id, token);
  },

  async createAttendanceRecord(payload, token) {
    return this.createTableRow("attendance", payload, token);
  },
  async updateAttendanceRecord(id, payload, token) {
    return this.updateTableRow("attendance", id, payload, token);
  },
  async deleteAttendanceRecord(id, token) {
    return this.deleteTableRow("attendance", id, token);
  },
  async createLeaveRequest(payload, token) {
    return this.createTableRow("leave_requests", payload, token);
  },
  async updateLeaveRequest(id, payload, token) {
    return this.updateTableRow("leave_requests", id, payload, token);
  },
  async deleteLeaveRequest(id, token) {
    return this.deleteTableRow("leave_requests", id, token);
  },
  async createPayrollRecord(payload, token) {
    return this.createTableRow("payroll", payload, token);
  },
  async updatePayrollRecord(id, payload, token) {
    return this.updateTableRow("payroll", id, payload, token);
  },
  async deletePayrollRecord(id, token) {
    return this.deleteTableRow("payroll", id, token);
  },
  async createRecruitmentRecord(payload, token) {
    return this.createTableRow("recruitment", payload, token);
  },
  async updateRecruitmentRecord(id, payload, token) {
    return this.updateTableRow("recruitment", id, payload, token);
  },
  async deleteRecruitmentRecord(id, token) {
    return this.deleteTableRow("recruitment", id, token);
  },
  async createPerformanceRecord(payload, token) {
    return this.createTableRow("performance_reviews", payload, token);
  },
  async updatePerformanceRecord(id, payload, token) {
    return this.updateTableRow("performance_reviews", id, payload, token);
  },
  async deletePerformanceRecord(id, token) {
    return this.deleteTableRow("performance_reviews", id, token);
  },

  async getDashboardStats(token) {
    try {
      const employeesRes = await this.getEmployees(token);
      const totalEmployees = employeesRes.success
        ? employeesRes.data.length
        : 0;

      return {
        success: true,
        data: {
          activeEmployees: totalEmployees,
          totalRevenue: 0,
          revenueChange: 0,
          todaySales: 0,
          salesChange: 0,
          activeProjects: 0,
          projectsChange: 0,
        },
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async getAttendanceRecords(token) {
    return this.getTableRows("attendance", token, {
      orderBy: "date.desc,time_in.desc",
      limit: 50,
    });
  },

  async getLeaveRequests(token) {
    return this.getTableRows("leave_requests", token, {
      orderBy: "created_at.desc",
      limit: 50,
    });
  },

  async getPayrollRecords(token) {
    return this.getTableRows("payroll", token, {
      orderBy: "period.desc,created_at.desc",
      limit: 50,
    });
  },

  async getRecruitmentRecords(token) {
    return this.getTableRows("recruitment", token, {
      orderBy: "created_at.desc",
      limit: 50,
    });
  },

  async getPerformanceRecords(token) {
    return this.getTableRows("performance_reviews", token, {
      orderBy: "review_date.desc,created_at.desc",
      limit: 50,
    });
  },

  // ── User Management (Admin) ──────────────────────────────────────────
  async inviteUser(email, { role = "hr_specialist", fullName = "", department = "" } = {}, token) {
    // Invite user by email – Supabase sends a magic link
    const result = await request(`/auth/v1/invite`, {
      method: "POST",
      token,
      body: {
        email,
        data: { role, full_name: fullName, department },
      },
    });
    return result;
  },

  async createUserWithPassword(email, password, { role = "hr_specialist", fullName = "", department = "" } = {}, token) {
    // Sign up a new user directly (requires email confirmation disabled in Supabase or auto-confirm)
    const result = await request(`/auth/v1/admin/users`, {
      method: "POST",
      token,
      body: {
        email,
        password,
        email_confirm: true,
        user_metadata: { role, full_name: fullName, department },
      },
    });
    return result;
  },

  async listAuthUsers(token) {
    const result = await request(`/auth/v1/admin/users?page=1&per_page=200`, { token });
    if (!result.success) return { success: false, error: result.error, data: [] };
    const users = result.data?.users || result.data || [];
    return { success: true, data: Array.isArray(users) ? users : [] };
  },

  async updateUserRole(userId, { role, fullName, department } = {}, token) {
    const result = await request(`/auth/v1/admin/users/${userId}`, {
      method: "PUT",
      token,
      body: {
        user_metadata: { role, full_name: fullName, department },
      },
    });
    return result;
  },

  async deleteAuthUser(userId, token) {
    const result = await request(`/auth/v1/admin/users/${userId}`, {
      method: "DELETE",
      token,
    });
    return result;
  },
};

export const isAuthenticated = () => {
  const token = localStorage.getItem("authToken");
  return Boolean(token);
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

export const getAuthToken = () => localStorage.getItem("authToken");
