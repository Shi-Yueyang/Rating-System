'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { Button, Card, CardContent, CardHeader, Grid, InputLabel, TextField, Typography } from '@mui/material';
import {  useRouter } from 'next/navigation';
import { useUser } from '@/hooks/use-user';
import { Aspect, UseApiResources } from '@/hooks/UseApiResource';

interface UserResource {
  id:number;
  user: number;
  resource: number;
  score: number;
}

const RatingDetails = () => {
  const accessToken = localStorage.getItem('custom-auth-token');
  const { useFetchResources: fetchAspects } = UseApiResources<Aspect>({
    endPoint: 'http://127.0.0.1:8000/rate/aspects/',
    queryKey: ['aspects'],
    accessToken,
  });
  const { event_id, userResource_id } = useParams();
  
  const { useFetchSingleResource: useFetchUserResource } = UseApiResources<UserResource>({
    endPoint: 'http://127.0.0.1:8000/rate/user-resource/'+userResource_id,
    queryKey: ['userscoreupload'],
    accessToken,
  });
  
  const { user } = useUser();
  const [score, setScore] = useState(0);
  const { data: aspects } = fetchAspects({ event_id: event_id });
  
  const { data: userResources } = useFetchUserResource({ user_id: user?.id, id: userResource_id });
  console.log(userResources);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // mutateUserResources({ event: event_id, score });
  };
  return (
    <form onSubmit={handleSubmit}>
        <Grid item md={6} xs={12} >
          <Card>
            <CardContent>
              <Grid container spacing={3}>
                {aspects?.map((aspect, index) => (
                  <Grid item md={6} xs={12} key={index}>
                    <InputLabel>{aspect.name}</InputLabel>
                    <TextField type="number" inputProps={{ min: 0, max: aspect.percentage }} fullWidth />
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      <Button type="submit" variant="outlined" color="primary" style={{ marginTop: '16px' }}>
        提交
      </Button>
    </form>
  );
};

export default RatingDetails;
