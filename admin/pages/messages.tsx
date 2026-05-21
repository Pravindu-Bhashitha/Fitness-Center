import { useEffect, useState } from 'react';
import Link from 'next/link';

type Message = {
  id: string | number;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt?: string;
};

export default function MessagesPage() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Message | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE_URL}/api/messages`)
      .then((r) => r.json())
      .then((payload) => {
        const list = Array.isArray(payload) ? payload : payload?.messages ?? payload?.data ?? [];
        setMessages(list);
        setLoading(false);
      })
      .catch((err) => {
        setError(String(err));
        setLoading(false);
      });
  }, []);

  return (
    <div className="admin-container">
      <div className="admin-hero">
        <div>
          <h1 className="admin-header">Messages</h1>
          <p className="admin-sub">Messages received from the public contact form</p>
        </div>
        <Link href="/" className="btn">Back</Link>
      </div>

      <div style={{ marginTop: 12 }}>
        {loading && <div className="fz-empty">Loading messages...</div>}
        {error && <div className="fz-empty" style={{ color: 'red' }}>{error}</div>}

        {!loading && !error && (
          <>
            <table className="fz-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Received</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((m) => (
                  <tr key={String(m.id)} onClick={() => setSelected(m)} style={{ cursor: 'pointer' }}>
                    <td>{m.id}</td>
                    <td>{m.name}</td>
                    <td>{m.email}</td>
                    <td>{m.phone}</td>
                    <td>{m.createdAt ? new Date(m.createdAt).toLocaleString() : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>

      {selected && (
        <div className="fz-modal" onClick={() => setSelected(null)}>
          <div className="fz-modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0 }}>Message from {selected.name}</h2>
              <button className="btn" onClick={() => setSelected(null)}>Close</button>
            </div>

            <div style={{ marginTop: 12 }}>
              <dl>
                <dt>Name</dt><dd>{selected.name}</dd>
                <dt>Email</dt><dd>{selected.email}</dd>
                <dt>Phone</dt><dd>{selected.phone}</dd>
                <dt>Received</dt><dd>{selected.createdAt ? new Date(selected.createdAt).toLocaleString() : '-'}</dd>
                <dt>Message</dt><dd style={{ whiteSpace: 'pre-wrap' }}>{selected.message}</dd>
              </dl>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
