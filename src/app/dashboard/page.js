'use client';
import { useEffect, useState } from 'react';
import { taxService } from '@/services/tax.service';

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await taxService.getSummary('02', '2026');
        setData(res.data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return (
    <div className="p-20 text-center">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-12 w-12 bg-indigo-200 rounded-full mb-4"></div>
        <div className="font-bold text-slate-400 uppercase tracking-widest text-xs">Calculando impuestos...</div>
      </div>
    </div>
  );

  if (error) return (
    <div className="p-10 text-center">
      <div className="bg-red-50 text-red-600 p-8 rounded-3xl border-2 border-red-100 inline-block shadow-xl">
        <h2 className="text-xl font-black mb-2">⚠️ Error de Conexión Fiscal</h2>
        <p className="font-medium opacity-80 mb-6">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-red-600 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-red-700 transition-all active:scale-95"
        >
          Reintentar Conexión
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <header className="mb-10">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Resumen Fiscal</h1>
        <p className="text-slate-500 font-bold font-mono text-sm mt-1 uppercase tracking-widest">Periodo: Febrero 2026</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Ingresos Totales (MXN)</p>
          <h2 className="text-4xl font-black text-indigo-600 mt-3">
            ${data?.resumen_ingresos?.total_bruto_mxn?.toLocaleString('es-MX', { minimumFractionDigits: 2 }) || '0.00'}
          </h2>
          <div className="mt-5 px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black rounded-lg inline-block uppercase tracking-tighter">
            ↑ Tasa ISR: {data?.calculo_isr?.tasa_aplicada || '0'}%
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">ISR a Pagar</p>
          <h2 className="text-4xl font-black text-red-500 mt-3">
            ${data?.calculo_isr?.isr_a_pagar?.toLocaleString('es-MX', { minimumFractionDigits: 2 }) || '0.00'}
          </h2>
          <p className="mt-5 text-[10px] text-slate-400 font-bold uppercase tracking-widest">Calculado bajo RESICO 2026</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border-2 border-indigo-100 bg-indigo-50/10">
          <p className="text-xs font-black text-indigo-600 uppercase tracking-widest">Saldo a Favor IVA</p>
          <h2 className="text-4xl font-black text-indigo-700 mt-3">
            ${data?.calculo_iva?.saldo_a_favor_iva?.toLocaleString('es-MX', { minimumFractionDigits: 2 }) || '0.00'}
          </h2>
          <div className="mt-5 flex items-center gap-2">
             <div className="h-2 w-2 bg-indigo-400 rounded-full animate-pulse"></div>
             <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
               Gastos: ${data?.resumen_deducciones?.total_gastos_mxn?.toLocaleString() || '0.00'}
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}