import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

type Booking = {
  id: number | string;
  type: string;
  trainerOrClass: string;
  specialty: string;
  date: string;
  time: string;
  duration: string;
  fullName: string;
  email: string;
  phone: string;
  goals?: string;
  notes?: string;
};

export default function AdminIndex() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [trainerCount, setTrainerCount] = useState(0);
  const [messageCount, setMessageCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'class' | 'trainer'>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Modal
  const [selected, setSelected] = useState<Booking | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`${API_BASE_URL}/api/bookings`).then((res) => res.json()),
      fetch(`${API_BASE_URL}/api/trainers`).then((res) => res.json()),
      fetch(`${API_BASE_URL}/api/messages`).then((res) => res.json()),
    ])
      .then(([bookingsData, trainersData, messagesData]) => {
        setBookings(bookingsData.bookings ?? []);
        setTrainerCount((trainersData.trainers ?? []).length);
        setMessageCount((messagesData.messages ?? messagesData).length ?? 0);
        setLoading(false);
      })
      .catch((err) => {
        setError(String(err));
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    let out = bookings.slice();

    if (filterType !== 'all') out = out.filter((b) => b.type === filterType);

    if (startDate) {
      const s = new Date(startDate);
      out = out.filter((b) => new Date(b.date) >= s);
    }

    if (endDate) {
      const e = new Date(endDate);
      // include end date by setting to end of day
      e.setHours(23, 59, 59, 999);
      out = out.filter((b) => new Date(b.date) <= e);
    }

    // sort by date desc
    out.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return out;
  }, [bookings, filterType, startDate, endDate]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  useEffect(() => {
    // reset to first page when filters change
    setPage(1);
  }, [filterType, startDate, endDate]);

  function exportCSV(rows: Booking[]) {
    if (!rows || rows.length === 0) return;

    const headers = ['id', 'type', 'trainerOrClass', 'specialty', 'date', 'time', 'duration', 'fullName', 'email', 'phone', 'goals', 'notes'];
    const csv = [headers.join(',')].concat(
      rows.map((r) => headers.map((h) => JSON.stringify((r as any)[h] ?? '')).join(',')),
    ).join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookings_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleLogout() {
    localStorage.removeItem('fitzone-admin-auth');
    router.replace('/login');
  }

  return (
    <div className="admin-container">
      <div className="admin-hero">
        <div>
          <h1 className="admin-header">FitZone — Admin Dashboard</h1>
          <p className="admin-sub">Bookings overview (read-only)</p>
        </div>
        <button className="btn" onClick={handleLogout}>Log out</button>
      </div>

      <section className="admin-shortcuts">
        <div className="shortcut-card shortcut-card--highlight">
          <div>
            <p className="shortcut-label">Quick Access</p>
            <h2>Manage trainers</h2>
            <p>Add, edit, or delete trainer profiles from one place.</p>
          </div>
          <Link href="/trainers" className="btn btn-primary shortcut-action">
            Open Trainers Manager
          </Link>
        </div>

        <div className="shortcut-card shortcut-card--highlight shortcut-card--blue">
          <div>
            <p className="shortcut-label">Quick Access</p>
            <h2>Manage classes</h2>
            <p>Create, update, or remove class cards used by the customer site.</p>
          </div>
          <Link href="/classes" className="btn btn-primary shortcut-action shortcut-action--blue">
            Open Classes Manager
          </Link>
        </div>

        <div className="shortcut-card shortcut-card--highlight shortcut-card--green">
          <div>
            <p className="shortcut-label">Quick Access</p>
            <h2>Messages</h2>
            <p>View messages received from the contact form.</p>
          </div>
          <Link href="/messages" className="btn btn-primary shortcut-action shortcut-action--green">
            Open Messages ({messageCount})
          </Link>
        </div>

        <div className="shortcut-card">
          <p className="shortcut-label">Overview</p>
          <div className="shortcut-stats">
            <div>
              <span>{bookings.length}</span>
              <p>Bookings</p>
            </div>
            <div>
              <span>{trainerCount}</span>
              <p>Trainers</p>
            </div>
            <div>
              <span>6</span>
              <p>Classes</p>
            </div>
          </div>
        </div>
      </section>

      <div className="controls">
        <div className="control-group">
          <label className="label">Show:</label>
          <select className="select" value={filterType} onChange={(e) => setFilterType(e.target.value as any)}>
            <option value="all">All</option>
            <option value="class">Classes</option>
            <option value="trainer">Trainer</option>
          </select>
        </div>

        <div className="control-group">
          <label className="label">From:</label>
          <input className="input-date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <label className="label">To:</label>
          <input className="input-date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button className="btn btn-primary" onClick={() => exportCSV(filtered)}>Export CSV</button>
        </div>
      </div>

      <div>
        {loading && <div className="fz-empty">Loading bookings...</div>}
        {error && <div className="fz-empty" style={{ color: 'red' }}>{error}</div>}

        {!loading && !error && (
          <>
            <table className="fz-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Type</th>
                  <th>Trainer / Class</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((b) => (
                  <tr key={String(b.id)} onClick={() => setSelected(b)} style={{ cursor: 'pointer' }}>
                    <td>{b.id}</td>
                    <td>{b.type}</td>
                    <td>{b.trainerOrClass}</td>
                    <td>{b.date}</td>
                    <td>{b.time}</td>
                    <td>{b.fullName}</td>
                    <td>{b.email}</td>
                    <td>{b.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pagination">
              <button className="btn" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>Prev</button>
              <span>Page {page} / {totalPages}</span>
              <button className="btn" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>Next</button>
            </div>
          </>
        )}
      </div>

      {/* Modal */}
      {selected && (
        <div className="fz-modal" onClick={() => setSelected(null)}>
          <div className="fz-modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0 }}>Booking details</h2>
              <button className="btn" onClick={() => setSelected(null)}>Close</button>
            </div>

            <div style={{ marginTop: 12 }}>
              <dl>
                <dt>ID</dt><dd>{selected.id}</dd>
                <dt>Type</dt><dd>{selected.type}</dd>
                <dt>Trainer / Class</dt><dd>{selected.trainerOrClass}</dd>
                <dt>Specialty</dt><dd>{selected.specialty}</dd>
                <dt>Date</dt><dd>{selected.date}</dd>
                <dt>Time</dt><dd>{selected.time}</dd>
                <dt>Duration</dt><dd>{selected.duration}</dd>
                <dt>Full Name</dt><dd>{selected.fullName}</dd>
                <dt>Email</dt><dd>{selected.email}</dd>
                <dt>Phone</dt><dd>{selected.phone}</dd>
                <dt>Goals</dt><dd>{selected.goals}</dd>
                <dt>Notes</dt><dd>{selected.notes}</dd>
              </dl>
            </div>
          </div>
        </div>
      )}
    </div>
  );}
