import { audio } from './audio.js';
import * as cryptic from './cryptic.js';
import { ExpressionGenerator } from './expression.js';

(async () => {
  const container = document.getElementById('sottoVoce');

  const button = document.createElement('button');
  Object.assign(button, {
    className: 'uncial-antiqua-regular',
    disabled: true,
    id: 'listen',
    textContent: 'Loading...',
  });
  container.appendChild(button);

  const expression = new ExpressionGenerator(
    await cryptic.decrypt('assets/key.jwk', 'assets/data.bin')
  );
  const getExpression = () => expression.get().html;

  // disable button until the audio is loaded, lest unyielding silence
  const [fx, music] = await audio.get(
    'https://cdn.pixabay.com/download/audio/2021/08/03/audio_d9d49e5f71.mp3?filename=sea-and-seagull-wave-5932.mp3',
    'https://cdn.pixabay.com/download/audio/2022/05/30/audio_274983e71c.mp3?filename=tranquilness-ambient-healing-music-meditation-yoga-zen-112329.mp3'
  );

  button.textContent = 'Listen?';
  button.disabled = false;

  button.addEventListener(
    'click',
    () => {
      setInterval(() => {
        container.innerHTML = getExpression();
      }, 3e4);

      container.innerHTML = getExpression();
      [fx, music].forEach(s => s.start(0));
    },
    { once: true }
  );

  window.cryptic = window.location.hash === '#fear' ? cryptic : {};
})();
