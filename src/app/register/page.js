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

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-slate-800 mb-6 text-center">Crear Cuenta Fiscal</h1>
        
        {error && <p className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="primer_nombre" placeholder="Primer Nombre" required className="w-full p-2 border rounded" onChange={handleChange} />
          <div className="grid grid-cols-2 gap-4">
            <input name="apellido_paterno" placeholder="Ap. Paterno" required className="w-full p-2 border rounded" onChange={handleChange} />
            <input name="apellido_materno" placeholder="Ap. Materno" className="w-full p-2 border rounded" onChange={handleChange} />
          </div>
          <input name="rfc" placeholder="RFC (13 caracteres)" maxLength={13} required className="w-full p-2 border rounded font-mono" onChange={handleChange} />
          <input name="email" type="email" placeholder="Correo Electrónico" required className="w-full p-2 border rounded" onChange={handleChange} />
          <input name="password" type="password" placeholder="Contraseña" required className="w-full p-2 border rounded" onChange={handleChange} />
          
          <button type="submit" className="w-full bg-indigo-600 text-white p-3 rounded-lg font-bold hover:bg-indigo-700 transition">
            Registrarme
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          ¿Ya tienes cuenta? <Link href="/" className="text-indigo-600 hover:underline">Inicia sesión aquí</Link>
        </p>
      </div>
    </div>
  );
}