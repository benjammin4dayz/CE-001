import { download } from './util.js';

const iv = new Uint8Array([
  108, 92, 127, 59, 208, 103, 42, 6, 31, 111, 209, 76,
]); // 96 bytes

async function encryptText(plaintext) {
  const key = await window.crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256,
    },
    true,
    ['encrypt', 'decrypt']
  );

  const plaintextBytes = new TextEncoder().encode(plaintext);

  const ciphertext = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    key,
    plaintextBytes
  );

  return {
    ciphertext: new Uint8Array(ciphertext),
    key: await window.crypto.subtle.exportKey('jwk', key),
  };
}

async function decryptText(ciphertext, key) {
  const importedKey = await window.crypto.subtle.importKey(
    'jwk',
    key,
    {
      name: 'AES-GCM',
      length: 256,
    },
    true,
    ['encrypt', 'decrypt']
  );

  const plaintextBytes = await window.crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    importedKey,
    ciphertext
  );

  const plaintext = new TextDecoder().decode(plaintextBytes);

  return plaintext;
}

export async function encrypt(plaintext) {
  const cryptic = await encryptText(plaintext);
  download(cryptic.ciphertext, 'data.bin', 'application/octet-binary');
  download(JSON.stringify(cryptic.key), 'key.jwk', 'application/json');
}

export async function decrypt(keyURL, binURL) {
  const key = await fetch(keyURL).then(res => res.json());
  const ciphertext = await fetch(binURL).then(res => res.arrayBuffer());
  const decrypted = await decryptText(ciphertext, key);

  let data;

  try {
    data = JSON.parse(decrypted);
  } catch (e) {
    data = decrypted;
  }

  return data;
}
