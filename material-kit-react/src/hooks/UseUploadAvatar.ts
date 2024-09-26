import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

// Custom hook for uploading user avatar
const useUploadAvatar = () => {
  return useMutation({
    mutationFn: (file: File) => axios.post('http://127.0.0.1:8000/rate/users', file).then((res) => res.data),
  });
};

export default useUploadAvatar;
