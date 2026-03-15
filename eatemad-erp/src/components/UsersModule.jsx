import React, { useCallback, useEffect, useState } from "react";
import {
  FiUserPlus,
  FiRefreshCw,
  FiTrash2,
  FiMail,
  FiLock,
  FiUser,
  FiShield,
  FiX,
  FiCheck,
  FiAlertCircle,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import { api, getAuthToken } from "../config/supabase";
import { ROLE_CONFIG } from "../config/roleConfig";

const t = (lang, ar, en) => (lang === "ar" ? ar : en);

const ROLES = Object.entries(ROLE_CONFIG).map(([key, val]) => ({
  key,
  label: { ar: val.titles.ar, en: val.titles.en },
}));

function Toast({ msg, type, onClose }) {
  useEffect(() => {
    const id = setTimeout(onClose, 4000);
    return () => clearTimeout(id);
  }, [onClose]);

  const bg = type === "success" ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)";
  const border = type === "success" ? "rgba(34,197,94,0.4)" : "rgba(239,68,68,0.4)";
  const color = type === "success" ? "#86efac" : "#fca5a5";
  const Icon = type === "success" ? FiCheck : FiAlertCircle;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "1.5rem",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: "14px",
        padding: "0.85rem 1.2rem",
        display: "flex",
        alignItems: "center",
        gap: "0.6rem",
        color,
        backdropFilter: "blur(12px)",
        boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
        minWidth: 280,
        maxWidth: 400,
      }}
    >
      <Icon size={18} />
      <span style={{ fontSize: "0.9rem", fontWeight: 600, flex: 1 }}>{msg}</span>
      <button
        onClick={onClose}
        style={{ background: "none", border: "none", color, cursor: "pointer" }}
      >
        <FiX size={15} />
      </button>
    </div>
  );
}

export default function UsersModule({ theme, language, currentUser }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    fullName: "",
    department: "",
    role: "hr_specialist",
  });

  const isAdmin =
    currentUser?.permissions?.includes("*") ||
    currentUser?.role === "admin";

  const showToast = (msg, type = "success") => setToast({ msg, type });

  const loadUsers = useCallback(async () => {
    setLoading(true);
    const token = getAuthToken();
    const result = await api.listAuthUsers(token);
    if (result.success) {
      setUsers(result.data);
    } else {
      showToast(
        t(language, "تعذر تحميل المستخدمين: " + result.error, "Failed to load users: " + result.error),
        "error"
      );
    }
    setLoading(false);
  }, [language]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return;
    setSubmitting(true);

    const token = getAuthToken();
    const result = await api.createUserWithPassword(
      form.email,
      form.password,
      { role: form.role, fullName: form.fullName, department: form.department },
      token
    );

    if (result.success) {
      showToast(t(language, "تم إنشاء المستخدم بنجاح ✓", "User created successfully ✓"));
      setForm({ email: "", password: "", fullName: "", department: "", role: "hr_specialist" });
      setShowForm(false);
      await loadUsers();
    } else {
      showToast(
        t(language, "خطأ: " + result.error, "Error: " + result.error),
        "error"
      );
    }
    setSubmitting(false);
  };

  const handleDelete = async (userId, email) => {
    if (!window.confirm(t(language, `هل تريد حذف ${email}؟`, `Delete ${email}?`))) return;
    const token = getAuthToken();
    const result = await api.deleteAuthUser(userId, token);
    if (result.success) {
      showToast(t(language, "تم حذف المستخدم", "User deleted"));
      await loadUsers();
    } else {
      showToast(t(language, "فشل الحذف: " + result.error, "Delete failed: " + result.error), "error");
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "0.8rem 1rem",
    borderRadius: "10px",
    border: `1px solid ${theme.border}`,
    background: "rgba(0,0,0,0.25)",
    color: theme.text,
    fontFamily: "inherit",
    fontSize: "0.9rem",
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle = {
    color: theme.accent,
    fontSize: "0.82rem",
    fontWeight: 600,
    display: "block",
    marginBottom: "0.35rem",
  };

  return (
    <div style={{ direction: language === "ar" ? "rtl" : "ltr" }}>
      {toast && (
        <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />
      )}

      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
          gap: "0.8rem",
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: "1.9rem",
              fontWeight: 800,
              color: theme.accent,
            }}
          >
            {t(language, "إدارة المستخدمين", "User Management")}
          </h2>
          <p style={{ margin: "0.2rem 0 0", color: theme.textMuted, fontSize: "0.9rem" }}>
            {t(
              language,
              "إنشاء وإدارة حسابات المستخدمين في النظام",
              "Create and manage system user accounts"
            )}
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.6rem" }}>
          <button
            onClick={loadUsers}
            style={{
              padding: "0.65rem 1rem",
              borderRadius: "10px",
              border: `1px solid ${theme.border}`,
              background: theme.surface,
              color: theme.textMuted,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            <FiRefreshCw size={15} style={{ animation: loading ? "spin 1s linear infinite" : "none" }} />
            {t(language, "تحديث", "Refresh")}
          </button>
          {isAdmin && (
            <button
              onClick={() => setShowForm((v) => !v)}
              style={{
                padding: "0.65rem 1.1rem",
                borderRadius: "10px",
                border: "none",
                background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentLight})`,
                color: "#111",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              <FiUserPlus size={16} />
              {t(language, "مستخدم جديد", "New User")}
            </button>
          )}
        </div>
      </div>

      {/* Create User Form */}
      {showForm && isAdmin && (
        <div
          style={{
            background: theme.surface,
            border: `1px solid ${theme.border}`,
            borderRadius: "16px",
            padding: "1.5rem",
            marginBottom: "1.5rem",
            boxShadow: theme.shadow,
          }}
        >
          <h3 style={{ margin: "0 0 1.2rem", color: theme.accentLight, fontSize: "1.1rem", fontWeight: 700 }}>
            <FiUserPlus style={{ marginInlineEnd: "0.5rem", verticalAlign: "middle" }} />
            {t(language, "إنشاء مستخدم جديد", "Create New User")}
          </h3>
          <form onSubmit={handleCreate}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "1rem",
                marginBottom: "1rem",
              }}
            >
              <div>
                <label style={labelStyle}>
                  <FiUser size={12} style={{ marginInlineEnd: "0.3rem" }} />
                  {t(language, "الاسم الكامل", "Full Name")}
                </label>
                <input
                  style={inputStyle}
                  value={form.fullName}
                  onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                  placeholder={t(language, "مثال: أحمد الفارسي", "e.g. Ahmed Al-Farsi")}
                />
              </div>

              <div>
                <label style={labelStyle}>
                  <FiMail size={12} style={{ marginInlineEnd: "0.3rem" }} />
                  {t(language, "البريد الإلكتروني *", "Email *")}
                </label>
                <input
                  style={inputStyle}
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="user@eatemad.com"
                />
              </div>

              <div style={{ position: "relative" }}>
                <label style={labelStyle}>
                  <FiLock size={12} style={{ marginInlineEnd: "0.3rem" }} />
                  {t(language, "كلمة المرور *", "Password *")}
                </label>
                <input
                  style={{ ...inputStyle, paddingInlineEnd: "2.5rem" }}
                  type={showPass ? "text" : "password"}
                  required
                  minLength={6}
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  style={{
                    position: "absolute",
                    bottom: "0.75rem",
                    [language === "ar" ? "left" : "right"]: "0.75rem",
                    background: "none",
                    border: "none",
                    color: theme.textMuted,
                    cursor: "pointer",
                  }}
                >
                  {showPass ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                </button>
              </div>

              <div>
                <label style={labelStyle}>
                  <FiShield size={12} style={{ marginInlineEnd: "0.3rem" }} />
                  {t(language, "الدور الوظيفي", "Role")}
                </label>
                <select
                  style={{ ...inputStyle, cursor: "pointer" }}
                  value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                >
                  {ROLES.map((r) => (
                    <option key={r.key} value={r.key}>
                      {language === "ar" ? r.label.ar : r.label.en}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>
                  {t(language, "القسم", "Department")}
                </label>
                <input
                  style={inputStyle}
                  value={form.department}
                  onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
                  placeholder={t(language, "مثال: الموارد البشرية", "e.g. Human Resources")}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.7rem", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                style={{
                  padding: "0.7rem 1.2rem",
                  borderRadius: "10px",
                  border: `1px solid ${theme.border}`,
                  background: "transparent",
                  color: theme.textMuted,
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                {t(language, "إلغاء", "Cancel")}
              </button>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  padding: "0.7rem 1.4rem",
                  borderRadius: "10px",
                  border: "none",
                  background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentLight})`,
                  color: "#111",
                  fontWeight: 700,
                  cursor: submitting ? "not-allowed" : "pointer",
                  opacity: submitting ? 0.7 : 1,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                {submitting ? (
                  <FiRefreshCw size={15} style={{ animation: "spin 1s linear infinite" }} />
                ) : (
                  <FiCheck size={15} />
                )}
                {submitting
                  ? t(language, "جاري الإنشاء...", "Creating...")
                  : t(language, "إنشاء المستخدم", "Create User")}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users Table */}
      <div
        style={{
          background: theme.surface,
          border: `1px solid ${theme.border}`,
          borderRadius: "16px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "1rem 1.4rem",
            borderBottom: `1px solid ${theme.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <strong style={{ color: theme.text }}>
            {t(language, "المستخدمون المسجلون", "Registered Users")}
          </strong>
          <span
            style={{
              background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentLight})`,
              color: "#111",
              borderRadius: "20px",
              padding: "0.2rem 0.7rem",
              fontSize: "0.78rem",
              fontWeight: 700,
            }}
          >
            {users.length}
          </span>
        </div>

        {loading ? (
          <div style={{ padding: "3rem", textAlign: "center", color: theme.textMuted }}>
            <FiRefreshCw size={24} style={{ animation: "spin 1s linear infinite", marginBottom: "0.8rem" }} />
            <p style={{ margin: 0 }}>{t(language, "جاري التحميل...", "Loading...")}</p>
          </div>
        ) : users.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center", color: theme.textMuted }}>
            <FiUser size={40} style={{ marginBottom: "0.8rem", opacity: 0.4 }} />
            <p style={{ margin: 0 }}>
              {t(language, "لا يوجد مستخدمون. أنشئ المستخدم الأول!", "No users found. Create the first one!")}
            </p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "rgba(0,0,0,0.15)" }}>
                  {[
                    t(language, "البريد الإلكتروني", "Email"),
                    t(language, "الاسم", "Name"),
                    t(language, "الدور", "Role"),
                    t(language, "تاريخ الإنشاء", "Created"),
                    t(language, "الحالة", "Status"),
                    isAdmin ? t(language, "إجراءات", "Actions") : "",
                  ].filter(Boolean).map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "0.8rem 1.2rem",
                        textAlign: language === "ar" ? "right" : "left",
                        color: theme.accent,
                        fontSize: "0.82rem",
                        fontWeight: 700,
                        borderBottom: `1px solid ${theme.border}`,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u, idx) => {
                  const meta = u.user_metadata || {};
                  const roleKey = meta.role || "hr_specialist";
                  const roleLabel = language === "ar"
                    ? ROLE_CONFIG[roleKey]?.titles?.ar || roleKey
                    : ROLE_CONFIG[roleKey]?.titles?.en || roleKey;
                  const isConfirmed = Boolean(u.email_confirmed_at);

                  return (
                    <tr
                      key={u.id}
                      style={{
                        borderBottom: `1px solid ${theme.border}`,
                        background: idx % 2 === 0 ? "transparent" : "rgba(0,0,0,0.08)",
                        transition: "background 0.15s",
                      }}
                    >
                      <td style={{ padding: "0.85rem 1.2rem", fontSize: "0.88rem", color: theme.text }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <FiMail size={13} style={{ color: theme.accent }} />
                          {u.email}
                        </div>
                      </td>
                      <td style={{ padding: "0.85rem 1.2rem", fontSize: "0.88rem", color: theme.text }}>
                        {meta.full_name || "—"}
                      </td>
                      <td style={{ padding: "0.85rem 1.2rem" }}>
                        <span
                          style={{
                            padding: "0.25rem 0.65rem",
                            borderRadius: "20px",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            background:
                              roleKey === "admin"
                                ? "rgba(212,165,116,0.2)"
                                : "rgba(59,130,246,0.15)",
                            color: roleKey === "admin" ? "#d4a574" : "#93c5fd",
                            border: `1px solid ${roleKey === "admin" ? "rgba(212,165,116,0.4)" : "rgba(59,130,246,0.3)"}`,
                          }}
                        >
                          <FiShield size={11} style={{ marginInlineEnd: "0.3rem", verticalAlign: "middle" }} />
                          {roleLabel}
                        </span>
                      </td>
                      <td style={{ padding: "0.85rem 1.2rem", fontSize: "0.82rem", color: theme.textMuted }}>
                        {u.created_at ? new Date(u.created_at).toLocaleDateString(language === "ar" ? "ar-AE" : "en-AE") : "—"}
                      </td>
                      <td style={{ padding: "0.85rem 1.2rem" }}>
                        <span
                          style={{
                            padding: "0.25rem 0.65rem",
                            borderRadius: "20px",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            background: isConfirmed ? "rgba(34,197,94,0.15)" : "rgba(245,158,11,0.15)",
                            color: isConfirmed ? "#86efac" : "#fcd34d",
                            border: `1px solid ${isConfirmed ? "rgba(34,197,94,0.35)" : "rgba(245,158,11,0.35)"}`,
                          }}
                        >
                          {isConfirmed
                            ? t(language, "مؤكد", "Confirmed")
                            : t(language, "بانتظار التأكيد", "Pending")}
                        </span>
                      </td>
                      {isAdmin && (
                        <td style={{ padding: "0.85rem 1.2rem" }}>
                          <button
                            onClick={() => handleDelete(u.id, u.email)}
                            title={t(language, "حذف المستخدم", "Delete User")}
                            style={{
                              background: "rgba(239,68,68,0.15)",
                              border: "1px solid rgba(239,68,68,0.3)",
                              borderRadius: "8px",
                              color: "#fca5a5",
                              padding: "0.4rem 0.6rem",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.3rem",
                              fontSize: "0.78rem",
                            }}
                          >
                            <FiTrash2 size={13} />
                            {t(language, "حذف", "Delete")}
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
