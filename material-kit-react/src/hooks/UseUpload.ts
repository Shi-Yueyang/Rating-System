import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

import { User } from '@/types/user';
import { useUser } from './use-user';

interface Props {
  accessToken?: string;
}

const useUploadUser = ({ accessToken }: Props) => {
  const {checkSession} = useUser();
  return useMutation({
    mutationFn: ({ user, avatarFile }: { user: User | null; avatarFile: File | null }) => {
      const formData = new FormData();
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }
      const headers: Record<string, string> = {
        'Content-Type': 'multipart/form-data',
      };

      if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
      }

      if (user) {
        formData.append('username', user.username || '');
        formData.append('email', user.email || '');
        const endPoint = `http://127.0.0.1:8000/rate/users/${user.id}/`;
        return axios.patch(endPoint, formData, { headers }).then((res) => res.data);
      } else {
        const endPoint = 'http://127.0.0.1:8000/rate/users/';
        return axios.post(endPoint, formData, { headers }).then((res) => res.data);
      }
    },
    onError: (error) => {
      if(checkSession) checkSession();
      console.log(`Upload user failed, ${error}`);
    },
    onSuccess: (data) => {
      if(checkSession) checkSession();
      console.log('User uploaded successfully', data);
    },
  });
};

export default useUploadUser;
