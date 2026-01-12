
export const setAuthToken = (token) => {
    if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
    }
};

export const getAuthToken = () => {
    if (typeof window !== "undefined") {
        return localStorage.getItem("token");
    }
    return null;
};

export const removeAuthToken = () => {
    if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userEmail");
    }
};

export const setUserRole = (role) => {
    if (typeof window !== "undefined") {
        localStorage.setItem("userRole", role);
    }
};

export const getUserRole = () => {
    if (typeof window !== "undefined") {
        return localStorage.getItem("userRole");
    }
    return null;
};

export const setUserEmail = (email) => {
    if (typeof window !== "undefined") {
        localStorage.setItem("userEmail", email);
    }
};

export const getUserEmail = () => {
    if (typeof window !== "undefined") {
        return localStorage.getItem("userEmail");
    }
    return null;
};

export const isAuthenticated = () => {
    return !!getAuthToken();
};

export const isUser = () => {
    return getUserRole() === "user";
};

export const isCompany = () => {
    return getUserRole() === "company";
};

export const logout = () => {
    removeAuthToken();
    if (typeof window !== "undefined") {
        window.location.href = "/";
    }
};

// Decode JWT (basic, no verification)
export const decodeToken = (token) => {
    if (!token) return null;

    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        return null;
    }
};

// Check if token is expired
export const isTokenExpired = (token) => {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return true;

    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
};