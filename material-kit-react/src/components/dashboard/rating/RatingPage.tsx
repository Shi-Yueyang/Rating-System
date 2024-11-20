'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Grid, Stack, Typography } from '@mui/material';

import { User } from '@/types/user';
import { paths } from '@/paths';
import { useUser } from '@/hooks/use-user';
import { Activity, UseApiResources } from '@/hooks/UseApiResource';

import ActivityCard from '../assignments/ActivityCard';
import { baseURL } from '@/config';

const RatingPage = () => {
  const accessToken = localStorage.getItem('custom-auth-token');
  const { user } = useUser();

  const { useFetchResources: useActivities } = UseApiResources<Activity>({
    endPoint: `${baseURL}/rate/events/`,
    accessToken,
    queryKey: ['activityuser'],
  });

  const { data: activities } = useActivities({ user_id: user?.id });
  const router = useRouter();

  return (
    <Stack spacing={3}>
      <Grid container spacing={3}>
        {activities?.map((activity) => (
          <Grid key={activity.id} lg={4} md={6} xs={12}>
            <ActivityCard
              activity={activity}
              onClick={() => {
                router.push(paths.ratingTasks + activity.id);
              }}
            ></ActivityCard>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
};

export default RatingPage;
