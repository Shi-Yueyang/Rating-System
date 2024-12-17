'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Grid, Stack } from '@mui/material';

import { paths } from '@/paths';
import { useUser } from '@/hooks/use-user';
import { Activity, UseApiResources } from '@/hooks/UseApiResource';

import { backendURL } from '@/config';
import RatingCard from './RatingCard';

const RatingPage = () => {
  const accessToken = localStorage.getItem('custom-auth-token');
  const { user } = useUser();

  const { useFetchResources: useActivities } = UseApiResources<Activity>({
    endPoint: `${backendURL}/rate/events/`,
    accessToken,
    queryKey: ['activities',user?.id.toString()||''],
  });

  const { data: activities } = useActivities({ user_id: user?.id });
  const router = useRouter();

  return (
    <Stack spacing={3}>
      <Grid container spacing={3} >
        {activities?.map((activity) => (
          <Grid key={activity.id} lg={4} md={6} xs={12} padding={2}>
            <RatingCard
              activity={activity}
              handleClickView={() => {
                router.push(paths.dashboard.rating.tasks+'/' + activity.id?.toString());
              }}
            ></RatingCard>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
};

export default RatingPage;
