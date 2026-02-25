exports.handler = async function(event, context) {
    const API_KEY = process.env.AUVO_API_KEY;
    const TOKEN = process.env.AUVO_TOKEN;

    if (!API_KEY || !TOKEN) {
        return { statusCode: 500, body: JSON.stringify({ error: "Chaves não configuradas." }) };
    }

    try {
        // --- A CORREÇÃO ESTÁ AQUI EMBAIXO ---
        // Trocamos "token" por "apiToken"
        const loginReq = await fetch("https://api.auvo.com.br/v2/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ apiKey: API_KEY, apiToken: TOKEN }) 
        });
        
        const loginData = await loginReq.json();
        
        if (!loginData.result || !loginData.result.accessToken) {
            console.log("Erro Auvo:", JSON.stringify(loginData));
            return { 
                statusCode: 401, 
                body: JSON.stringify({ error: "Auvo Recusou: " + JSON.stringify(loginData) }) 
            };
        }

        const accessToken = loginData.result.accessToken;
        const hoje = new Date().toISOString().split('T')[0];
        
        const taskReq = await fetch(`https://api.auvo.com.br/v2/tasks?dateFrom=${hoje}&dateTo=${hoje}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            }
        });
        const taskData = await taskReq.json();

        return {
            statusCode: 200,
            body: JSON.stringify(taskData)
        };

    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: "Erro Geral: " + error.message }) };
    }
};