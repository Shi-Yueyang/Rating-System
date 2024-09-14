import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export interface Activity {
  id: number;
  name: string;
  dueDate: string;
}

async function fetchActivities(): Promise<Activity[]> {
  const response = await axios.get('http://127.0.0.1:8000/rate/events/');
  return response.data;
}

export function useActivities() {
  return useQuery<Activity[], Error>({
    queryKey: ['activities'],
    queryFn: fetchActivities,
  });
}
