import { Link, useHistory } from 'react-router-dom';
import { useState, FormEvent } from 'react';

import { database } from '../services/firebase';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { Button } from '../components/Button';
import { ToogleTheme } from '../components/ToogleTheme';

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import logoDarkImg from '../assets/images/logo-letmeask-dt.svg';

import '../styles/auth.scss';

export function NewRoom(): JSX.Element {
  const history = useHistory();
  const { theme } = useTheme();
  const { user } = useAuth();
  const [newRoomName, setNewRoomName] = useState('');

  async function handleCreatRoom(e: FormEvent) {
    e.preventDefault();

    if (newRoomName.trim() === '') {
      return;
    }

    const roomRef = database.ref('rooms');

    const firebaseRoom = await roomRef.push({
      title: newRoomName,
      authorId: user?.id,
    });

    history.push(`/admin/rooms/${firebaseRoom.key}`);
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

          <h2>Criar uma nova sala</h2>

          <form onSubmit={e => handleCreatRoom(e)}>
            <input
              type="text"
              placeholder="Nome da sala"
              onChange={e => setNewRoomName(e.target.value)}
              value={newRoomName}
            />

            <Button type="submit">Criar sala</Button>
          </form>

          <p>
            Quer entrar em uma sala existente? <Link to="/">Clique aqui</Link>.
          </p>

          <footer>
            <ToogleTheme>Tema</ToogleTheme>
          </footer>
        </div>
      </main>
    </div>
  );
}
