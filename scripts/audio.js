import { storage } from './db.js';

const context = new AudioContext();
const volumeNode = context.createGain();
volumeNode.gain.value = 0.5;
volumeNode.connect(context.destination);

async function createAudio(src) {
  let data = await storage(src);
  let file = null;

  if (data) {
    console.debug('Retrieving saved resource: %s', src);
    file = new File([data], src);
  } else {
    console.debug('Fetching remote resource: %s', src);
    const res = await fetch(src);
    const blob = await res.blob();
    file = new File([blob], src);
    storage(src, file);
  }

  data = await file.arrayBuffer();
  data = await context.decodeAudioData(data);

  if (context.state === 'suspended') {
    context.resume();
  }

  const source = context.createBufferSource();
  source.buffer = data;
  source.connect(volumeNode);
  source.loop = true;

  return source;
}

export const audio = {
  context,
  get: (...src) => Promise.all(src.map(createAudio)),
  volume: volumeNode.gain,
};
