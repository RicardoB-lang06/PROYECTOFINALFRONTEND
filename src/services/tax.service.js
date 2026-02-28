const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const taxService = {
    getSummary: async (mes, anio) => {
        const token = localStorage.getItem('token');
        const url = `${process.env.NEXT_PUBLIC_API_URL}/impuestos/resumen?mes=${mes}&anio=${anio}`;
        
        const response = await fetch(url, {
            headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("🚨 DETALLE DEL ERROR:", {
            status: response.status,
            statusText: response.statusText,
            url: url,
            body: errorText
            });
            
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        return await response.json();
}
};