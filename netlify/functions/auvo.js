// --- TRECHO NOVO: PEGAR UMA JANELA DE DATAS MAIOR ---
        
        // Função simples para somar/subtrair dias
        const somarDias = (dias) => {
            const data = new Date();
            data.setDate(data.getDate() + dias);
            return data.toISOString().split('T')[0];
        };

        const dataInicio = somarDias(-7); // 7 dias atrás
        const dataFim = somarDias(7);     // 7 dias pra frente
        
        console.log(`Buscando tarefas de ${dataInicio} até ${dataFim}`);

        const taskReq = await fetch(`https://api.auvo.com.br/v2/tasks?dateFrom=${dataInicio}&dateTo=${dataFim}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            }
        });
        // -----------------------------------------------------

        const taskData = await taskReq.json();

        return {
            statusCode: 200,
            body: JSON.stringify(taskData)
        };

    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: "Erro Geral: " + error.message }) };
    }
};