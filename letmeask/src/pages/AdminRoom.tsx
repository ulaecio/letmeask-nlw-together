import { Link, useHistory, useParams } from 'react-router-dom';

import { database } from '../services/firebase';
import { useTheme } from '../hooks/useTheme';
import { useRoom } from '../hooks/useRoom';
import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { Question } from '../components/Question';
import { ToogleTheme } from '../components/ToogleTheme';

import logoImg from '../assets/images/logo.svg';
import logoDarkImg from '../assets/images/logo-letmeask-dt.svg';
import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';
import emptyQuestions from '../assets/images/empty-questions.svg';

import '../styles/room.scss';
import { SocialShare } from '../components/SocialShare';

type RoomParams = {
  id: string;
};

export function AdminRoom(): JSX.Element {
  const history = useHistory();
  const params = useParams<RoomParams>();
  const { theme } = useTheme();

  const roomId = params.id;
  const { title, questions } = useRoom(roomId);

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    });

    history.push('/');
  }

  async function handleDeleteQuestion(questionId: string) {
    // eslint-disable-next-line no-alert
    if (window.confirm('Tem certeza que deseja excluir esta pergunta?')) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  }

  async function handleCheckQuestionAsAnswered(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true,
    });
  }

  async function handleHighlightQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: true,
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

            <Button onClick={handleEndRoom} isOutlined>
              Encerrar sala
            </Button>

            <ToogleTheme />
          </div>
        </div>
      </header>

      <main className={`${questions.length > 0 ? '' : 'main--is-empty'}`}>
        <div className="room-title">
          <h1>Sala {title}</h1>

          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        {questions.length > 0 ? (
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
                  <>
                    <button
                      type="button"
                      onClick={() => handleCheckQuestionAsAnswered(question.id)}
                    >
                      <img
                        src={checkImg}
                        alt="Marcar pergunta como respondida"
                      />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleHighlightQuestion(question.id)}
                    >
                      <img src={answerImg} alt="Dar destaque a pergunta" />
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  <img src={deleteImg} alt="Remover pergunta" />
                </button>
              </Question>
            ))}
          </div>
        ) : (
          <div className="question-list question-empty">
            <>
              <img src={emptyQuestions} alt="Sem perguntas ainda" />
              <h3>Nenhuma pergunta por aqui</h3>
              <p>
                Envie o código desta sala para seus amigos e comece a responder
                perguntas!
              </p>
              <footer>
                <SocialShare roomId={roomId} roomName={title} />
              </footer>
            </>
          </div>
        )}
      </main>
    </div>
  );
}
