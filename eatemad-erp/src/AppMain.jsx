import React, { useState, useEffect } from "react";
import LoginPage from "./components/LoginPage";
import ERPSystemLuxury from "./ERPSystemLuxury";
import { isAuthenticated, api } from "./config/supabase";
import { getRolePermissions, getRoleTitle } from "./config/roleConfig";

const normalizeUser = (rawUser, language = "ar") => {
  if (!rawUser) return null;

  const fullName = rawUser.fullName || rawUser.name || "";
  const englishName = rawUser.englishName || fullName;
  const permissions =
    Array.isArray(rawUser.permissions) && rawUser.permissions.length > 0
      ? rawUser.permissions
      : getRolePermissions(rawUser.role);

  return {
    ...rawUser,
    fullName,
    englishName,
    permissions,
    title: rawUser.title || getRoleTitle(rawUser.role, language),
  };
};

// ── Welcome Overlay ──────────────────────────────────────────────────────────
function getArabicGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "صباح الخير 🌅";
  if (hour >= 12 && hour < 17) return "مساء الخير 🌤️";
  if (hour >= 17 && hour < 21) return "مساء النور 🌆";
  return "مرحباً 🌙";
}

function getEnglishGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good Morning 🌅";
  if (hour >= 12 && hour < 17) return "Good Afternoon 🌤️";
  if (hour >= 17 && hour < 21) return "Good Evening 🌆";
  return "Welcome 🌙";
}

function WelcomeOverlay({ user, language, onDone }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 600);
    }, 3200);
    return () => clearTimeout(timer);
  }, [onDone]);

  const dismiss = () => {
    setVisible(false);
    setTimeout(onDone, 400);
  };

  const displayName =
    language === "ar"
      ? user?.fullName || user?.name || ""
      : user?.englishName || user?.fullName || "";

  const greeting = language === "ar" ? getArabicGreeting() : getEnglishGreeting();
  const subtitle =
    language === "ar"
      ? "مرحباً بك في نظام الاعتماد المتكامل"
      : "Welcome to Al Eatemad ERP System";
  const roleLabel = user?.title || "";

  return (
    <div
      onClick={dismiss}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(circle at 50% 35%, rgba(184,148,106,0.22), transparent 58%), linear-gradient(145deg, rgba(26,23,24,0.96), rgba(45,46,49,0.94))",
        backdropFilter: "blur(8px)",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.5s ease",
        cursor: "pointer",
        direction: language === "ar" ? "rtl" : "ltr",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          textAlign: "center",
          padding: "2.5rem 3rem",
          maxWidth: 480,
          animation: "welcomePop 0.6s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        {/* Logo circle */}
        <div
          style={{
            width: 90,
            height: 90,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #7d0a12, #b8946a)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.3rem",
            boxShadow:
              "0 0 60px rgba(125,10,18,0.45), 0 0 120px rgba(184,148,106,0.25)",
            border: "3px solid rgba(250,232,232,0.45)",
          }}
        >
          <img
            src="/eatemad-logo.png"
            alt="Logo"
            style={{ width: "72%", height: "72%", objectFit: "contain" }}
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>

        {/* Greeting */}
        <p
          style={{
            margin: "0 0 0.3rem",
            fontSize: "1.1rem",
            color: "#d5c3c3",
            fontFamily:
              language === "ar"
                ? "'Cairo', 'Tajawal', sans-serif"
                : "'Inter', 'Segoe UI', sans-serif",
          }}
        >
          {greeting}
        </p>

        {/* Name */}
        <h1
          style={{
            margin: "0 0 0.4rem",
            fontSize: "2.2rem",
            fontWeight: 800,
            background: "linear-gradient(135deg, #fae8e8, #b8946a, #7d0a12)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            fontFamily:
              language === "ar"
                ? "'Cairo', 'Tajawal', sans-serif"
                : "'Inter', 'Segoe UI', sans-serif",
          }}
        >
          {displayName}
        </h1>

        {/* Role */}
        {roleLabel && (
          <p
            style={{
              margin: "0 0 1rem",
              fontSize: "0.95rem",
              color: "#b8946a",
              fontWeight: 600,
            }}
          >
            {roleLabel}
          </p>
        )}

        {/* Subtitle */}
        <p
          style={{
            margin: "0 0 1.5rem",
            fontSize: "0.92rem",
            color: "#d5c3c3",
            lineHeight: 1.7,
          }}
        >
          {subtitle}
        </p>

        {/* Progress bar */}
        <div
          style={{
            height: 3,
            borderRadius: 3,
            background: "rgba(212,165,116,0.2)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              background: "linear-gradient(90deg, #d4a574, #e8c9a0)",
              borderRadius: 3,
              animation: "welcomeBar 3.2s linear forwards",
            }}
          />
        </div>

        <p
          style={{ margin: "0.8rem 0 0", color: "#ad9898", fontSize: "0.78rem" }}
        >
          {language === "ar" ? "انقر للمتابعة" : "Click to continue"}
        </p>
      </div>

      <style>{`
        @keyframes welcomePop {
          0%   { transform: scale(0.7) translateY(30px); opacity: 0; }
          100% { transform: scale(1)   translateY(0);    opacity: 1; }
        }
        @keyframes welcomeBar {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </div>
  );
}

// ── Main App ─────────────────────────────────────────────────────────────────
function AppMain() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguage] = useState("ar");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem("language") || "ar";
    const savedTheme = localStorage.getItem("theme") || "dark";
    setLanguage(savedLang);
    setIsDarkMode(savedTheme === "dark");
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      window.currentUser = user;
      window.handleLogout = handleLogout;
    }
  }, [user]);

  const checkAuth = async () => {
    const token = localStorage.getItem("authToken");

    // Force the login page as the first screen on every fresh app open.
    if (isAuthenticated()) {
      if (token && !token.startsWith("local-")) {
        await api.signOut(token);
      } else {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
      }
    }

    setUser(null);
    setShowWelcome(false);
    setIsLoading(false);
  };

  const handleLogin = (userData) => {
    const normalizedUser = normalizeUser(userData, language);
    setUser(normalizedUser);
    setShowWelcome(true);
    localStorage.setItem("user", JSON.stringify(normalizedUser));
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("authToken");
    if (token && token !== "demo-token" && token !== "mock-token") {
      await api.signOut(token);
    } else {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
    }
    setUser(null);
    setShowWelcome(false);
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, title: getRoleTitle(prev.role, lang) };
      localStorage.setItem("user", JSON.stringify(updated));
      return updated;
    });
  };

  const handleThemeChange = (theme) => {
    setIsDarkMode(theme);
    localStorage.setItem("theme", theme ? "dark" : "light");
  };

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: isDarkMode ? "#0a0806" : "#ffffff",
        }}
      >
        <div style={{ textAlign: "center", color: isDarkMode ? "#e8d5c4" : "#1a1a1c" }}>
          <div
            style={{
              width: "60px",
              height: "60px",
              border: `4px solid ${isDarkMode ? "#d4a574" : "#995d26"}`,
              borderTopColor: "transparent",
              borderRadius: "50%",
              margin: "0 auto 1rem",
              animation: "spin 1s linear infinite",
            }}
          />
          <p style={{ fontSize: "1.1rem", fontWeight: 600 }}>
            {language === "ar" ? "جاري التحميل..." : "Loading..."}
          </p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!user) {
    return (
      <LoginPage
        onLogin={handleLogin}
        language={language}
        setLanguage={handleLanguageChange}
        isDarkMode={isDarkMode}
      />
    );
  }

  return (
    <>
      {showWelcome && (
        <WelcomeOverlay user={user} language={language} onDone={() => setShowWelcome(false)} />
      )}
      <ERPSystemLuxury
        user={user}
        language={language}
        isDarkMode={isDarkMode}
        onLogout={handleLogout}
        onLanguageChange={handleLanguageChange}
        onThemeChange={handleThemeChange}
      />
    </>
  );
}

export default AppMain;
