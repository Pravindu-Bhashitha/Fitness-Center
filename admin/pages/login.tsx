import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'fitzone123';
const AUTH_KEY = 'fitzone-admin-auth';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem(AUTH_KEY) === 'true') {
      router.replace('/');
    }
  }, [router]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    const normalizedUser = username.trim().toLowerCase();
    const normalizedPassword = password.trim();

    setTimeout(() => {
      if (normalizedUser === ADMIN_USERNAME && normalizedPassword === ADMIN_PASSWORD) {
        localStorage.setItem(AUTH_KEY, 'true');
        router.replace('/');
      } else {
        setError('Invalid username or password');
        setIsLoading(false);
      }
    }, 300);
  }

  return (
    <main className="login-shell">
      <section className="login-card">
        <div className="login-badge">FitZone Admin</div>
        <h1 className="login-title">Sign in to manage bookings</h1>
        <p className="login-copy">Secure access for the fitness center staff dashboard.</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Username</span>
            <input
              className="input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              autoComplete="username"
            />
          </label>

          <label className="field">
            <span>Password</span>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </label>

          {error ? <div className="login-error">{error}</div> : null}

          <button className="btn btn-primary login-btn" type="submit" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="login-footnote">
          Default credentials: <strong>admin</strong> / <strong>fitzone123</strong>
        </p>
      </section>
    </main>
  );
}
