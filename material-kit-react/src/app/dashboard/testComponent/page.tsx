"use client";
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import ActivityCard from '@/components/dashboard/assignments/ActivityCard';
import { Activity, useActivities } from '@/hooks/UseActivity';


const Page = () => {
  const {data:activities} = useActivities();
  return (
    <Stack spacing={3}>
      <Typography variant="h4">任务</Typography>
      <Grid container spacing={3}>

        {activities?.map((activity) => (
          <Grid key={activity.id} lg={4} md={6} xs={12}>
            <ActivityCard activity={activity}></ActivityCard>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
};

export default Page;
