'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button, Card, CardContent, CardHeader, Grid, InputLabel, TextField, Typography } from '@mui/material';
import { baseURL } from '@/config';
import { useUser } from '@/hooks/use-user';
import { Aspect, UseApiResources } from '@/hooks/UseApiResource';

interface UserResource {
  id: number;
  user: number;
  resource: number;
  score: number;
}

interface RatingScore {
  aspectId: number;
  score: number;
}

const RatingDetails = () => {
  const accessToken = localStorage.getItem('custom-auth-token');
  const { useFetchResources: fetchAspects } = UseApiResources<Aspect>({
    endPoint: `${baseURL}/rate/aspects/`,
    queryKey: ['aspects'],
    accessToken,
  });
  const { event_id, userResource_id } = useParams();

  const { useMutateResources: useMutateUserResource } = UseApiResources<UserResource>({
    endPoint: `${baseURL}/rate/user-resource/${userResource_id}/`,
    queryKey: ['userscoreupload'],
    accessToken,
  });
  const { mutate: mutateUserResources } = useMutateUserResource('PATCH');
  const { data: aspects } = fetchAspects({ event_id: event_id });
  const [ratingScore, setRatingScore] = useState<RatingScore[]>([]);
  useEffect(() => {
    if (aspects) {
      setRatingScore(aspects.map((aspect) => ({ aspectId: aspect.id, score: 0 })));
    }
  }, [aspects]);

  const handleInputChange = (index: number, value: number) => {
    setRatingScore((prev) => {
      const newRatingScore = [...prev];
      newRatingScore[index].score = value;
      return newRatingScore;
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const score = ratingScore.reduce((acc, curr) => acc + curr.score, 0);
    const userResourceAspectScore = ratingScore.map((rating) => ({
      aspect: rating.aspectId,
      score: rating.score,
    }));
    mutateUserResources({ score });
  };
  return (
    <form onSubmit={handleSubmit}>
      <Grid item md={6} xs={12}>
        <Card>
          <CardContent>
            <Grid container spacing={3}>
              {aspects?.map((aspect, index) => (
                <Grid item md={6} xs={12} key={index}>
                  <InputLabel>{aspect.name}</InputLabel>
                  <TextField
                    type="number"
                    inputProps={{ min: 0, max: aspect.percentage,step:0.1 }}
                    fullWidth
                    onChange={(e) => handleInputChange(index, Number(e.target.value))}
                  />
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
