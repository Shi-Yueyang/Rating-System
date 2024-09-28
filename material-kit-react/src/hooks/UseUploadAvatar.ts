import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

import { User } from '@/types/user';

// Custom hook for uploading user avatar
const useUploadUser = () => {
  return useMutation({
    mutationFn: ({ user, avatarFile }: { user: User|null; avatarFile: File | null }) => {
      const formData = new FormData();
      if(user){
        formData.append('username', user.username || '');
        formData.append('email', user.email || '');
      }
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }
      return axios
        .post('http://127.0.0.1:8000/rate/users/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((res) => res.data);
    },
    onError: (error) => {
      console.log(`Upload user failed, ${error}`);
    },
    onSuccess: (data) => {
      console.log('User uploaded successfully', data);
    },
  });
};

export default useUploadUser;
