'use client';
import { useEffect, useState } from 'react';
import { incomeService } from '@/services/income.service';
import Modal from '@/components/ui/Modal';

export default function IngresosPage() {
  const [ingresos, setIngresos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const initialFormState = {
    fuente: '',
    monto_original: '',
    moneda: 'USD',
    fecha_recepcion: new Date().toISOString().split('T')[0]
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => { loadIngresos(); }, []);

  const loadIngresos = async () => {
    setLoading(true);
    try {
      const res = await incomeService.getAll();
      setIngresos(res.data || []);
    } catch (err) {
      console.error("Error al cargar ingresos:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (i) => {
    setIsEditing(true);
    setSelectedId(i.id);
    setFormData({
      fuente: i.fuente || '',
      monto_original: i.monto_original || '',
      moneda: i.moneda || 'USD',
      fecha_recepcion: i.fecha_recepcion ? i.fecha_recepcion.split('T')[0] : new Date().toISOString().split('T')[0]
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm("¿Estás seguro de eliminar este ingreso? El balance de tu dashboard cambiará.")) {
      try {
        await incomeService.delete(id);
        await loadIngresos();
      } catch (err) {
        alert("Error al eliminar el registro.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const val = parseFloat(formData.monto_original);
    const payload = { ...formData, monto_original: val };

    try {
      if (isEditing) {
        await incomeService.update(selectedId, payload);
      } else {
        await incomeService.create(payload);
      }
      setIsModalOpen(false);
      resetForm();
      await loadIngresos();
    } catch (err) { 
      alert("Error al procesar: " + err.message); 
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setSelectedId(null);
    setFormData(initialFormState);
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Mis Ingresos</h1>
          <p className="text-slate-500 font-medium mt-1">Gestión multimoneda y facturación</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }} 
          className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-100 hover:scale-105 transition-all"
        >
          + Registrar Pago
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-100 text-slate-400 text-xs font-black uppercase tracking-widest">
            <tr>
              <th className="px-8 py-5">Cliente / Fuente</th>
              <th className="px-8 py-5">Monto Original</th>
              <th className="px-8 py-5">Total (MXN)</th>
              <th className="px-8 py-5">Fecha</th>
              <th className="px-8 py-5 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr><td colSpan="5" className="px-8 py-10 text-center font-bold text-slate-400">Cargando ingresos...</td></tr>
            ) : ingresos.length === 0 ? (
              <tr><td colSpan="5" className="px-8 py-20 text-center font-bold text-slate-400 italic">No hay ingresos registrados.</td></tr>
            ) : (
              ingresos.map((i) => (
                <tr key={i.id} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="px-8 py-6 font-bold text-slate-800">{i.fuente}</td>
                  <td className="px-8 py-6 text-slate-600 font-medium">
                    {i.monto_original} <span className="text-[10px] font-bold text-slate-400">{i.moneda}</span>
                  </td>
                  <td className="px-8 py-6 text-indigo-600 font-black">
                    ${Number(i.monto_mxn).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-8 py-6 text-slate-400 font-medium">
                    {new Date(i.fecha_recepcion).toLocaleDateString('es-MX')}
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEditClick(i)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg">✏️</button>
                      <button onClick={() => handleDelete(i.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">🗑️</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditing ? "Editar Pago" : "Registrar Pago"}>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Cliente / Fuente</label>
            <input type="text" required placeholder="Ej. Upwork / Freelance" value={formData.fuente || ''}
              onChange={(e) => setFormData({...formData, fuente: e.target.value})}
              className="w-full p-4 border-2 border-slate-100 rounded-2xl text-slate-900 outline-none focus:border-indigo-600 transition-all" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Monto</label>
              <input type="number" step="0.01" required placeholder="0.00" value={formData.monto_original || ''}
                onChange={(e) => setFormData({...formData, monto_original: e.target.value})}
                className="w-full p-4 border-2 border-slate-100 rounded-2xl text-slate-900 outline-none focus:border-indigo-600" />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Moneda</label>
              <select className="w-full p-4 border-2 border-slate-100 rounded-2xl bg-white font-bold text-slate-900 outline-none focus:border-indigo-600"
                value={formData.moneda || 'USD'} onChange={(e) => setFormData({...formData, moneda: e.target.value})}>
                <option value="USD">USD</option>
                <option value="MXN">MXN</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Fecha de Pago</label>
            <input type="date" value={formData.fecha_recepcion || ''} onChange={(e) => setFormData({...formData, fecha_recepcion: e.target.value})}
              className="w-full p-4 border-2 border-slate-100 rounded-2xl text-slate-900 outline-none focus:border-indigo-600" />
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-xl active:scale-95 transition-all disabled:opacity-50">
            {isSubmitting ? 'Guardando...' : isEditing ? 'Actualizar Ingreso' : 'Guardar Pago'}
          </button>
        </form>
      </Modal>
    </div>
  );
}