import { useMutation, useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

export interface Activity {
  id?: number;
  name: string;
  dueDate: string;
}



interface Props {
  accessToken: string|null;
}

const endPoint = 'http://127.0.0.1:8000/rate/events/';

async function fetchActivities(): Promise<Activity[]> {
  const response = await axios.get(endPoint);
  return response.data;
}

export function useActivities() {
  return useQuery<Activity[], Error>({
    queryKey: ['activities'],
    queryFn: fetchActivities,
  });
}

export const useUpdateActivities = ({accessToken}:Props) =>{

  const headers: Record<string, string> = {
    'Content-Type': 'multipart/form-data',
  };
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  return useMutation({
    mutationFn:(activity:Activity) =>{
      return axios.post(endPoint,activity,headers)
    },
    onError:(error:AxiosError) =>{
      console.error("[useUpdateActivities onError]:", error.response?.data);
      throw error;
    }
  })
}