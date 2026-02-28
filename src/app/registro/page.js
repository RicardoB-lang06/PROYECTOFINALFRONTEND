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
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value.toUpperCase() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.rfc.length < 12) {
      return setError('El RFC debe tener al menos 12 caracteres');
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Usuario creado con éxito. Ahora puedes iniciar sesión.');
        router.push('/');
      } else {
        const data = await response.json();
        setError(data.error || 'Error al registrar usuario');
      }
    } catch (err) {
      setError('Error de conexión con el servidor de Render');
    }
  };
  const labelStyle = "block text-sm font-semibold text-slate-900 mb-1";
  const inputStyle = "w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800";

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg">
        <h1 className="text-2xl font-bold text-slate-900 mb-6 text-center border-b pb-4">
          Registro de Usuario Fiscal
        </h1>
        
        {error && <p className="bg-red-50 text-red-700 p-3 rounded mb-4 text-sm border border-red-200">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelStyle}>Primer Nombre</label>
            <input name="primer_nombre" required className={inputStyle} onChange={handleChange} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelStyle}>Apellido Paterno</label>
              <input name="apellido_paterno" required className={inputStyle} onChange={handleChange} />
            </div>
            <div>
              <label className={labelStyle}>Apellido Materno</label>
              <input name="apellido_materno" className={inputStyle} onChange={handleChange} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelStyle}>RFC (SAT)</label>
              <input name="rfc" maxLength={13} required className={`${inputStyle} font-mono`} placeholder="ABCD123456XYZ" onChange={handleChange} />
            </div>
            <div>
              <label className={labelStyle}>Correo Institucional / Personal</label>
              <input name="email" type="email" required className={inputStyle} onChange={handleChange} />
            </div>
          </div>

          <div>
            <label className={labelStyle}>Contraseña de Acceso</label>
            <input name="password" type="password" required className={inputStyle} onChange={handleChange} />
            <p className="text-xs text-slate-500 mt-1">Usa al menos 8 caracteres para mayor seguridad.</p>
          </div>
          
          <button type="submit" className="w-full bg-slate-900 text-white p-3 rounded-lg font-bold hover:bg-black transition-colors mt-4">
            Crear Cuenta de Freelancer
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-700">
          ¿Ya tienes cuenta? <Link href="/" className="font-bold text-indigo-700 hover:underline">Inicia sesión aquí</Link>
        </p>
      </div>
    </div>
  );
}