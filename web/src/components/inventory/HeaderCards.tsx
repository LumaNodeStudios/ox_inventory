import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../store';
import { selectPlayer } from '../../store/player';
import { imagepath } from '../../store/imagepath';

interface DynamicHeaderIconProps {
  name?: string;
  fallback: string;
  alt: string;
}

export const DynamicHeaderIcon: React.FC<DynamicHeaderIconProps> = ({ name, fallback, alt }) => {
  const cleanName = name ? name.toLowerCase().trim() : '';
  const isNoGroup = !cleanName || 
                    cleanName === 'unemployed' || 
                    cleanName === 'none' || 
                    cleanName === 'no gang' || 
                    cleanName === 'nogang' ||
                    cleanName === 'nogroup';

  const [attempt, setAttempt] = useState<number>(isNoGroup ? 2 : 0);
  const [src, setSrc] = useState<string>(
    isNoGroup ? `${imagepath}/${fallback}.webp` : `${imagepath}/${cleanName}.webp`
  );

  useEffect(() => {
    if (!isNoGroup) {
      setSrc(`${imagepath}/${cleanName}.webp`);
      setAttempt(0);
    } else {
      setSrc(`${imagepath}/${fallback}.webp`);
      setAttempt(2);
    }
  }, [cleanName, fallback, isNoGroup]);

  const handleError = () => {
    if (attempt === 0) {
      setSrc(`${imagepath}/${cleanName}.png`);
      setAttempt(1);
    } else if (attempt === 1) {
      setSrc(`${imagepath}/${fallback}.webp`);
      setAttempt(2);
    } else if (attempt === 2) {
      setSrc(`${imagepath}/${fallback}.png`);
      setAttempt(3);
    }
  };

  return (
    <img
      src={src}
      onError={handleError}
      alt={alt}
    />
  );
};

export const LeftHeaderCards: React.FC = () => {
  const player = useAppSelector(selectPlayer);

  return (
    <div className="header-cards">
      <div className="header-card">
        <div className="card-icon">
          <img src={`${imagepath}/user.webp`} alt="user" />
        </div>
        <div className="card-content">
          <p className="card-title">{player.name}</p>
          <p className="card-subtitle">Bank: {player.bank}</p>
        </div>
      </div>

      <div className="header-card">
        <div className="card-icon">
          <img
            src={(() => {
              const hour = parseInt(player.time.split(':')[0]);
              const validHour = isNaN(hour) ? 12 : hour;
              return validHour >= 20 || validHour < 6 ? `${imagepath}/moon.webp` : `${imagepath}/sun.webp`;
            })()}
            alt="weather"
          />
        </div>
        <div className="card-content">
          <p className="card-title">{player.day} | {player.month}</p>
          <p className="card-subtitle">{player.time}</p>
        </div>
      </div>
    </div>
  );
};

export const RightHeaderCards: React.FC = () => {
  const player = useAppSelector(selectPlayer);

  return (
    <div className="header-cards">
      <div className="header-card">
        <div className="card-icon">
          <DynamicHeaderIcon name={player.jobName} fallback="jobngang" alt="job" />
        </div>
        <div className="card-content">
          <p className="card-title-centered">{player.job}</p>
        </div>
      </div>

      <div className="header-card">
        <div className="card-icon">
          <DynamicHeaderIcon name={player.gangName} fallback="jobngang" alt="gang" />
        </div>
        <div className="card-content">
          <p className="card-title-centered">{player.gang}</p>
        </div>
      </div>
    </div>
  );
};
