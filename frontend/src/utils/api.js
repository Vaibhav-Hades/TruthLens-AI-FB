const BASE_URL = '' // proxy handles routing to localhost:8080

export const authAPI = {
    login: async (email, password) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (!email || !password) return reject(new Error('Invalid credentials'))
                const payload = { email, name: email.split('@')[0], exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 }
                resolve({ token: 'header.' + btoa(JSON.stringify(payload)) + '.sig', user: { name: payload.name, email } })
            }, 800)
        })
    },
    register: async (name, email, password) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const payload = { email, name, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 }
                resolve({ token: 'header.' + btoa(JSON.stringify(payload)) + '.sig', user: { name, email } })
            }, 800)
        })
    },
    me: async () => {
        return new Promise((resolve, reject) => {
            const token = localStorage.getItem('tl_token')
            if (!token) return reject(new Error('No token'))
            try {
                const payload = JSON.parse(atob(token.split('.')[1]))
                if (payload.exp * 1000 < Date.now()) {
                    localStorage.removeItem('tl_token')
                    return reject(new Error('Token expired'))
                }
                resolve({ name: payload.name, email: payload.email })
            } catch { reject(new Error('Invalid token')) }
        })
    }
}

export const analyzeAPI = {
    // Calls Spring Boot POST /api/analyze
    analyze: async (content, type = 'text') => {
        const res = await fetch(`${BASE_URL}/api/analyze`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content, type })
        })
        if (!res.ok) throw new Error(`Backend error: ${res.status}`)
        return res.json()
        // Returns: { prediction: "REAL"|"FAKE"|"MISLEADING", confidence: 88, explanation: "...", matched_text: "..." }
    },

    // Calls Spring Boot POST /chat
    chat: async (text) => {
        const res = await fetch(`${BASE_URL}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        })
        if (!res.ok) throw new Error(`Chat error: ${res.status}`)
        return res.json()
        // Returns: { reply: "...", video: "..." }
    },

    getHistory: async () => {
        return Promise.resolve([
            { id: 1, title: 'Global markets crash amid new regulations...', status: 'misleading', confidence: 68, date: '2 HRS AGO', type: 'text' },
            { id: 2, title: 'https://news.example.com/breaking/10928', status: 'fake', confidence: 91, date: '5 HRS AGO', type: 'url' },
            { id: 3, title: 'New scientific breakthrough in quantum computing...', status: 'real', confidence: 95, date: '1 DAY AGO', type: 'text' },
            { id: 4, title: 'Politician caught on tape admitting to fraud...', status: 'fake', confidence: 88, date: '2 DAYS AGO', type: 'text' },
        ])
    }
}
