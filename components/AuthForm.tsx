"use client";
import React, { useState } from 'react';

export default function AuthForm({ onAuth }: { onAuth: (user: any) => void }) {
  const [isRegistering, setIsRegistering] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const stored = JSON.parse(localStorage.getItem('users') || '[]');

    if (isRegistering) {
      stored.push(form);
      localStorage.setItem('users', JSON.stringify(stored));
      localStorage.setItem('session', JSON.stringify(form));
      onAuth(form);
    } else {
      const user = stored.find((u: any) => u.email === form.email && u.password === form.password);
      if (user) {
        localStorage.setItem('session', JSON.stringify(user));
        onAuth(user);
      } else {
        alert("Invalid credentials");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-xl border mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">{isRegistering ? 'Register' : 'Login'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {isRegistering && (
          <>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input type="text" required className="w-full p-2 border rounded-lg" onChange={e => setForm({...form, name: e.target.value})} />
            
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input type="tel" required className="w-full p-2 border rounded-lg" onChange={e => setForm({...form, phone: e.target.value})} />
          </>
        )}
        <label className="block text-sm font-medium text-gray-700">Mail</label>
        <input type="email" required className="w-full p-2 border rounded-lg" onChange={e => setForm({...form, email: e.target.value})} />
        
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input type="password" required className="w-full p-2 border rounded-lg" onChange={e => setForm({...form, password: e.target.value})} />
        
        <button className="w-full bg-indigo-600 text-white py-2 rounded-lg font-bold">
          {isRegistering ? 'Create Account' : 'Sign In'}
        </button>
      </form>
      <button onClick={() => setIsRegistering(!isRegistering)} className="w-full mt-4 text-sm text-indigo-500 underline">
        {isRegistering ? 'Already registered? Login' : 'Need an account? Register'}
      </button>
    </div>
  );
}