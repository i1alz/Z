// ═══════════════════════════════════════════════════════════
// SUPABASE CONFIGURATION
// ═══════════════════════════════════════════════════════════

export const supabaseUrl = "https://fmajfprdlczvfudhwbcj.supabase.co";
export const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZtYWpmcHJkbGN6dmZ1ZGh3YmNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1NTk2NDQsImV4cCI6MjA4ODEzNTY0NH0.EjCDKzsZvbT31mbaBhoW4DfZtVj0rNc1U3w_goSouaU";

const isUsableJwt = (token) =>
  typeof token === "string" &&
  token.split(".").length === 3 &&
  !token.startsWith("token-") &&
  token !== "demo-token" &&
  token !== "mock-token";

// API Helper Functions
const headers = (token) => ({
  "apikey": supabaseAnonKey,
  "Content-Type": "application/json",
  ...(isUsableJwt(token) && { "Authorization": `Bearer ${token}` }),
});

export const api = {
  async getTableRows(table, token, options = {}) {
    try {
      const {
        select = "*",
        orderBy = "created_at.desc",
        limit,
        filters = "",
      } = options;

      const params = new URLSearchParams();
      params.set("select", select);
      if (orderBy) params.set("order", orderBy);
      if (typeof limit === "number") params.set("limit", String(limit));

      const query = filters
        ? `${params.toString()}&${filters.replace(/^\?/, "")}`
        : params.toString();
      const response = await fetch(`${supabaseUrl}/rest/v1/${table}?${query}`, {
        headers: headers(token),
      });
      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data?.message || "Unable to load data", data: [] };
      }
      return { success: true, data: Array.isArray(data) ? data : [] };
    } catch (error) {
      return { success: false, error: error.message, data: [] };
    }
  },

  // Authentication
  async signIn(email, password) {
    try {
      const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();

      if (data.access_token) {
        localStorage.setItem('authToken', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        return { success: true, data };
      }
      return { success: false, error: data.error || 'Login failed' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async signUp(email, password, fullName) {
    try {
      const response = await fetch(`${supabaseUrl}/auth/v1/signup`, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({
          email,
          password,
          data: { full_name: fullName }
        })
      });
      const data = await response.json();
      return { success: !!data.id, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async signOut(token) {
    try {
      await fetch(`${supabaseUrl}/auth/v1/logout`, {
        method: "POST",
        headers: headers(token)
      });
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async resetPassword(email) {
    try {
      const response = await fetch(`${supabaseUrl}/auth/v1/recover`, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({ email })
      });
      return { success: response.ok };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // User Profile
  async getProfile(userId, token) {
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/profiles?id=eq.${userId}`, {
        headers: headers(token)
      });
      const data = await response.json();
      return { success: true, data: data[0] || null };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Employees
  async getEmployees(token) {
    return this.getTableRows("employees", token, { orderBy: "created_at.desc" });
  },

  async createEmployee(employeeData, token) {
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/employees`, {
        method: "POST",
        headers: headers(token),
        body: JSON.stringify(employeeData)
      });
      const data = await response.json();
      return { success: response.ok, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async updateEmployee(id, updates, token) {
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/employees?id=eq.${id}`, {
        method: "PATCH",
        headers: headers(token),
        body: JSON.stringify(updates)
      });
      return { success: response.ok };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Dashboard Stats
  async getDashboardStats(token) {
    try {
      // Mock data for now - replace with actual API calls
      return {
        success: true,
        data: {
          totalRevenue: 3456789,
          revenueChange: 15.3,
          activeEmployees: 248,
          employeesChange: 5,
          todaySales: 67890,
          salesChange: 8.7,
          activeProjects: 12,
          projectsChange: -2
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async getAttendanceRecords(token) {
    return this.getTableRows("attendance", token, { orderBy: "date.desc,time_in.desc", limit: 50 });
  },

  async getLeaveRequests(token) {
    return this.getTableRows("leave_requests", token, { orderBy: "created_at.desc", limit: 50 });
  },

  async getPayrollRecords(token) {
    return this.getTableRows("payroll", token, { orderBy: "period.desc,created_at.desc", limit: 50 });
  },

  async getRecruitmentRecords(token) {
    return this.getTableRows("recruitment", token, { orderBy: "created_at.desc", limit: 50 });
  },

  async getPerformanceRecords(token) {
    return this.getTableRows("performance_reviews", token, { orderBy: "review_date.desc,created_at.desc", limit: 50 });
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('authToken');
  return !!token;
};

// Get current user
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

// Get auth token
export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};
