'use client';
import { useEffect, useState } from 'react';
import { taxService } from '@/services/tax.service';

export default function DeclaracionPage() {
  const [resumen, setResumen] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTaxData() {
      try {
        const res = await taxService.getSummary('02', '2026');
        setResumen(res.data);
      } catch (err) {
        console.error("Error fiscal:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTaxData();
  }, []);

  if (loading) return <div className="p-20 text-center font-bold text-slate-400">Calculando impuestos de febrero...</div>;

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Declaración Mensual</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-2">Periodo: Febrero 2026</p>
        </div>
        <div className="bg-indigo-600 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-tighter">
          Estatus: Listo para presentar
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-black text-slate-900">ISR (Confianza)</h2>
            <span className="text-indigo-600 font-bold">Tasa: {resumen?.calculo_isr?.tasa_aplicada}%</span>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between text-slate-500 font-medium">
              <span>Ingresos Brutos</span>
              <span>${resumen?.resumen_ingresos?.total_bruto_mxn?.toLocaleString()}</span>
            </div>
            <div className="pt-4 border-t border-slate-50 flex justify-between items-end">
              <span className="text-sm font-bold text-slate-400 uppercase">Total a Pagar ISR</span>
              <span className="text-3xl font-black text-slate-900">${resumen?.calculo_isr?.isr_a_pagar?.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-black text-slate-900 mb-6">IVA (Acreditable)</h2>
          <div className="space-y-4">
            <div className="flex justify-between text-slate-500 font-medium">
              <span>IVA Cobrado (Tasa 0%)</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between text-slate-500 font-medium">
              <span>IVA Pagado en Gastos</span>
              <span>${resumen?.resumen_deducciones?.total_iva_pagado?.toLocaleString()}</span>
            </div>
            <div className="pt-4 border-t border-slate-50 flex justify-between items-end text-green-600">
              <span className="text-sm font-bold uppercase">Saldo a Favor</span>
              <span className="text-3xl font-black">${resumen?.calculo_iva?.saldo_a_favor_iva?.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 bg-slate-900 text-white p-8 rounded-3xl shadow-xl">
        <h3 className="text-lg font-black mb-4 flex items-center gap-2">
          <span>💡</span> Guía de Llenado SAT
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-slate-800 rounded-2xl border border-slate-700">
            <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Casilla: Ingresos Cobrados</p>
            <p className="text-xl font-mono">${resumen?.resumen_ingresos?.total_bruto_mxn?.toFixed(0)}</p>
          </div>
          <div className="p-4 bg-slate-800 rounded-2xl border border-slate-700">
            <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Casilla: IVA de Gastos</p>
            <p className="text-xl font-mono">${resumen?.resumen_deducciones?.total_iva_pagado?.toFixed(0)}</p>
          </div>
          <button className="bg-white text-slate-900 font-black rounded-2xl hover:bg-indigo-50 transition-colors uppercase text-sm tracking-widest">
            Exportar a PDF
          </button>
        </div>
      </div>
    </div>
  );
}