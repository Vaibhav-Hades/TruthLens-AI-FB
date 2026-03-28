export const authAPI = {
    login: async (email, password) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (!email || !password) return reject(new Error('Invalid'));
                const payload = { email, name: email.split('@')[0], exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7) };
                resolve({ token: "header." + btoa(JSON.stringify(payload)) + ".sig", user: { name: payload.name, email } });
            }, 800);
        });
    },
    register: async (name, email, password) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const payload = { email, name, exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7) };
                resolve({ token: "header." + btoa(JSON.stringify(payload)) + ".sig", user: { name, email } });
            }, 800);
        });
    },
    me: async () => {
        return new Promise((resolve) => {
            const token = localStorage.getItem('tl_token');
            if (!token) throw new Error("No token");
            const payload = JSON.parse(atob(token.split('.')[1]));
            resolve({ name: payload.name, email: payload.email });
        });
    }
};

export const analyzeAPI = {
    analyze: async (input, language) => {
        // Will attach API call later
    },
    getHistory: async () => {
        // Will attach API call later
    }
};
