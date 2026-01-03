export const getToken = () => localStorage.getItem("token");

export const decodeToken = () => {
    const token = getToken();
    if (!token) return null;
    try {
        return JSON.parse(atob(token.split(".")[1]));
    } catch {
        return null;
    }
};

export const getUserRole = () => {
    const decoded = decodeToken();
    return decoded?.sub?.role || null;
};

export const getUserId = () => {
    const decoded = decodeToken();
    return decoded?.sub?.id || null;
};

export const logout = () => {
    localStorage.removeItem("token");
};
