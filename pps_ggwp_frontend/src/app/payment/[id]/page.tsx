'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PaymentPage() {
  const { id } = useParams();
  const router = useRouter();
  const [payment, setPayment] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:3001/v1/payment/${id}/form`)
      .then((res) => res.json())
      .then((data) => setPayment(data));
  }, [id]);

  const handleSubmit = async () => {
    if (!file || !payment) return;
    setSubmitting(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('price', payment.price);
    formData.append('rekeningTujuan', 'BNI 12345678');

    const res = await fetch(`http://localhost:3001/v1/payment/${id}/form`, {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      alert('Bukti pembayaran berhasil dikirim.');
      router.push('/orders');
    } else {
      alert('Gagal mengirim bukti pembayaran.');
    }
    setSubmitting(false);
  };

  if (!payment) return <p className="text-center p-6">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center text-black py-10 px-4">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Pembayaran Pesanan</h1>
        <button onClick={() => router.back()} className="text-purple-700 mb-4 text-sm font-semibold">← Kembali</button>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Jumlah pembayaran</label>
          <div className="bg-gray-100 rounded px-4 py-2 text-gray-500">Rp{payment.price?.toLocaleString('id-ID')}</div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Rekening Tujuan</label>
          <div className="bg-gray-100 rounded px-4 py-2 text-gray-500">BNI: 12345678</div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2">Bukti Pembayaran</label>
          <div className="bg-gray-100 p-6 rounded flex flex-col items-center">
            <span className="text-4xl">📄</span>
            <span className="text-sm text-gray-500 mb-2 text-gray-500">upload gambar</span>
            <input
              type="file"
              accept="image/png, image/jpeg, application/pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting || !file}
          className="bg-purple-600 hover:bg-purple-700 text-white py-2 w-full rounded disabled:opacity-50"
        >
          {submitting ? 'Mengirim...' : 'Konfirmasi'}
        </button>
      </div>
    </div>
  );
}
