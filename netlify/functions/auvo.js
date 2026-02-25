exports.handler = async function(event, context) {
    const API_KEY = process.env.AUVO_API_KEY;
    const TOKEN = process.env.AUVO_TOKEN;

    if (!API_KEY || !TOKEN) {
        return { statusCode: 500, body: JSON.stringify({ error: "Chaves não configuradas." }) };
    }

    try {
        // 1. LOGIN
        // Mantemos 'apiToken' que descobrimos ser o correto
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

        // 2. BUSCAR TAREFAS (Ajuste Final)
        // Voltamos para 'dateFrom' e 'dateTo' que funcionam.
        // E colocamos o intervalo do MÊS TODO de Fevereiro/2026 para garantir.
        
        const dataInicio = "2026-02-01";
        const dataFim = "2026-02-28";
        
        console.log(`Buscando tarefas entre ${dataInicio} e ${dataFim}`);

        const url = `https://api.auvo.com.br/v2/tasks?dateFrom=${dataInicio}&dateTo=${dataFim}`;

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