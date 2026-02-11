"use client";
import React, { useState } from 'react';

export default function AuthForm({ onAuth }: { onAuth: (user: any) => void }) {
  const [isRegistering, setIsRegistering] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const stored = JSON.parse(localStorage.getItem('users') || '[]');

    if (isRegistering) {
      // --- VALIDATION LOGIC ---
      if (form.name.length < 2) return alert("Name is too short.");
      if (form.password.length < 6) return alert("Password must be at least 6 characters.");
      
      const phoneRegex = /^[0-9\s+]{8,15}$/;
      if (!phoneRegex.test(form.phone)) return alert("Enter a valid phone number.");

      const emailExists = stored.find((u: any) => u.email === form.email);
      if (emailExists) return alert("This email is already registered.");
      // -------------------------

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
        alert("Invalid email or password.");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-xl border mt-10 animate-in fade-in zoom-in duration-300">
      <h2 className="text-2xl font-bold mb-6 text-center text-slate-800">{isRegistering ? 'Create Account' : 'Welcome Back'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {isRegistering && (
          <>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Name</label>
              <input type="text" placeholder="Full Name" required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" onChange={e => setForm({...form, name: e.target.value})} />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Phone Number</label>
              <input type="tel" placeholder="+12345678" required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" onChange={e => setForm({...form, phone: e.target.value})} />
            </div>
          </>
        )}
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase ml-1">Mail</label>
          <input type="email" placeholder="email@example.com" required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" onChange={e => setForm({...form, email: e.target.value})} />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase ml-1">Password</label>
          <input type="password" placeholder="Min. 6 characters" required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" onChange={e => setForm({...form, password: e.target.value})} />
        </div>
        <button className="w-full bg-indigo-600 text-white py-2 rounded-lg font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100">
          {isRegistering ? 'Register' : 'Log in'}
        </button>
      </form>
      <button onClick={() => setIsRegistering(!isRegistering)} className="w-full mt-4 text-sm text-indigo-500 hover:underline">
        {isRegistering ? 'Already have an account? Login' : 'Need an account? Register'}
      </button>
    </div>
  );
}