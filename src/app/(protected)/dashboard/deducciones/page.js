'use client';
import { useEffect, useState } from 'react';
import { deductionService } from '@/services/deduction.service';
import Modal from '@/components/ui/Modal';

export default function DeduccionesPage() {
  const [deducciones, setDeducciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const initialFormState = {
    concepto: '',
    rfc_emisor: '',
    categoria: 'Gastos Operativos',
    monto_original: '',
    moneda: 'MXN',
    fecha_gasto: new Date().toISOString().split('T')[0]
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    loadDeducciones();
  }, []);

  const loadDeducciones = async () => {
    setLoading(true);
    try {
      const res = await deductionService.getAll();
      setDeducciones(res.data || []);
    } catch (err) {
      console.error("Error al cargar deducciones:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (d) => {
    setIsEditing(true);
    setSelectedId(d.id);
    setFormData({
      concepto: d.concepto || '',
      rfc_emisor: d.rfc_emisor || '',
      categoria: d.categoria || 'Gastos Operativos',
      monto_original: d.monto_original || '',
      moneda: d.moneda || 'MXN',
      fecha_gasto: d.fecha_gasto ? d.fecha_gasto.split('T')[0] : new Date().toISOString().split('T')[0]
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    console.log("Intentando borrar la deducción con ID", id);
    if (confirm("¿Estás seguro de eliminar este gasto?")) {
      try {
        await deductionService.delete(id);
        await loadDeducciones();
      } catch (err) {
        alert("Error al eliminar el registro.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const val = parseFloat(formData.monto_original);
    const payload = { 
      ...formData, 
      monto_mxn: val,
      monto: val
    };

    try {
      if (isEditing) {
        await deductionService.update(selectedId, payload);
      } else {
        await deductionService.create(payload);
      }
      setIsModalOpen(false);
      resetForm();
      await loadDeducciones();
    } catch (err) { 
      alert(err.message); 
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
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Deducciones</h1>
          <p className="text-slate-500 font-medium mt-1">Gestión de gastos operativos y fiscales</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }} 
          className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition-all"
        >
          + Nueva Deducción
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 text-xs font-black uppercase tracking-widest">
            <tr>
              <th className="px-8 py-5">Gasto / Proveedor</th>
              <th className="px-8 py-5">RFC Emisor</th>
              <th className="px-8 py-5">Categoría</th>
              <th className="px-8 py-5">Monto (MXN)</th>
              <th className="px-8 py-5">Fecha</th>
              <th className="px-8 py-5 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr><td colSpan="6" className="px-8 py-10 text-center font-bold text-slate-400">Cargando...</td></tr>
            ) : deducciones.map((d) => (
              <tr key={d.id} className="hover:bg-slate-50/30 transition-colors group">
                <td className="px-8 py-6 font-bold text-slate-800">{d.concepto}</td>
                <td className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-tighter">{d.rfc_emisor}</td>
                <td className="px-8 py-6 text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md uppercase inline-block mt-5 ml-8">{d.categoria}</td>
                <td className="px-8 py-6 text-red-600 font-black">${Number(d.monto_mxn).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                <td className="px-8 py-6 text-slate-400 font-medium">{new Date(d.fecha_gasto).toLocaleDateString('es-MX', { timeZone: 'UTC' })}</td>
                <td className="px-8 py-6 text-center">
                  <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEditClick(d)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg">✏️</button>
                    <button onClick={() => handleDelete(d.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditing ? "Editar Deducción" : "Registrar Deducción"}>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Concepto</label>
            <input type="text" required placeholder="Ej. AWS Servidores" value={formData.concepto || ''}
              onChange={(e) => setFormData({...formData, concepto: e.target.value})}
              className="w-full p-4 border-2 border-slate-100 rounded-2xl text-slate-900 outline-none focus:border-indigo-600 transition-all" />
          </div>

          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">RFC del Emisor</label>
            <input type="text" required placeholder="Ej. AWS990101XYZ" value={formData.rfc_emisor || ''}
              onChange={(e) => setFormData({...formData, rfc_emisor: e.target.value})}
              className="w-full p-4 border-2 border-slate-100 rounded-2xl text-slate-900 uppercase" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Monto</label>
              <input type="number" step="0.01" required placeholder="0.00" value={formData.monto_original || ''}
                onChange={(e) => setFormData({...formData, monto_original: e.target.value})}
                className="w-full p-4 border-2 border-slate-100 rounded-2xl text-slate-900" />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Moneda</label>
              <select className="w-full p-4 border-2 border-slate-100 rounded-2xl bg-white font-bold text-slate-900"
                value={formData.moneda || 'MXN'} onChange={(e) => setFormData({...formData, moneda: e.target.value})}>
                <option value="MXN">MXN</option>
                <option value="USD">USD</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Categoría Fiscal</label>
            <select className="w-full p-4 border-2 border-slate-100 rounded-2xl bg-white font-bold text-slate-900"
              value={formData.categoria || 'Gastos Operativos'} onChange={(e) => setFormData({...formData, categoria: e.target.value})}>
              <option value="Gastos Operativos">Gastos Operativos</option>
              <option value="Salud">Salud</option>
              <option value="Educación">Educación</option>
              <option value="Otros">Otros</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Fecha</label>
            <input type="date" value={formData.fecha_gasto || ''} onChange={(e) => setFormData({...formData, fecha_gasto: e.target.value})}
              className="w-full p-4 border-2 border-slate-100 rounded-2xl text-slate-900" />
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-xl active:scale-95 transition-all">
            {isSubmitting ? 'Procesando...' : isEditing ? 'Actualizar Registro' : 'Guardar Deducción'}
          </button>
        </form>
      </Modal>
    </div>
  );
}