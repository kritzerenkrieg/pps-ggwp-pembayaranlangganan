'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Order = {
  id: string;
  name: string;
  price: number;
  status: string;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const handleBayarSekarang = (orderId: string) => {
  router.push(`/payment/${orderId}`);
};

  useEffect(() => {
    fetch('http://localhost:3001/v1/orders')
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setLoading(false);
      });
  }, []);

  const getStatusColor = (status: string) => {
    if (status === 'Belum Bayar' || status === 'Upload Ulang') return 'bg-red-400';
    if (status === 'Lunas') return 'bg-green-500';
    return 'bg-gray-400';
  };

  const getButtonLabel = (status: string) => {
    return (status === 'Belum Bayar' || status === 'Upload Ulang') ? 'Bayar Sekarang' : 'Rincian';
  };

  return (
    <div className="min-h-screen bg-white py-6 px-6">
      <nav className="bg-white shadow-md p-4 flex justify-between mb-6">
        <div className="flex space-x-4 text-black">
          <span>Home</span>
          <span>About</span>
          <span>Resources</span>
          <span>Contact</span>
        </div>
        <button className="bg-purple-600 text-white px-4 py-2 rounded">Akun Saya</button>
      </nav>

      <div className="bg-white p-6 rounded shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold text-black">Pesanan Saya</h1>
          <button className="bg-purple-600 text-white px-4 py-2 rounded">+ Tambah Produk</button>
        </div>

        <input
          type="text"
          placeholder="Cari tanggal atau menu"
          className="w-full border p-2 mb-4 rounded text-black"
        />

        {loading ? (
          <p className="text-center text-black">Loading...</p>
        ) : (
          <table className="w-full text-left border-collapse text-black">
            <thead>
              <tr className="text-sm text-black font-semibold border-b border-gray-300">
                <th className="p-2">INFO PRODUK</th>
                <th className="p-2">HARGA</th>
                <th className="p-2">STATUS</th>
                <th className="p-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-gray-200">
                  <td className="p-2 flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue rounded flex items-center justify-center text-xl">🍔</div>
                    <span className="text-black">{order.name}</span>
                  </td>
                  <td className="p-2 font-medium text-black">
                    Rp{order.price.toLocaleString('id-ID')}
                  </td>
                  <td className="p-2">
                    <span
                      className={`text-white px-3 py-1 text-sm rounded ${getStatusColor(order.status)}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="p-2">
                    <button
                      disabled={order.status !== 'Belum Bayar' && order.status !== 'Upload Ulang'}
                      onClick={() => handleBayarSekarang(order.id)}
                      className={`px-4 py-1 rounded text-sm border 
                        ${['Belum Bayar', 'Upload Ulang'].includes(order.status)
                          ? 'text-black hover:bg-purple-100'
                          : 'text-black cursor-not-allowed bg-gray-100'}`}
                    >
                      {getButtonLabel(order.status)}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}