import React, { useEffect, useMemo, useState } from "react";
import {
  FiUser,
  FiLock,
  FiEye,
  FiEyeOff,
  FiGlobe,
  FiShield,
  FiTrendingUp,
  FiUsers,
  FiCheckCircle,
} from "react-icons/fi";
import { getRolePermissions, getRoleTitle } from "../config/roleConfig";
import { api } from "../config/supabase";

const Colors = {
  gold: "#b8946a",
  goldLight: "#fae8e8",
  goldDark: "#966334",
  darkRed: "#7d0a12",
  red: "#9a1b24",
  bgDark: "#1a1718",
  bgPrimary: "#232125",
  bgSecondary: "#2d2e31",
  bgCard: "#2d2e31",
  textDark: "#fae8e8",
  textMuted: "#c9b7b7",
  borderDark: "rgba(250,232,232,0.24)",
  borderAccent: "rgba(184,148,106,0.45)",
  success: "#22c55e",
  error: "#ef4444",
};

const USERS_DATABASE = {
  "zaid.alazzam": {
    username: "zaid.alazzam",
    password: "admin@2024",
    fullName: "زيد العزام",
    englishName: "Zaid Al-Azzam",
    role: "admin",
    title: "مدير النظام",
    titleEn: "System Administrator",
    department: "الإدارة العامة",
    permissions: ["*"],
    email: "zaid@eatemad.com",
  },
  "akram.qasim": {
    username: "akram.qasim",
    password: "hr@2024",
    fullName: "أكرم قاسم",
    englishName: "Akram Qasim",
    role: "hr_manager",
    title: "مدير الموارد البشرية",
    titleEn: "HR Manager",
    department: "الموارد البشرية",
    permissions: ["hr", "employees", "attendance", "leaves", "payroll", "recruitment", "performance", "reports"],
    email: "akram@eatemad.com",
  },
  "sarah.ahmad": {
    username: "sarah.ahmad",
    password: "hr@123",
    fullName: "سارة أحمد",
    englishName: "Sarah Ahmad",
    role: "hr_specialist",
    title: "أخصائي موارد بشرية",
    titleEn: "HR Specialist",
    department: "الموارد البشرية",
    permissions: ["hr", "employees", "attendance"],
    email: "sarah@eatemad.com",
  },
};

const loginStats = [
  { icon: FiUsers, value: "248+", labelAr: "موظف نشط", labelEn: "Active Employees" },
  { icon: FiTrendingUp, value: "92%", labelAr: "معدل حضور", labelEn: "Attendance Rate" },
  { icon: FiShield, value: "100%", labelAr: "تحكم بالصلاحيات", labelEn: "Role Security" },
];

const t = (language, ar, en) => (language === "ar" ? ar : en);

function LoginPage({ onLogin, language = "ar", setLanguage }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [viewport, setViewport] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1440,
  );

  const isTablet = viewport <= 1024;
  const isMobile = viewport <= 768;

  useEffect(() => {
    const onResize = () => setViewport(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    document.dir = language === "ar" ? "rtl" : "ltr";
    const savedUsername = localStorage.getItem("rememberedUsername");
    if (savedUsername) {
      setUsername(savedUsername);
      setRememberMe(true);
    }
  }, [language]);

  const title = useMemo(
    () => t(language, "نظام إدارة الموارد البشرية", "Human Resources Management System"),
    [language],
  );

  const subtitle = useMemo(
    () =>
      t(
        language,
        "سجّل الدخول لإدارة الموظفين، الحضور، الإجازات، والرواتب من لوحة واحدة.",
        "Sign in to manage employees, attendance, leaves, and payroll from one dashboard."
      ),
    [language],
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 700));

    const loginInput = username.trim();
    const localUser = Object.values(USERS_DATABASE).find(
      (item) =>
        item.username?.toLowerCase() === loginInput.toLowerCase() ||
        item.email?.toLowerCase() === loginInput.toLowerCase(),
    );

    const authIdentifier = loginInput.includes("@")
      ? loginInput
      : localUser?.email || loginInput;

    const authResult = await api.signIn(authIdentifier, password);
    let userData;

    if (authResult.success) {
      const dbUser = authResult.data.user;
      let fullName = username;
      let englishName = username;
      let role = "hr_manager";
      let department = "";

      const profileRes = await api.getProfile(
        dbUser.id,
        authResult.data.access_token,
      );
      if (profileRes.success && profileRes.data) {
        fullName = profileRes.data.full_name || profileRes.data.name || dbUser.email;
        englishName = profileRes.data.english_name || profileRes.data.name_en || fullName;
        role = profileRes.data.role || role;
        department = profileRes.data.department || "";
      }

      const resolvedRole = role === "admin" ? "admin" : role;
      const resolvedTitle = getRoleTitle(resolvedRole, language);
      const resolvedPermissions = getRolePermissions(resolvedRole);

      userData = {
        id: dbUser.id,
        username: loginInput,
        fullName,
        englishName,
        role: resolvedRole,
        title: resolvedTitle,
        department,
        permissions: resolvedPermissions,
        email: dbUser.email,
        loginTime: new Date().toISOString(),
      };

      localStorage.setItem("authToken", authResult.data.access_token);
    } else {
      if (!localUser || localUser.password !== password) {
        const errorMessage = authResult?.error?.includes(
          "Supabase is not configured",
        )
          ? t(
              language,
              "إعدادات Supabase غير مكتملة",
              "Supabase configuration is missing",
            )
          : t(
              language,
              "اسم المستخدم أو كلمة المرور غير صحيحة",
              "Invalid username or password",
            );

        setError(errorMessage);
        setIsLoading(false);
        return;
      }

      const resolvedPermissions = getRolePermissions(localUser.role);

      const resolvedTitle =
        language === "ar"
          ? localUser.title || getRoleTitle(localUser.role, "ar")
          : localUser.titleEn || getRoleTitle(localUser.role, "en");

      userData = {
        id: localUser.username,
        username: localUser.username,
        fullName: localUser.fullName,
        englishName: localUser.englishName,
        role: localUser.role,
        title: resolvedTitle,
        department: localUser.department,
        permissions: resolvedPermissions,
        email: localUser.email,
        loginTime: new Date().toISOString(),
      };

      localStorage.setItem("authToken", `local-${localUser.username}`);
    }

    if (rememberMe) localStorage.setItem("rememberedUsername", loginInput);
    else localStorage.removeItem("rememberedUsername");

    localStorage.setItem("user", JSON.stringify(userData));
    onLogin(userData);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 10% 20%, rgba(184,148,106,0.12), transparent 35%), radial-gradient(circle at 90% 10%, rgba(125,10,18,0.22), transparent 30%), linear-gradient(135deg, #1a1718 0%, #232125 50%, #1a1718 100%)",
        display: "grid",
        gridTemplateColumns: isTablet ? "1fr" : "1.2fr 1fr",
        gap: isTablet ? "1rem" : "2rem",
        padding: isMobile ? "1rem" : "2rem",
        fontFamily:
          language === "ar"
            ? "'Cairo', 'Tajawal', system-ui, sans-serif"
            : "'Inter', 'Segoe UI', system-ui, sans-serif",
        direction: language === "ar" ? "rtl" : "ltr",
      }}
    >
      <button
        onClick={() => setLanguage(language === "ar" ? "en" : "ar")}
        style={{
          position: "fixed",
          top: isMobile ? "0.9rem" : "1.5rem",
          [language === "ar" ? "left" : "right"]: isMobile
            ? "0.9rem"
            : "1.5rem",
          background: "rgba(45,46,49,0.78)",
          border: `1px solid ${Colors.borderAccent}`,
          borderRadius: "10px",
          padding: "0.55rem 0.85rem",
          color: Colors.gold,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
          zIndex: 11,
          backdropFilter: "blur(8px)",
        }}
      >
        <FiGlobe size={16} />
        {language === "ar" ? "English" : "عربي"}
      </button>

      {!isTablet && (
        <section
          style={{
            borderRadius: "24px",
            border: `1px solid ${Colors.borderDark}`,
            background:
              "linear-gradient(150deg, rgba(45,46,49,0.95) 0%, rgba(26,23,24,0.95) 100%)",
            boxShadow: "0 24px 80px rgba(0,0,0,0.45)",
            padding: "2.2rem",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: 380,
              height: 380,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(212,165,116,0.18), transparent 65%)",
              top: -140,
              right: language === "ar" ? "auto" : -120,
              left: language === "ar" ? -120 : "auto",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.9rem",
              marginBottom: "1.3rem",
            }}
          >
            <img
              src="/eatemad-logo.png"
              alt="Al Eatemad Logo"
              style={{
                width: 68,
                height: 68,
                objectFit: "contain",
                borderRadius: "14px",
                border: `1px solid ${Colors.borderAccent}`,
                background: "rgba(0,0,0,0.25)",
                padding: "0.35rem",
              }}
            />
            <div>
              <h2
                style={{
                  margin: 0,
                  color: Colors.textDark,
                  fontSize: "1.4rem",
                  fontWeight: 800,
                }}
              >
                AL EATEMAD
              </h2>
              <p style={{ margin: 0, color: Colors.textMuted, fontSize: "0.85rem" }}>
                {t(language, "حلول موارد بشرية متكاملة", "Integrated HR Solutions")}
              </p>
            </div>
          </div>

          <h1
            style={{
              margin: "0 0 0.7rem",
              color: Colors.goldLight,
              fontSize: "2rem",
              lineHeight: 1.3,
            }}
          >
            {title}
          </h1>
          <p
            style={{
              margin: "0 0 1.4rem",
              color: Colors.textMuted,
              maxWidth: 520,
              lineHeight: 1.8,
            }}
          >
            {subtitle}
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "0.8rem",
            }}
          >
            {loginStats.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.value}
                  style={{
                    borderRadius: "14px",
                    border: `1px solid ${Colors.borderDark}`,
                    background: "rgba(0,0,0,0.22)",
                    padding: "0.85rem",
                  }}
                >
                  <Icon size={18} color={Colors.gold} />
                  <p
                    style={{
                      margin: "0.5rem 0 0",
                      color: Colors.textDark,
                      fontSize: "1.15rem",
                      fontWeight: 800,
                    }}
                  >
                    {item.value}
                  </p>
                  <p
                    style={{
                      margin: "0.15rem 0 0",
                      color: Colors.textMuted,
                      fontSize: "0.75rem",
                    }}
                  >
                    {language === "ar" ? item.labelAr : item.labelEn}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section
        style={{
          borderRadius: "24px",
          border: `1px solid ${Colors.borderDark}`,
          background:
            "linear-gradient(160deg, rgba(45,46,49,0.97), rgba(26,23,24,0.97))",
          boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
          padding: isMobile ? "1.15rem" : "2rem",
          alignSelf: "center",
          maxWidth: isTablet ? 560 : "100%",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.8rem",
            marginBottom: "1rem",
          }}
        >
          <img
            src="/eatemad-logo.png"
            alt="Al Eatemad Logo"
            style={{
              width: isMobile ? 54 : 64,
              height: isMobile ? 54 : 64,
              objectFit: "contain",
              borderRadius: "12px",
              border: `1px solid ${Colors.borderAccent}`,
              background: "rgba(0,0,0,0.25)",
              padding: "0.28rem",
            }}
          />
          <div>
            <h3 style={{ margin: 0, color: Colors.textDark, fontSize: isMobile ? "1.05rem" : "1.2rem", fontWeight: 800 }}>
              {t(language, "تسجيل الدخول", "Sign In")}
            </h3>
            <p style={{ margin: 0, color: Colors.textMuted, fontSize: "0.8rem" }}>
              {t(language, "ادخل بيانات الحساب", "Enter your credentials")}
            </p>
          </div>
        </div>

        {error && (
          <div
            style={{
              marginBottom: "0.9rem",
              borderRadius: "10px",
              border: "1px solid rgba(239,68,68,0.4)",
              background: "rgba(239,68,68,0.12)",
              color: "#fecaca",
              fontSize: "0.85rem",
              padding: "0.7rem 0.8rem",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "0.8rem" }}>
          <label style={{ color: Colors.gold, fontSize: "0.85rem", fontWeight: 600 }}>
            {t(language, "اسم المستخدم", "Username")}
          </label>
          <div style={{ position: "relative" }}>
            <FiUser
              style={{
                position: "absolute",
                top: "50%",
                transform: "translateY(-50%)",
                [language === "ar" ? "right" : "left"]: "0.8rem",
                color: "#8b7258",
              }}
            />
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t(language, "مثال: akram.qasim", "e.g. akram.qasim")}
              required
              disabled={isLoading}
              style={{
                width: "100%",
                borderRadius: "12px",
                border: `1px solid ${Colors.borderDark}`,
                background: "rgba(0,0,0,0.25)",
                color: Colors.textDark,
                padding: "0.88rem 2.7rem",
                outline: "none",
                fontFamily: "inherit",
              }}
            />
          </div>

          <label style={{ color: Colors.gold, fontSize: "0.85rem", fontWeight: 600 }}>
            {t(language, "كلمة المرور", "Password")}
          </label>
          <div style={{ position: "relative" }}>
            <FiLock
              style={{
                position: "absolute",
                top: "50%",
                transform: "translateY(-50%)",
                [language === "ar" ? "right" : "left"]: "0.8rem",
                color: "#8b7258",
              }}
            />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t(language, "أدخل كلمة المرور", "Enter password")}
              required
              disabled={isLoading}
              style={{
                width: "100%",
                borderRadius: "12px",
                border: `1px solid ${Colors.borderDark}`,
                background: "rgba(0,0,0,0.25)",
                color: Colors.textDark,
                padding: "0.88rem 2.7rem",
                outline: "none",
                fontFamily: "inherit",
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              style={{
                position: "absolute",
                top: "50%",
                transform: "translateY(-50%)",
                [language === "ar" ? "left" : "right"]: "0.65rem",
                border: "none",
                background: "transparent",
                color: "#8b7258",
                cursor: "pointer",
              }}
            >
              {showPassword ? <FiEyeOff size={17} /> : <FiEye size={17} />}
            </button>
          </div>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.45rem",
              color: Colors.textMuted,
              fontSize: "0.85rem",
            }}
          >
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{ accentColor: Colors.gold }}
            />
            {t(language, "تذكرني", "Remember me")}
          </label>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              marginTop: "0.3rem",
              borderRadius: "12px",
              border: "none",
              background: "linear-gradient(135deg, #7d0a12, #b8946a)",
              color: "#fff",
              fontWeight: 800,
              fontSize: "1rem",
              padding: "0.92rem",
              cursor: isLoading ? "not-allowed" : "pointer",
              opacity: isLoading ? 0.75 : 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.45rem",
            }}
          >
            {isLoading && <FiCheckCircle size={16} style={{ animation: "pulse 1s ease infinite" }} />}
            {isLoading ? t(language, "جاري تسجيل الدخول...", "Signing in...") : t(language, "دخول", "Sign In")}
          </button>
        </form>

        <div
          style={{
            marginTop: "1rem",
            borderRadius: "12px",
            border: `1px solid ${Colors.borderDark}`,
            background: "rgba(0,0,0,0.2)",
            padding: "0.8rem",
          }}
        >
          <p style={{ margin: "0 0 0.45rem", color: Colors.goldLight, fontSize: "0.8rem", fontWeight: 700 }}>
            {t(language, "حسابات تجريبية", "Demo Accounts")}
          </p>
          <div
            style={{
              display: "grid",
              gap: "0.35rem",
              fontSize: "0.78rem",
              color: Colors.textMuted,
            }}
          >
            <div>zaid.alazzam / admin@2024</div>
            <div>akram.qasim / hr@2024</div>
            <div>sarah.ahmad / hr@123</div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}

export default LoginPage;
