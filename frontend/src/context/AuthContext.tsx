import { createContext, useContext, useMemo, useState } from "react";
import type { PropsWithChildren } from "react";
import api, { setAuthToken } from "../api/client";
import type { AuthUser, LoginResponse, Role } from "../types";

interface AuthContextValue {
  token: string | null;
  user: AuthUser | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  hasRole: (roles: Role[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const decodeJwtPayload = (token: string): Record<string, unknown> | null => {
  try {
    const payload = token.split(".")[1];
    if (!payload) {
      return null;
    }

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = atob(normalized);
    return JSON.parse(decoded) as Record<string, unknown>;
  } catch {
    return null;
  }
};

const extractRole = (payload: Record<string, unknown> | null): Role => {
  const roles = payload?.roles ?? payload?.authorities ?? payload?.role;
  if (Array.isArray(roles) && typeof roles[0] === "string") {
    return roles[0].replace("ROLE_", "") as Role;
  }
  if (typeof roles === "string") {
    return roles.replace("ROLE_", "") as Role;
  }
  return "EMPLOYEE";
};

const extractEmployeeId = (payload: Record<string, unknown> | null): number | undefined => {
  const raw = payload?.employeeId;
  if (typeof raw === "number" && !Number.isNaN(raw)) {
    return raw;
  }
  if (typeof raw === "string") {
    const parsed = Number.parseInt(raw, 10);
    return Number.isNaN(parsed) ? undefined : parsed;
  }
  return undefined;
};

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = async (username: string, password: string) => {
    const response = await api.post<LoginResponse>("/api/auth/login", {
      username,
      password
    });

    const nextToken = response.data.token;
    const payload = decodeJwtPayload(nextToken);
    const role = extractRole(payload);
    const jwtUsername =
      typeof payload?.sub === "string" ? payload.sub : username;
    const employeeId = extractEmployeeId(payload);

    setToken(nextToken);
    setUser({ username: jwtUsername, role, employeeId });
    setAuthToken(nextToken);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setAuthToken(null);
  };

  const hasRole = (roles: Role[]) => {
    if (!user) {
      return false;
    }
    return roles.includes(user.role);
  };

  const value = useMemo(
    () => ({ token, user, login, logout, hasRole }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
