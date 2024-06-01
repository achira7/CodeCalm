import {atom} from recoil

export const userProfilePictureState = atom ({
    key: 'profile_picture',
    default: 'http://127.0.0.1:8000/media/profilePictures/default.jpg'
})