import {
  FacebookIcon,
  LinkedinIcon,
  TwitterIcon,
  WhatsappIcon,
} from '../Icons';

import './styles.scss';

type Link = {
  baseLink: string;
  icon?: JSX.Element;
};

type SocialShareType = Record<string, Link>;

type SocialShareProps = {
  roomId: string;
  roomName: string;
};

const socialShareLinks: SocialShareType = {
  twitter: {
    baseLink: 'https://twitter.com/share?url=[post-url]&text=[post-title]',
    icon: TwitterIcon(),
  },
  whatsapp: {
    baseLink: 'https://api.whatsapp.com/send?text=[post-title] [post-url]',
    icon: WhatsappIcon(),
  },
  facebook: {
    baseLink: 'https://www.facebook.com/sharer.php?u=[post-url]',
    icon: FacebookIcon(),
  },
  linkedin: {
    baseLink:
      'https://www.linkedin.com/shareArticle?url=[post-url]&title=[post-title]',
    icon: LinkedinIcon(),
  },
};

export function SocialShare({
  roomId,
  roomName,
}: SocialShareProps): JSX.Element {
  const { origin } = window.location;
  const roomUrl = `${origin}/rooms/${roomId}`;
  const roomTitle = `Participe da sala ${roomName}`;

  function makeSocialUrl(link: string) {
    return link
      .replace('[post-url]', roomUrl)
      .replace('[post-title]', roomTitle);
  }

  return (
    <ul className="social-share">
      {Object.entries(socialShareLinks).map(
        ([socialLinkKey, { baseLink, icon }]) => {
          const uri = makeSocialUrl(baseLink);

          return (
            <li key={socialLinkKey}>
              <a target="_blank" href={uri} rel="noreferrer">
                {icon}
              </a>
            </li>
          );
        }
      )}
    </ul>
  );
}
