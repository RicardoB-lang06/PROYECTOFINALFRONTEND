'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    primer_nombre: '',
    apellido_paterno: '',
    apellido_materno: '',
    rfc: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ 
      ...formData, 
      [name]: name === 'rfc' ? value.toUpperCase() : value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log("payload enviado:", formData);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert('¡Cuenta creada! Ya puedes entrar.');
        router.push('/');
      } else {
        console.error("Error detalle:", data);
        setError(data.error || 'Error en los datos');
      }
    } catch (err) {
      setError('Error de conexión con Render');
    } finally {
      setLoading(false);
    }
  };

  const labelStyle = "block text-sm font-semibold text-slate-900 mb-1";
  const inputStyle = "w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800";

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg">
        <h1 className="text-2xl font-bold text-slate-900 mb-6 text-center border-b pb-4">
          Registro Fiscal
        </h1>
        
        {error && <p className="bg-red-50 text-red-700 p-3 rounded mb-4 text-sm border border-red-200 font-medium">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className={labelStyle}>Primer Nombre</label>
            <input name="primer_nombre" value={formData.primer_nombre} required className={inputStyle} onChange={handleChange} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelStyle}>Apellido Paterno</label>
              <input name="apellido_paterno" value={formData.apellido_paterno} required className={inputStyle} onChange={handleChange} />
            </div>
            <div>
              <label className={labelStyle}>Apellido Materno (Opcional)</label>
              <input name="apellido_materno" value={formData.apellido_materno} className={inputStyle} onChange={handleChange} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelStyle}>RFC (SAT)</label>
              <input name="rfc" value={formData.rfc} maxLength={13} required className={`${inputStyle} font-mono uppercase`} placeholder="ABCD123456XYZ" onChange={handleChange} />
            </div>
            <div>
              <label className={labelStyle}>Email</label>
              <input name="email" type="email" value={formData.email} required className={inputStyle} onChange={handleChange} />
            </div>
          </div>

          <div>
            <label className={labelStyle}>Contraseña de Acceso</label>
            <input name="password" type="password" value={formData.password} required className={inputStyle} onChange={handleChange} />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className={`w-full ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-slate-900 hover:bg-black cursor-pointer'} text-white p-3 rounded-lg font-bold transition-all mt-4 shadow-md`}
          >
            {loading ? 'Registrando...' : 'Crear mi cuenta'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-700 font-medium">
          ¿Ya tienes cuenta? <Link href="/" className="font-bold text-indigo-700 hover:underline">Inicia sesión aquí</Link>
        </p>
      </div>
    </div>
  );
}