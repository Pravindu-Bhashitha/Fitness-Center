import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const authKey = 'fitzone-admin-auth';
    const isLoginPage = router.pathname === '/login';
    const isAuthed = typeof window !== 'undefined' && localStorage.getItem(authKey) === 'true';

    if (!isAuthed && !isLoginPage) {
      router.replace('/login');
    }

    if (isAuthed && isLoginPage) {
      router.replace('/');
    }
  }, [router]);

  return <Component {...pageProps} />;
}
