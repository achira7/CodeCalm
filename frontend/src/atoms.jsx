// src/atoms.js
import { atom } from 'recoil';

const localStorageEffect = (key) => ({ setSelf, onSet }) => {
  const savedValue = localStorage.getItem(key);
  if (savedValue != null) {
    setSelf(JSON.parse(savedValue));
  }

  onSet((newValue) => {
    localStorage.setItem(key, JSON.stringify(newValue));
  });
};

export const userIdAtom = atom({
  key: 'userIdAtom',
  default: null,
  effects_UNSTABLE: [localStorageEffect('userId')],
});

/*export const userIdAtom = atom({
  key: 'userIdAtom',
  default: '',
});*/

export const userFirstNameAtom = atom({
  key: 'userFirstNameAtom',
  default: '',
});

export const userLastNameAtom = atom({
  key: 'userLastNameAtom',
  default: '',
});

export const userEmailAtom = atom({
  key: 'serEmailAtom',
  default: '',
});

export const userIsStaffAtom = atom({
  key: 'isStaffAtom',
  default: false,
});

export const userIsSuperuserAtom = atom({
  key: 'isSuperuserAtom',
  default: false,
});

export const userProfilePictureAtom = atom({
  key: 'userProfilePictureAtom',
  default: 'http://127.0.0.1:8000/media/profilePictures/default.jpg',
});

export const mediaRootAtom = atom({
  key: 'mediaRootAtom',
  default: 'http://127.0.0.1:8000/media/',
});

