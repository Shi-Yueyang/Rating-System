'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@mui/material';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';

import { paths } from '@/paths';
import { Activity, UseApiResources } from '@/hooks/UseApiResource';
import ActivityCard from '@/components/dashboard/assignments/ActivityCard';
import { baseURL } from '@/config';

const ActivityPage = () => {
  const accessToken = localStorage.getItem('custom-auth-token');
  const { useFetchResources: useActivities } = UseApiResources<Activity>({
    endPoint: `${baseURL}/rate/events/`,
    accessToken,
    queryKey: ['activities'],
  });
  const { data: activities } = useActivities();
  const router = useRouter();
  const handleCreateAssignment = () => {
    router.push(paths.createEvent); // Navigate to the page where new assignments can be created
  };

  return (
    <Stack spacing={3}>
      <Grid container spacing={3}>
        {activities?.map((activity) => (
          <Grid key={activity.id} lg={4} md={6} xs={12}>
            <ActivityCard
              activity={activity}
              onClick={() => {
                router.push(paths.eventDetails + activity.id);
              }}
            ></ActivityCard>
          </Grid>
        ))}
      </Grid>
      {/* new activity */}
      <Button variant="outlined" onClick={handleCreateAssignment}>
        新建活动
      </Button>
    </Stack>
  );
};

export default ActivityPage;
