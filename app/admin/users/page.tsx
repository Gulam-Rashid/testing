'use client';

import React, { useState, useEffect } from 'react';
import { Users, Shield } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await fetch('/api/users');
    const data = await res.json();
    if (data.users) setUsers(data.users);
  };

  return (
    <div className="space-y-8">
      
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">User Management</h1>
        <p className="text-slate-400 text-xs mt-1">Registered customers and admin accounts</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-800/50 text-slate-400 uppercase tracking-wider">
            <tr>
              <th className="p-4">User</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-800/30 transition">
                <td className="p-4 flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-600/20 text-indigo-400 font-bold flex items-center justify-center">
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-bold text-white">{u.name}</span>
                </td>
                <td className="p-4 text-slate-400">{u.email}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full font-bold ${u.role === 'admin' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-300'}`}>
                    {u.role}
                  </span>
                </td>
                <td className="p-4 text-slate-400">{u.phone || 'N/A'}</td>
                <td className="p-4 text-slate-500">{new Date(u.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
