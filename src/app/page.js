'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../services/auth.service';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.login(email, password);
      router.push('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-10 border border-slate-100">
        
        <div className="flex justify-center mb-6">
          <div className="h-14 w-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Calculadora Fiscal</h1>
          <p className="text-slate-600 font-medium mt-2">Ingresa tus credenciales</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-medium rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-950 mb-2">Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-600 outline-none transition-all text-slate-900"
              placeholder="tu@correo.com"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-950 mb-2">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-600 outline-none transition-all text-slate-900"
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-indigo-600 text-white font-bold py-4 px-4 rounded-xl transition-all shadow-xl shadow-indigo-100 text-lg ${
              loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-indigo-700 active:scale-[0.97]'
            }`}
          >
            {loading ? 'Validando...' : 'Entrar al Sistema'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-600">
            ¿Eres nuevo por aquí?{' '}
            <a href="/registro" className="text-indigo-600 font-bold hover:underline">Crea tu cuenta gratis</a>
          </p>
        </div>
      </div>
    </div>
  );
}