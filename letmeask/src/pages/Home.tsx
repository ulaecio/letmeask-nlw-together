import { FormEvent, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { database } from '../services/firebase';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/Button';
import { ToogleTheme } from '../components/ToogleTheme';

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import logoDarkImg from '../assets/images/logo-letmeask-dt.svg';
import googleIconImg from '../assets/images/google-icon.svg';

import '../styles/auth.scss';

export function Home(): JSX.Element {
  const history = useHistory();
  const { user, signInWithGoogle } = useAuth();
  const { theme } = useTheme();
  const [roomCode, setRoomCode] = useState('');

  function handleCodeInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const inputValue = e.target.value;
    const isUrl = inputValue.indexOf('/rooms/') !== -1;

    if (isUrl) {
      const { pathname } = new URL(inputValue);

      if (!pathname) {
        return setRoomCode(inputValue);
      }

      const codeStrippedFromPathname = pathname.split('/')[2];

      return setRoomCode(codeStrippedFromPathname);
    }

    return setRoomCode(inputValue);
  }

  async function handleCreateRoom() {
    if (!user) {
      await signInWithGoogle();
    }

    history.push('/rooms/new');
  }

  async function handleJoinRoom(e: FormEvent) {
    e.preventDefault();

    if (roomCode.trim() === '') {
      return;
    }

    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    if (!roomRef.exists()) {
      // eslint-disable-next-line no-alert
      alert('Room does not exists.');
      return;
    }

    if (roomRef.val().endedAt) {
      // eslint-disable-next-line no-alert
      alert('Room already closed.');
      return;
    }

    history.push(`/rooms/${roomCode}`);
  }

  return (
    <div className="page-auth">
      <aside>
        <img
          src={illustrationImg}
          alt="Ilustração simbolizando perguntas e respostas"
        />
        <div className="app-copy">
          <strong>Crie salas de Q&amp;A ao-vivo</strong>
          <p>Tire as dúvidas da sua audiência em tempo-real</p>
        </div>
      </aside>

      <main>
        <div className="main-content">
          {theme === 'light' ? (
            <img src={logoImg} alt="Letmeask" />
          ) : (
            <img src={logoDarkImg} alt="Letmeask" />
          )}

          <div className="app-copy">
            <strong>Crie salas de Q&amp;A ao-vivo</strong>
            <p>Tire as dúvidas da sua audiência em tempo-real</p>
          </div>

          <button
            className="create-room"
            onClick={handleCreateRoom}
            type="button"
          >
            <img src={googleIconImg} alt="Logo do Google" />
            Crie sua sala com o Google
          </button>

          <div className="separator">ou entre em uma sala</div>

          <form onSubmit={e => handleJoinRoom(e)}>
            <input
              type="text"
              placeholder="Digite o código da sala"
              onChange={e => handleCodeInputChange(e)}
              value={roomCode}
            />

            <Button type="submit">Entrar na sala</Button>
          </form>

          <footer>
            <ToogleTheme>Tema</ToogleTheme>
          </footer>
        </div>
      </main>
    </div>
  );
}
