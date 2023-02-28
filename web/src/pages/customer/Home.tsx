import { useState } from 'react';
import { useAuth } from '~/hooks';
import { Mood } from '~/models';
import { Header, Intro, Footer } from '~/components';

export function Home() {
  const { isAuth } = useAuth();
  const [state, setState] = useState({ mood: Mood[Mood.Happy] });

  return (
    <div className="home-page">
      <Header />
      <Intro />
      <Footer />
    </div>
  );
}
