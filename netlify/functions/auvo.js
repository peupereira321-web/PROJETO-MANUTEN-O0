exports.handler = async function(event, context) {
    const API_KEY = process.env.AUVO_API_KEY;
    const TOKEN = process.env.AUVO_TOKEN;

    if (!API_KEY || !TOKEN) {
        return { statusCode: 500, body: JSON.stringify({ error: "Chaves não configuradas." }) };
    }

    try {
        const loginReq = await fetch("https://api.auvo.com.br/v2/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ apiKey: API_KEY, token: TOKEN })
        });
        const loginData = await loginReq.json();
        
        if (!loginData.result || !loginData.result.accessToken) {
            throw new Error("Erro de login no Auvo");
        }

        // Pega data de hoje (fuso horário local simplificado)
        const hoje = new Date().toISOString().split('T')[0];
        
        const taskReq = await fetch(`https://api.auvo.com.br/v2/tasks?dateFrom=${hoje}&dateTo=${hoje}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${loginData.result.accessToken}`,
                "Content-Type": "application/json"
            }
        });
        const taskData = await taskReq.json();

        return {
            statusCode: 200,
            body: JSON.stringify(taskData)
        };

    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
};