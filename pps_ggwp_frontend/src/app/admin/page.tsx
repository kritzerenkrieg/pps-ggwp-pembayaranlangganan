'use client';
import React, { useEffect, useState } from 'react';

export default function AdminPaymentDashboard() {
  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => {
    fetch('http://localhost:3001/v1/payment/all')
      .then(res => res.json())
      .then(data => setPayments(data));
  }, []);

  const updateStatus = async (orderId: string, status: string) => {
    const res = await fetch(`http://localhost:3001/v1/orders/${orderId}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (res.ok) {
      alert(`Status order ${orderId} diubah menjadi ${status}`);
      setPayments(prev => prev.map(p => p.order_id === orderId ? { ...p, status } : p));
    } else {
      alert('Gagal mengubah status');
    }
  };

  return (
    <div className="min-h-screen bg-white text-black p-8">
      <h1 className="text-2xl font-bold mb-6">Verifikasi Pembayaran</h1>
      <table className="w-full border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Order ID</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">File</th>
            <th className="p-2 border">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {payments.map(p => (
            <tr key={p.order_id} className="border-t">
              <td className="p-2 border">{p.order_id}</td>
              <td className="p-2 border">{p.status}</td>
              <td className="p-2 border">
                {p.file && typeof p.file === 'string' && p.file.trim() !== '' ? (
                    p.file.endsWith('.pdf') ? (
                    <a
                        href={`http://localhost:3001/uploads/${p.file}`}
                        download
                        className="text-blue-600 underline"
                    >
                        Download PDF
                    </a>
                    ) : (
                    <img
                        src={`http://localhost:3001/uploads/${p.file}`}
                        alt="Bukti"
                        className="w-20 h-20 object-contain border"
                    />
                    )
                ) : (
                    'Belum upload'
                )}
                </td>
              <td className="p-2 border space-x-2">
                <button
                  onClick={() => updateStatus(p.order_id, 'Upload Ulang')}
                  className="px-3 py-1 border rounded bg-red-100 hover:bg-red-200"
                >Upload Ulang</button>
                <button
                  onClick={() => updateStatus(p.order_id, 'Lunas')}
                  className="px-3 py-1 border rounded bg-green-100 hover:bg-green-200"
                >Lunas</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
