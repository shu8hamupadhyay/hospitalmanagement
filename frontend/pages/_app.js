import '../styles/globals.css';
import { useEffect } from 'react';
import Router from 'next/router';

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}
