import copyImg from '../assets/images/copy.svg';

import '../styles/room-code.scss';

type RoomCodeProps = {
  code: string;
};

export function RoomCode({ code }: RoomCodeProps): JSX.Element {
  const { origin } = window.location;

  function copyRoomCodeToClipboard() {
    navigator.clipboard.writeText(`${origin}/rooms/${code}`);
  }

  return (
    <button
      type="button"
      className="room-code"
      onClick={copyRoomCodeToClipboard}
    >
      <div>
        <img src={copyImg} alt="Copy room code" />
      </div>

      <span>Sala #{code}</span>
    </button>
  );
}
