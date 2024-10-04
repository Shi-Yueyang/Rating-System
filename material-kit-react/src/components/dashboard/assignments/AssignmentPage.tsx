"use client";
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import ActivityCard from '@/components/dashboard/assignments/ActivityCard';
import { Activity, useActivities } from '@/hooks/UseActivity';
import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import { paths } from '@/paths';

const AssignmentPage = () => {
    const {data:activities} = useActivities();
    const router = useRouter(); 
    const handleCreateAssignment = () => {
      router.push(paths.createEvent);  // Navigate to the page where new assignments can be created
    };
    return (
      <Stack spacing={3}>
        <Button
          variant="contained"
          onClick={handleCreateAssignment}
        >
          创建新活动
        </Button>
  
        <Grid container spacing={3}>
  
          {activities?.map((activity) => (
            <Grid key={activity.id} lg={4} md={6} xs={12}>
              <ActivityCard activity={activity}></ActivityCard>
            </Grid>
          ))}
  
        </Grid>
      </Stack>
    );
}

export default AssignmentPage