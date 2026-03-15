import React, { useMemo, useState } from "react";
import { FiEdit3, FiPlus, FiTrash2 } from "react-icons/fi";

const t = (language, ar, en) => (language === "ar" ? ar : en);

function makeEmptyForm() {
  return {
    name: "",
    position: "",
    department: "",
    status: "نشط",
    email: "",
    phone: "",
    salary: "",
    join_date: "",
  };
}

function normalizeStatusKey(value) {
  const raw = String(value || "")
    .trim()
    .toLowerCase();
  if (["active", "نشط", "نشط/ مؤقت", "نشط/اعارة"].includes(raw))
    return "active";
  if (["on_leave", "leave", "إجازة", "في إجازة"].includes(raw))
    return "on_leave";
  if (
    [
      "inactive",
      "غير نشط",
      "بلاغ هروب",
      "ملغي",
      "قيد الاجراء",
      "قيد الإجراء",
    ].includes(raw)
  )
    return "inactive";
  return "active";
}

function normalizeRows(language, employees = []) {
  return employees.map((item, index) => {
    const statusRaw = item.status || item.residence_status || "نشط";
    return {
      id: item.id || `row-${index}`,
      name: item.full_name || item.name || t(language, "موظف", "Employee"),
      position: item.position || item.job_title || "",
      department: item.department || item.branch_name || "",
      status: statusRaw,
      statusKey: normalizeStatusKey(statusRaw),
      email: item.email || "",
      phone: item.phone || "",
      salary: Number(item.salary || item.total_salary || 0),
      join_date: item.join_date || item.start_date || "",
      company_name: item.company_name || "",
    };
  });
}

const STATUS_STYLES = {
  active: {
    background: "rgba(184,148,106,0.15)",
    color: "#d4a574",
    border: "1px solid rgba(184,148,106,0.3)",
  },
  on_leave: {
    background: "rgba(125,10,18,0.2)",
    color: "#e08080",
    border: "1px solid rgba(125,10,18,0.4)",
  },
  inactive: {
    background: "rgba(100,100,100,0.15)",
    border: "1px solid rgba(100,100,100,0.2)",
  },
};

function StatusBadge({ statusKey, language, t, textMuted }) {
  const styles = STATUS_STYLES[statusKey] || STATUS_STYLES.inactive;
  const label =
    statusKey === "active"
      ? t(language, "نشط", "Active")
      : statusKey === "on_leave"
        ? t(language, "في إجازة", "On Leave")
        : t(language, "غير نشط", "Inactive");

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "0.22rem 0.65rem",
        borderRadius: "20px",
        fontSize: "0.75rem",
        fontWeight: 700,
        color: styles.color || textMuted,
        background: styles.background,
        border: styles.border,
      }}
    >
      {label}
    </span>
  );
}

export default function EmployeesModule({
  theme,
  language,
  isCompact,
  employees = [],
  mutatingEmployees = false,
  onAddEmployee,
  onUpdateEmployee,
  onDeleteEmployee,
}) {
  const [filter, setFilter] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(makeEmptyForm());

  const rows = useMemo(
    () => normalizeRows(language, employees),
    [employees, language],
  );
  const filteredRows = useMemo(
    () =>
      rows.filter((row) =>
        `${row.name} ${row.position} ${row.department} ${row.email}`
          .toLowerCase()
          .includes(filter.toLowerCase()),
      ),
    [rows, filter],
  );

  const activeCount = useMemo(
    () => rows.filter((row) => row.statusKey === "active").length,
    [rows],
  );
  const departmentsCount = useMemo(
    () => new Set(rows.map((row) => row.department).filter(Boolean)).size,
    [rows],
  );

  const labelStyle = {
    fontSize: "0.76rem",
    color: theme.textMuted,
    marginBottom: "0.25rem",
    fontWeight: 700,
  };
  const inputStyle = {
    width: "100%",
    borderRadius: 9,
    border: `1px solid ${theme.border}`,
    background: "transparent",
    color: theme.text,
    padding: "0.52rem 0.62rem",
    fontFamily: "inherit",
    fontSize: "0.82rem",
    outline: "none",
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(makeEmptyForm());
  };

  const submitEmployee = async (event) => {
    event.preventDefault();
    if (!form.name.trim()) return;

    const payload = {
      name: form.name.trim(),
      full_name: form.name.trim(),
      position: form.position.trim(),
      job_title: form.position.trim(),
      department: form.department.trim(),
      branch_name: form.department.trim(),
      status: form.status,
      residence_status: form.status,
      email: form.email.trim(),
      phone: form.phone.trim(),
      salary: form.salary ? Number(form.salary) : null,
      total_salary: form.salary ? Number(form.salary) : null,
      join_date: form.join_date || null,
      start_date: form.join_date || null,
    };

    const result = editingId
      ? await onUpdateEmployee?.(editingId, payload)
      : await onAddEmployee?.(payload);
    if (result?.success) resetForm();
  };

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
        {t(language, "الموظفون", "Employees")}
      </h2>
      <p style={{ margin: "0 0 1rem", color: theme.textMuted }}>
        {t(
          language,
          "إدارة بيانات الموظفين وربطها مباشرة بقاعدة البيانات",
          "Manage employees with direct database sync",
        )}
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isCompact ? "1fr 1fr" : "repeat(4, 1fr)",
          gap: "0.7rem",
          marginBottom: "0.9rem",
        }}
      >
        {[
          {
            label: t(language, "إجمالي الموظفين", "Total Employees"),
            value: rows.length,
          },
          { label: t(language, "النشطون", "Active"), value: activeCount },
          {
            label: t(language, "الأقسام", "Departments"),
            value: departmentsCount,
          },
          {
            label: t(language, "نتائج البحث", "Filtered"),
            value: filteredRows.length,
          },
        ].map((card) => (
          <div
            key={card.label}
            style={{
              borderRadius: 12,
              padding: "0.72rem 0.8rem",
              background: theme.surface,
              border: `1px solid ${theme.border}`,
            }}
          >
            <div
              style={{
                fontSize: "1.35rem",
                fontWeight: 900,
                color: theme.accent,
              }}
            >
              {card.value}
            </div>
            <div style={{ fontSize: "0.75rem", color: theme.textMuted }}>
              {card.label}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          background: theme.surface,
          border: `1px solid ${theme.border}`,
          borderRadius: 14,
          padding: isCompact ? "0.9rem" : "1.2rem",
        }}
      >
        <div style={{ marginBottom: "0.7rem" }}>
          <input
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            placeholder={t(
              language,
              "ابحث باسم الموظف أو القسم...",
              "Search by employee or department...",
            )}
            style={inputStyle}
          />
        </div>

        <form
          onSubmit={submitEmployee}
          style={{
            marginBottom: "0.9rem",
            border: `1px solid ${theme.border}`,
            borderRadius: 12,
            padding: "0.75rem",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isCompact ? "1fr" : "repeat(4, 1fr)",
              gap: "0.6rem",
            }}
          >
            <div>
              <div style={labelStyle}>{t(language, "الاسم", "Name")}</div>
              <input
                style={inputStyle}
                value={form.name}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, name: event.target.value }))
                }
                required
              />
            </div>
            <div>
              <div style={labelStyle}>{t(language, "المسمى", "Position")}</div>
              <input
                style={inputStyle}
                value={form.position}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, position: event.target.value }))
                }
              />
            </div>
            <div>
              <div style={labelStyle}>
                {t(language, "الفرع/القسم", "Branch/Department")}
              </div>
              <input
                style={inputStyle}
                value={form.department}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    department: event.target.value,
                  }))
                }
              />
            </div>
            <div>
              <div style={labelStyle}>
                {t(language, "حالة الإقامة", "Residence Status")}
              </div>
              <select
                style={inputStyle}
                value={form.status}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, status: event.target.value }))
                }
              >
                <option value="نشط">{t(language, "نشط", "Active")}</option>
                <option value="في إجازة">
                  {t(language, "في إجازة", "On Leave")}
                </option>
                <option value="غير نشط">
                  {t(language, "غير نشط", "Inactive")}
                </option>
              </select>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: isCompact ? "1fr" : "repeat(4, 1fr)",
              gap: "0.6rem",
              marginTop: "0.6rem",
            }}
          >
            <input
              type="email"
              style={inputStyle}
              value={form.email}
              placeholder={t(language, "البريد", "Email")}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, email: event.target.value }))
              }
            />
            <input
              style={inputStyle}
              value={form.phone}
              placeholder={t(language, "الهاتف", "Phone")}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, phone: event.target.value }))
              }
            />
            <input
              type="number"
              min="0"
              style={inputStyle}
              value={form.salary}
              placeholder={t(language, "الراتب الإجمالي", "Total Salary")}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, salary: event.target.value }))
              }
            />
            <input
              type="date"
              style={inputStyle}
              value={form.join_date}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, join_date: event.target.value }))
              }
            />
          </div>

          <div
            style={{ display: "flex", gap: "0.45rem", marginTop: "0.65rem" }}
          >
            <button
              type="submit"
              disabled={mutatingEmployees}
              style={{
                border: "none",
                borderRadius: 9,
                background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentLight})`,
                color: "#111",
                padding: "0.5rem 0.75rem",
                cursor: mutatingEmployees ? "not-allowed" : "pointer",
                fontWeight: 800,
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              <FiPlus size={14} />
              {editingId
                ? t(language, "حفظ التعديل", "Save Update")
                : t(language, "إضافة موظف", "Add Employee")}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                style={{
                  border: `1px solid ${theme.border}`,
                  borderRadius: 9,
                  background: "transparent",
                  color: theme.textMuted,
                  padding: "0.5rem 0.75rem",
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                {t(language, "إلغاء", "Cancel")}
              </button>
            )}
          </div>
        </form>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}
          >
            <thead>
              <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
                {[
                  t(language, "الاسم", "Name"),
                  t(language, "المسمى", "Position"),
                  t(language, "الفرع", "Branch"),
                  t(language, "الحالة", "Status"),
                  t(language, "التواصل", "Contact"),
                  t(language, "إجراءات", "Actions"),
                ].map((head) => (
                  <th
                    key={head}
                    style={{
                      textAlign: language === "ar" ? "right" : "left",
                      padding: "0.55rem 0.45rem",
                      fontSize: "0.76rem",
                      color: theme.textMuted,
                    }}
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => (
                <tr
                  key={row.id}
                  className="module-row"
                  style={{ borderBottom: `1px solid ${theme.border}` }}
                >
                  <td
                    style={{
                      padding: "0.6rem 0.45rem",
                      color: theme.text,
                      fontWeight: 700,
                    }}
                  >
                    {row.name}
                  </td>
                  <td style={{ padding: "0.6rem 0.45rem", color: theme.text }}>
                    {row.position || "--"}
                  </td>
                  <td style={{ padding: "0.6rem 0.45rem", color: theme.text }}>
                    {row.department || "--"}
                  </td>
                  <td style={{ padding: "0.6rem 0.45rem" }}>
                    <StatusBadge statusKey={row.statusKey} language={language} t={t} textMuted={theme.textMuted} />
                  </td>
                  <td style={{ padding: "0.6rem 0.45rem", color: theme.text }}>
                    {row.email || row.phone || "--"}
                  </td>
                  <td style={{ padding: "0.6rem 0.45rem" }}>
                    <div style={{ display: "inline-flex", gap: "0.35rem" }}>
                      <button
                        onClick={() => {
                          setEditingId(row.id);
                          setForm({
                            name: row.name || "",
                            position: row.position || "",
                            department: row.department || "",
                            status: row.status || "نشط",
                            email: row.email || "",
                            phone: row.phone || "",
                            salary: row.salary ? String(row.salary) : "",
                            join_date: row.join_date || "",
                          });
                        }}
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 8,
                          border: `1px solid ${theme.border}`,
                          background: "transparent",
                          color: theme.accent,
                          cursor: "pointer",
                        }}
                        title={t(language, "تعديل", "Edit")}
                      >
                        <FiEdit3 size={14} />
                      </button>
                      <button
                        onClick={async () => {
                          const allow = window.confirm(
                            t(
                              language,
                              "هل تريد حذف الموظف؟",
                              "Delete this employee?",
                            ),
                          );
                          if (!allow) return;
                          await onDeleteEmployee?.(row.id);
                          if (editingId === row.id) resetForm();
                        }}
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 8,
                          border: "1px solid rgba(239,68,68,0.4)",
                          background: "transparent",
                          color: "#ef4444",
                          cursor: "pointer",
                        }}
                        title={t(language, "حذف", "Delete")}
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!filteredRows.length && (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      padding: "0.9rem 0.45rem",
                      textAlign: "center",
                      color: theme.textMuted,
                      fontSize: "0.82rem",
                    }}
                  >
                    {t(
                      language,
                      "لا توجد نتائج مطابقة.",
                      "No matching results.",
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
