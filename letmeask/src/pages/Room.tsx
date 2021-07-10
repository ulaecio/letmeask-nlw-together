import { useParams, Link } from 'react-router-dom';
import { FormEvent, useState } from 'react';

import { database } from '../services/firebase';
import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';
import { useTheme } from '../hooks/useTheme';
import { ToogleTheme } from '../components/ToogleTheme';
import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { Question } from '../components/Question';
import { SocialShare } from '../components/SocialShare';

import logoImg from '../assets/images/logo.svg';
import logoDarkImg from '../assets/images/logo-letmeask-dt.svg';

import '../styles/room.scss';

type RoomParams = {
  id: string;
};

export function Room(): JSX.Element {
  const { user } = useAuth();
  const { theme } = useTheme();
  const params = useParams<RoomParams>();
  const [newQuestion, setNewQuestion] = useState('');

  const roomId = params.id;
  const { title, questions } = useRoom(roomId);

  async function handleSendQuestion(e: FormEvent) {
    e.preventDefault();

    if (newQuestion.trim() === '') {
      return;
    }

    if (!user) {
      throw new Error('You must be logged in');
    }

    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar,
      },
      isHighlighted: false,
      isAnswered: false,
    };

    await database.ref(`rooms/${roomId}/questions`).push(question);

    setNewQuestion('');
  }

  async function handleLikeQuestion(
    questionId: string,
    likeId: string | undefined
  ) {
    if (likeId) {
      await database
        .ref(`rooms/${roomId}/questions/${questionId}/likes/${likeId}`)
        .remove();
      return;
    }

    await database.ref(`rooms/${roomId}/questions/${questionId}/likes`).push({
      authorId: user?.id,
    });
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <Link to="/">
            {theme === 'light' ? (
              <img src={logoImg} alt="Letmeask" />
            ) : (
              <img src={logoDarkImg} alt="Letmeask" />
            )}
          </Link>

          <div>
            <RoomCode code={roomId} />
            <ToogleTheme />
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>

          {questions.length > 0 && (
            <div>
              <span>{questions.length} pergunta(s)</span>
              <SocialShare roomId={roomId} roomName={title} />
            </div>
          )}
        </div>

        <form onSubmit={handleSendQuestion}>
          <textarea
            placeholder="O que você quer perguntar?"
            onChange={e => setNewQuestion(e.target.value)}
            value={newQuestion}
          />

          <div className="form-footer">
            {user ? (
              <div className="user-info">
                <img src={user.avatar} alt={user.name} />
                <span>{user.name}</span>
              </div>
            ) : (
              <span>
                Para enviar uma pergunta,{' '}
                <button type="button">faça seu login.</button>
              </span>
            )}

            <Button disabled={!user} type="submit">
              Enviar pergunta
            </Button>
          </div>
        </form>

        <div className="question-list">
          {questions.map(question => (
            <Question
              key={question.id}
              content={question.content}
              author={question.author}
              isAnswered={question.isAnswered}
              isHighlighted={question.isHighlighted}
            >
              {!question.isAnswered && (
                <button
                  className={`like-button ${question.likeId ? 'liked' : ''}`}
                  type="button"
                  aria-label="Marcar como gostei"
                  onClick={() =>
                    handleLikeQuestion(question.id, question.likeId)
                  }
                >
                  {question.likeCount > 0 && <span>{question.likeCount}</span>}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="#737380"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3m7-2V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a1.999 1.999 0 00-2-2.3H14z"
                    />
                  </svg>
                </button>
              )}
            </Question>
          ))}
        </div>
      </main>
    </div>
  );
}
