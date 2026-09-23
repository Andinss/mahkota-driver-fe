const ACCESS_TOKEN_KEY = "accessToken";
const USER_KEY = "user";
const REMEMBER_KEY = "remember_me";

const hasWindow = (): boolean => typeof window !== "undefined";

export const isRememberMe = (): boolean => {
  if (!hasWindow()) return false;
  return localStorage.getItem(REMEMBER_KEY) === "true";
};

export const setRememberMe = (remember: boolean): void => {
  if (!hasWindow()) return;
  localStorage.setItem(REMEMBER_KEY, String(remember));
};

const readToken = (): string | null => {
  if (!hasWindow()) return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY) ?? sessionStorage.getItem(ACCESS_TOKEN_KEY);
};

const readUser = (): string | null => {
  if (!hasWindow()) return null;
  return localStorage.getItem(USER_KEY) ?? sessionStorage.getItem(USER_KEY);
};

export const migrateLegacySession = (): void => {
  if (!hasWindow()) return;

  const lsToken = localStorage.getItem(ACCESS_TOKEN_KEY);
  const ssToken = sessionStorage.getItem(ACCESS_TOKEN_KEY);

  if (!lsToken && ssToken) {
    const rememberFlag = localStorage.getItem(REMEMBER_KEY);
    const remember = rememberFlag === null ? true : rememberFlag === "true";
    const ssUser = sessionStorage.getItem(USER_KEY);

    setRememberMe(remember);
    if (remember) {
      localStorage.setItem(ACCESS_TOKEN_KEY, ssToken);
      if (ssUser) localStorage.setItem(USER_KEY, ssUser);
      sessionStorage.removeItem(ACCESS_TOKEN_KEY);
      sessionStorage.removeItem(USER_KEY);
    }
  }
};

export const getAccessToken = (): string | null => readToken();

export const setAccessToken = (token: string, remember?: boolean): void => {
  if (!hasWindow()) return;
  const shouldRemember = remember ?? true;
  setRememberMe(shouldRemember);

  localStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);

  const store = shouldRemember ? localStorage : sessionStorage;
  store.setItem(ACCESS_TOKEN_KEY, token);
};

export const clearTokens = (): void => {
  if (!hasWindow()) return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
};

export const setUser = (user: unknown, remember?: boolean): void => {
  if (!hasWindow()) return;
  const payload = JSON.stringify(user);
  const shouldRemember = remember ?? isRememberMe();

  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(USER_KEY);

  const store = shouldRemember ? localStorage : sessionStorage;
  store.setItem(USER_KEY, payload);
};

export const getStoredUser = <T = unknown>(): T | null => {
  const raw = readUser();
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

export const setLogoutToast = (kind: "intentional" | "idle"): void => {
  if (!hasWindow()) return;
  localStorage.setItem("post_logout_toast", kind);
};

export const consumeLogoutToast = (): "intentional" | "idle" | null => {
  if (!hasWindow()) return null;
  const value = localStorage.getItem("post_logout_toast");
  localStorage.removeItem("post_logout_toast");
  if (value === "intentional" || value === "idle") return value;
  return null;
};
