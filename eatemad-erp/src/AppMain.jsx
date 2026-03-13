import React, { useState, useEffect } from "react";
import LoginPage from "./components/LoginPage";
import ERPSystemLuxury from "./ERPSystemLuxury";
import { isAuthenticated, getCurrentUser, api } from "./config/supabase";
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

function AppMain() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguage] = useState("ar");
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    // Load saved preferences
    const savedLang = localStorage.getItem("language") || "ar";
    const savedTheme = localStorage.getItem("theme") || "dark";
    setLanguage(savedLang);
    setIsDarkMode(savedTheme === "dark");

    // Check if user is already logged in
    checkAuth(savedLang);
  }, []);

  // MUST be before any conditional returns (React Hooks rule)
  useEffect(() => {
    if (user) {
      window.currentUser = user;
      window.handleLogout = handleLogout;
    }
  }, [user]);

  const checkAuth = (lang = "ar") => {
    if (isAuthenticated()) {
      const currentUser = getCurrentUser();
      if (currentUser) {
        setUser(normalizeUser(currentUser, lang));
      }
    }
    setIsLoading(false);
  };

  const handleLogin = (userData) => {
    const normalizedUser = normalizeUser(userData, language);
    setUser(normalizedUser);
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
        <div
          style={{
            textAlign: "center",
            color: isDarkMode ? "#e8d5c4" : "#1a1a1c",
          }}
        >
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
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
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
    <ERPSystemLuxury
      user={user}
      language={language}
      isDarkMode={isDarkMode}
      onLogout={handleLogout}
      onLanguageChange={handleLanguageChange}
      onThemeChange={handleThemeChange}
    />
  );
}

export default AppMain;
