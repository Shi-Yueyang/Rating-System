'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@mui/material';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';

import { paths } from '@/paths';
import { Activity, UseApiResources } from '@/hooks/UseApiResource';
import ActivityCard from '@/components/dashboard/assignments/ActivityCard';

const AssignmentPage = () => {
  const accessToken = localStorage.getItem('custom-auth-token');

  const { useFetchResources: useActivities } = UseApiResources<Activity>({
    endPoint: 'http://127.0.0.1:8000/rate/events/',
    accessToken,
    queryKey: ['activity'],
  });
  const { data: activities } = useActivities();
  const router = useRouter();
  const handleCreateAssignment = () => {
    router.push(paths.createEvent); // Navigate to the page where new assignments can be created
  };
  return (
    <Stack spacing={3}>
      {/* old activities */}
      <Grid container spacing={3}>
        {activities?.map((activity) => (
          <Grid key={activity.id} lg={4} md={6} xs={12}>
            <ActivityCard activity={activity}></ActivityCard>
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

export default AssignmentPage;
