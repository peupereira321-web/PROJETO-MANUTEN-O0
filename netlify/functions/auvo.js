exports.handler = async function(event, context) {
    const API_KEY = process.env.AUVO_API_KEY;
    const TOKEN = process.env.AUVO_TOKEN;

    if (!API_KEY || !TOKEN) {
        return { statusCode: 500, body: JSON.stringify({ error: "Chaves não configuradas." }) };
    }

    try {
        // 1. LOGIN
        const loginReq = await fetch("https://api.auvo.com.br/v2/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ apiKey: API_KEY, apiToken: TOKEN }) 
        });
        
        const loginData = await loginReq.json();
        
        if (!loginData.result || !loginData.result.accessToken) {
            return { 
                statusCode: 401, 
                body: JSON.stringify({ error: "Login Recusado: " + JSON.stringify(loginData) }) 
            };
        }

        const accessToken = loginData.result.accessToken;

        // 2. BUSCA TAREFAS
        // Data fixa para pegar suas tarefas de Fevereiro de 2026
        const dataBusca = "2026-02-25"; 
        
        console.log(`Buscando tarefas para: ${dataBusca}`);

        // --- CORREÇÃO AQUI ---
        // Trocamos 'dateFrom' por 'startDate' e 'dateTo' por 'endDate'
        // Baseado na dica do erro que pediu "startDate"
        const url = `https://api.auvo.com.br/v2/tasks?startDate=${dataBusca}&endDate=${dataBusca}`;

        const taskReq = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            }
        });
        
        const taskData = await taskReq.json();

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(taskData)
        };

    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: "Erro Interno: " + error.message }) };
    }
};