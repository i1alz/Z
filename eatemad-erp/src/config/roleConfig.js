export const ROLE_CONFIG = {
  admin: {
    key: "admin",
    titles: {
      ar: "مدير النظام",
      en: "System Administrator",
    },
    defaultPermissions: ["*", "users"],
  },
  hr_manager: {
    key: "hr_manager",
    titles: {
      ar: "مدير الموارد البشرية",
      en: "HR Manager",
    },
    defaultPermissions: [
      "hr",
      "employees",
      "attendance",
      "leaves",
      "payroll",
      "recruitment",
      "performance",
      "reports",
    ],
  },
  hr_specialist: {
    key: "hr_specialist",
    titles: {
      ar: "أخصائي موارد بشرية",
      en: "HR Specialist",
    },
    defaultPermissions: ["hr", "employees", "attendance"],
  },
};

export function getRolePermissions(role) {
  const permissions = ROLE_CONFIG[role]?.defaultPermissions || ["hr"];

  if (role !== "admin") {
    return permissions.filter((permission) => permission !== "*");
  }

  return permissions;
}

export function getRoleTitle(role, language = "ar") {
  const langKey = language === "ar" ? "ar" : "en";
  return (
    ROLE_CONFIG[role]?.titles?.[langKey] ||
    (language === "ar" ? "مستخدم النظام" : "System User")
  );
}

export function userHasPermission(userPermissions = [], requiredPermission) {
  if (!requiredPermission) {
    return true;
  }

  if (!Array.isArray(userPermissions)) {
    return false;
  }

  return (
    userPermissions.includes("*") ||
    userPermissions.includes(requiredPermission)
  );
}
