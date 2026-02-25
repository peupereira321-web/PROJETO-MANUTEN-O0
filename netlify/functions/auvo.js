exports.handler = async function(event, context) {
    const API_KEY = process.env.AUVO_API_KEY;
    const TOKEN = process.env.AUVO_TOKEN;

    if (!API_KEY || !TOKEN) {
        return { 
            statusCode: 500, 
            body: JSON.stringify({ error: "Chaves não configuradas no Netlify." }) 
        };
    }

    try {
        // 1. LOGIN - Obtendo o Bearer Token
        const loginReq = await fetch("https://api.auvo.com.br/v2/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ apiKey: API_KEY, apiToken: TOKEN }) 
        });
        
        const loginData = await loginReq.json();
        
        if (!loginData.result || !loginData.result.accessToken) {
            return { 
                statusCode: 401, 
                body: JSON.stringify({ error: "Erro de autenticação no Auvo." }) 
            };
        }

        const accessToken = loginData.result.accessToken;

        // 2. BUSCAR TAREFAS - Nomes de campos oficiais da API V2
        // taskDateFrom e taskDateTo são os parâmetros corretos conforme a documentação
        const dataInicio = "2026-02-01";
        const dataFim = "2026-02-28";
        
        const url = `https://api.auvo.com.br/v2/tasks?taskDateFrom=${dataInicio}&taskDateTo=${dataFim}`;

        const taskReq = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            }
        });
        
        const taskData = await taskReq.json();

        // 3. RETORNO PARA O DASHBOARD
        return {
            statusCode: 200,
            headers: { 
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*" 
            },
            body: JSON.stringify(taskData)
        };

    } catch (error) {
        return { 
            statusCode: 500, 
            body: JSON.stringify({ error: "Erro Interno: " + error.message }) 
        };
    }
};