import { FormEvent, useEffect, useMemo, useState, type ChangeEvent } from 'react';
import { useRouter } from 'next/router';

type ClassItem = {
  id: string;
  name: string;
  schedule: string;
  duration: string;
  capacity: string;
  level: string;
  description: string;
  icon: string;
  createdAt?: string;
  updatedAt?: string;
};

type ClassFormState = Omit<ClassItem, 'id' | 'createdAt' | 'updatedAt'>;

const emptyForm: ClassFormState = {
  name: '',
  schedule: '',
  duration: '',
  capacity: '',
  level: '',
  description: '',
  icon: '🏋️',
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';

export default function AdminClassesPage() {
  const router = useRouter();
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState<ClassItem | null>(null);
  const [form, setForm] = useState<ClassFormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [mode, setMode] = useState<'create' | 'edit'>('create');

  const loadClasses = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/api/classes`);
      const data = await response.json();
      setClasses(data.classes ?? []);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : 'Failed to load classes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClasses();
  }, []);

  const sortedClasses = useMemo(
    () => classes.slice().sort((a, b) => a.name.localeCompare(b.name)),
    [classes],
  );

  function resetForm() {
    setForm(emptyForm);
    setSelected(null);
    setMode('create');
  }

  function handleLogout() {
    localStorage.removeItem('fitzone-admin-auth');
    router.replace('/login');
  }

  function openCreate() {
    resetForm();
    setMode('create');
  }

  function openEdit(classItem: ClassItem) {
    setSelected(classItem);
    setMode('edit');
    setForm({
      name: classItem.name,
      schedule: classItem.schedule,
      duration: classItem.duration,
      capacity: classItem.capacity,
      level: classItem.level,
      description: classItem.description,
      icon: classItem.icon,
    });
  }

  function onChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError('');

    try {
      const response = await fetch(
        mode === 'create' ? `${API_BASE_URL}/api/classes` : `${API_BASE_URL}/api/classes/${selected?.id}`,
        {
          method: mode === 'create' ? 'POST' : 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        },
      );

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.message ?? 'Failed to save class');
      }

      await loadClasses();
      resetForm();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Failed to save class');
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteId) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/classes/${deleteId}`, { method: 'DELETE' });
      if (!response.ok && response.status !== 204) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.message ?? 'Failed to delete class');
      }

      setDeleteId(null);
      await loadClasses();
      if (selected?.id === deleteId) {
        resetForm();
      }
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Failed to delete class');
    }
  }

  return (
    <div className="admin-container">
      <div className="admin-hero">
        <div>
          <h1 className="admin-header">Class Management</h1>
          <p className="admin-sub">Add, edit, and delete class profiles</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn" onClick={openCreate}>+ Add Class</button>
          <button className="btn" onClick={handleLogout}>Log out</button>
        </div>
      </div>

      <section className="admin-shortcuts">
        <div className="shortcut-card shortcut-card--highlight">
          <div>
            <p className="shortcut-label">Quick Access</p>
            <h2>Manage classes</h2>
            <p>Add, edit, or delete class details from one place.</p>
          </div>
          <button className="btn btn-primary shortcut-action" onClick={openCreate}>
            Create New Class
          </button>
        </div>

        <div className="shortcut-card">
          <p className="shortcut-label">Overview</p>
          <div className="shortcut-stats">
            <div>
              <span>{classes.length}</span>
              <p>Classes</p>
            </div>
            <div>
              <span>6</span>
              <p>Seeded</p>
            </div>
          </div>
        </div>
      </section>

      <div className="controls">
        <button className="btn" onClick={() => router.push('/')}>Back to bookings</button>
      </div>

      {loading ? <div className="fz-empty">Loading classes...</div> : null}
      {error ? <div className="fz-empty" style={{ color: 'red' }}>{error}</div> : null}

      {!loading && !error && (
        <div className="trainer-grid">
          <section className="trainer-panel">
            <h2>{mode === 'create' ? 'Create class' : 'Edit class'}</h2>
            <form className="trainer-form" onSubmit={handleSubmit}>
              <label className="field">
                <span>Name</span>
                <input className="input" name="name" value={form.name} onChange={onChange} required />
              </label>
              <label className="field">
                <span>Schedule</span>
                <input className="input" name="schedule" value={form.schedule} onChange={onChange} required />
              </label>
              <label className="field">
                <span>Duration</span>
                <input className="input" name="duration" value={form.duration} onChange={onChange} required />
              </label>
              <label className="field">
                <span>Capacity</span>
                <input className="input" name="capacity" value={form.capacity} onChange={onChange} required />
              </label>
              <label className="field">
                <span>Level</span>
                <input className="input" name="level" value={form.level} onChange={onChange} required />
              </label>
              <label className="field">
                <span>Icon</span>
                <input className="input" name="icon" value={form.icon} onChange={onChange} maxLength={4} required />
              </label>
              <label className="field">
                <span>Description</span>
                <textarea className="input" name="description" value={form.description} onChange={onChange} rows={5} required />
              </label>

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button className="btn btn-primary" type="submit" disabled={saving}>
                  {saving ? 'Saving...' : mode === 'create' ? 'Create class' : 'Save changes'}
                </button>
                {selected ? (
                  <button className="btn" type="button" onClick={resetForm}>Cancel edit</button>
                ) : null}
              </div>
            </form>
          </section>

          <section className="trainer-panel">
            <h2>Current classes</h2>
            <div className="trainer-list">
              {sortedClasses.map((classItem) => (
                <article key={classItem.id} className="trainer-card">
                  <div className="trainer-card__top">
                    <div className="trainer-avatar">{classItem.icon}</div>
                    <div>
                      <h3>{classItem.name}</h3>
                      <p>{classItem.schedule}</p>
                    </div>
                  </div>
                  <p className="trainer-meta"><strong>Duration:</strong> {classItem.duration}</p>
                  <p className="trainer-meta"><strong>Capacity:</strong> {classItem.capacity}</p>
                  <p className="trainer-meta"><strong>Level:</strong> {classItem.level}</p>
                  <p className="trainer-bio">{classItem.description}</p>

                  <div className="trainer-actions">
                    <button className="btn" type="button" onClick={() => openEdit(classItem)}>Edit</button>
                    <button className="btn btn-danger" type="button" onClick={() => setDeleteId(classItem.id)}>Delete</button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      )}

      {deleteId ? (
        <div className="fz-modal" onClick={() => setDeleteId(null)}>
          <div className="fz-modal-content" onClick={(event) => event.stopPropagation()}>
            <h2 style={{ marginTop: 0 }}>Delete class?</h2>
            <p>This will permanently remove the class profile.</p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button className="btn" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
