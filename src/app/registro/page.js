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
    console.log("al backend:", formData);

    if (formData.rfc.length < 12) {
      setLoading(false);
      return setError('El RFC debe tener al menos 12 caracteres');
    }

    try {
      console.log("Enviando registro a:", `${process.env.NEXT_PUBLIC_API_URL}/users/register`);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Usuario creado con éxito. Ahora puedes iniciar sesión.');
        router.push('/'); 
      } else {
        console.error("Error del servidor:", data);
        setError(data.error || 'Error al registrar usuario');
      }
    } catch (err) {
      console.error("Error de conexión:", err);
      setError('Error de conexión con el servidor de Render. Revisa tu internet o el estado del backend.');
    } finally {
      setLoading(false);
    }
  };

  const labelStyle = "block text-sm font-semibold text-slate-900 mb-1";
  const inputStyle = "w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 transition-all";

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg">
        <h1 className="text-2xl font-bold text-slate-900 mb-6 text-center border-b pb-4">
          Registro de Usuario Fiscal
        </h1>
        
        {error && <p className="bg-red-50 text-red-700 p-3 rounded mb-4 text-sm border border-red-200">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelStyle}>Primer Nombre</label>
              <input name="primer_nombre" value={formData.primer_nombre} required className={inputStyle} onChange={handleChange} />
            </div>
            <div>
              <label className={labelStyle}>Apellido Paterno</label>
              <input name="apellido_paterno" value={formData.apellido_paterno} required className={inputStyle} onChange={handleChange} />
            </div>
          </div>

          <div>
            <label className={labelStyle}>Apellido Materno (Opcional)</label>
            <input name="apellido_materno" value={formData.apellido_materno} className={inputStyle} onChange={handleChange} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelStyle}>RFC (SAT)</label>
              <input name="rfc" value={formData.rfc} maxLength={13} required className={`${inputStyle} font-mono`} placeholder="ABCD123456XYZ" onChange={handleChange} />
            </div>
            <div>
              <label className={labelStyle}>Email</label>
              <input name="email" type="email" value={formData.email} required className={inputStyle} onChange={handleChange} />
            </div>
          </div>

          <div>
            <label className={labelStyle}>Contraseña de Acceso</label>
            <input name="password" type="password" value={formData.password} required className={inputStyle} onChange={handleChange} />
            <p className="text-xs text-slate-500 mt-1">Tu contraseña es sensible a mayúsculas y minúsculas.</p>
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className={`w-full ${loading ? 'cursor-not-allowed bg-slate-400' : 'cursor-pointer bg-slate-900 hover:bg-black'} text-white p-3 rounded-lg font-bold transition-colors mt-4 shadow-md`}
          >
            {loading ? 'Procesando registro...' : 'Crear Cuenta'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-700">
          ¿Ya tienes cuenta? <Link href="/" className="font-bold text-indigo-700 hover:underline">Inicia sesión aquí</Link>
        </p>
      </div>
    </div>
  );
}