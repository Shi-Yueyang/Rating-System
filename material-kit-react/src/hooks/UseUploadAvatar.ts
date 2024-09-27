import { User } from '@/types/user';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

// Custom hook for uploading user avatar
const useUploadUser = () => {
  return useMutation({
    mutationFn: (user: User|null) => axios.post('http://127.0.0.1:8000/rate/users', user).then((res) => res.data),
  });
};

export default useUploadUser;
