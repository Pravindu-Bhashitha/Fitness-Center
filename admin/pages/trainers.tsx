import { FormEvent, useEffect, useMemo, useState, type ChangeEvent } from 'react';
import { useRouter } from 'next/router';

type Trainer = {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  certifications: string;
  bio: string;
  avatar: string;
  createdAt?: string;
  updatedAt?: string;
};

type TrainerFormState = Omit<Trainer, 'id' | 'createdAt' | 'updatedAt'>;

const emptyForm: TrainerFormState = {
  name: '',
  specialty: '',
  experience: '',
  certifications: '',
  bio: '',
  avatar: '👤',
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';

export default function AdminTrainersPage() {
  const router = useRouter();
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState<Trainer | null>(null);
  const [form, setForm] = useState<TrainerFormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [mode, setMode] = useState<'create' | 'edit'>('create');

  const loadTrainers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/api/trainers`);
      const data = await response.json();
      setTrainers(data.trainers ?? []);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : 'Failed to load trainers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrainers();
  }, []);

  const sortedTrainers = useMemo(
    () => trainers.slice().sort((a, b) => a.name.localeCompare(b.name)),
    [trainers],
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

  function openEdit(trainer: Trainer) {
    setSelected(trainer);
    setMode('edit');
    setForm({
      name: trainer.name,
      specialty: trainer.specialty,
      experience: trainer.experience,
      certifications: trainer.certifications,
      bio: trainer.bio,
      avatar: trainer.avatar,
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
        mode === 'create' ? `${API_BASE_URL}/api/trainers` : `${API_BASE_URL}/api/trainers/${selected?.id}`,
        {
          method: mode === 'create' ? 'POST' : 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        },
      );

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.message ?? 'Failed to save trainer');
      }

      await loadTrainers();
      resetForm();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Failed to save trainer');
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteId) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/trainers/${deleteId}`, { method: 'DELETE' });
      if (!response.ok && response.status !== 204) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.message ?? 'Failed to delete trainer');
      }

      setDeleteId(null);
      await loadTrainers();
      if (selected?.id === deleteId) {
        resetForm();
      }
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Failed to delete trainer');
    }
  }

  return (
    <div className="admin-container">
      <div className="admin-hero">
        <div>
          <h1 className="admin-header">Trainer Management</h1>
          <p className="admin-sub">Add, edit, and delete trainer profiles</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn" onClick={openCreate}>+ Add Trainer</button>
          <button className="btn" onClick={handleLogout}>Log out</button>
        </div>
      </div>

      <div className="controls">
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={openCreate}>New Trainer</button>
          <button className="btn" onClick={() => router.push('/')}>Back to bookings</button>
        </div>
      </div>

      {loading ? <div className="fz-empty">Loading trainers...</div> : null}
      {error ? <div className="fz-empty" style={{ color: 'red' }}>{error}</div> : null}

      {!loading && !error && (
        <div className="trainer-grid">
          <section className="trainer-panel">
            <h2>{mode === 'create' ? 'Create trainer' : 'Edit trainer'}</h2>
            <form className="trainer-form" onSubmit={handleSubmit}>
              <label className="field">
                <span>Name</span>
                <input className="input" name="name" value={form.name} onChange={onChange} required />
              </label>
              <label className="field">
                <span>Specialty</span>
                <input className="input" name="specialty" value={form.specialty} onChange={onChange} required />
              </label>
              <label className="field">
                <span>Experience</span>
                <input className="input" name="experience" value={form.experience} onChange={onChange} required />
              </label>
              <label className="field">
                <span>Certifications</span>
                <input className="input" name="certifications" value={form.certifications} onChange={onChange} required />
              </label>
              <label className="field">
                <span>Avatar</span>
                <input className="input" name="avatar" value={form.avatar} onChange={onChange} maxLength={4} required />
              </label>
              <label className="field">
                <span>Bio</span>
                <textarea className="input" name="bio" value={form.bio} onChange={onChange} rows={5} required />
              </label>

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button className="btn btn-primary" type="submit" disabled={saving}>
                  {saving ? 'Saving...' : mode === 'create' ? 'Create trainer' : 'Save changes'}
                </button>
                {selected ? (
                  <button className="btn" type="button" onClick={resetForm}>Cancel edit</button>
                ) : null}
              </div>
            </form>
          </section>

          <section className="trainer-panel">
            <h2>Current trainers</h2>
            <div className="trainer-list">
              {sortedTrainers.map((trainer) => (
                <article key={trainer.id} className="trainer-card">
                  <div className="trainer-card__top">
                    <div className="trainer-avatar">{trainer.avatar}</div>
                    <div>
                      <h3>{trainer.name}</h3>
                      <p>{trainer.specialty}</p>
                    </div>
                  </div>
                  <p className="trainer-meta"><strong>Experience:</strong> {trainer.experience}</p>
                  <p className="trainer-meta"><strong>Certifications:</strong> {trainer.certifications}</p>
                  <p className="trainer-bio">{trainer.bio}</p>

                  <div className="trainer-actions">
                    <button className="btn" onClick={() => openEdit(trainer)}>Edit</button>
                    <button className="btn btn-danger" type="button" onClick={() => setDeleteId(trainer.id)}>Delete</button>
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
            <h2 style={{ marginTop: 0 }}>Delete trainer?</h2>
            <p>This will permanently remove the trainer profile.</p>
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
