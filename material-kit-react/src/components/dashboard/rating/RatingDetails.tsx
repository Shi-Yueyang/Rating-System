'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button, Card, CardContent, CardHeader, Grid, InputLabel, TextField, Typography } from '@mui/material';
import { backendURL } from '@/config';
import { Aspect, UseApiResources } from '@/hooks/UseApiResource';
import { paths } from '@/paths';
import { useQueryClient } from '@tanstack/react-query';
import { useUser } from '@/hooks/use-user';
import { UserResource } from '../assignments/ActivityDetails';



interface AspectScore {
  aspect: number;
  score: number;
}

const RatingDetails = () => {
  const router = useRouter();
  const { user } = useUser();
  const queryClient = useQueryClient();
  const { event_id, userResource_id } = useParams();
  const accessToken = localStorage.getItem('custom-auth-token');
  const { useFetchResources: fetchAspects } = UseApiResources<Aspect>({
    endPoint: `${backendURL}/rate/aspects/`,
    queryKey: ['aspects'],
    accessToken,
  });

  const { useFetchResources: fetchAspectsScores } = UseApiResources<AspectScore>({
    endPoint: `${backendURL}/rate/user-resource-aspect-score/`,
    queryKey: ['user-resource-aspect-score',userResource_id.toString()],
    accessToken,
  });


  const { useMutateResources: useMutateUserResource } = UseApiResources<UserResource>({
    endPoint: `${backendURL}/rate/user-resource/${userResource_id}/detail_update/`,
    queryKey: ['null'],
    accessToken,
  });

  const { mutate: mutateUserResources } = useMutateUserResource('PATCH');
  const {data:aspects} = fetchAspects({event_id:event_id});
  const {data:aspectsScores} = fetchAspectsScores({user_resource:userResource_id});

  const [ratingScore, setRatingScore] = useState<AspectScore[]>(aspectsScores || []);

  useEffect(() => {
    console.log(aspectsScores);
    if(aspectsScores){
      setRatingScore(aspectsScores.map((aspectScore) => ({
        aspect: aspectScore.aspect,
        score: parseFloat(aspectScore.score.toString()), // the backend always tread decimal as string
      })));

    }
    else if(aspects){
      setRatingScore(aspects?.map((aspect) => ({
        aspect: aspect.id,
        score: 0,
      })));
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
      user_resource: userResource_id,
      aspect: rating.aspect,
      score: rating.score,
    }));
    const dataToSend = {totalScore: score, userResourceAspectScore};

    mutateUserResources(dataToSend,{
      onSuccess : () => {
        queryClient.invalidateQueries({ queryKey: ['user-resource-aspect-score',userResource_id.toString()] });
        queryClient.invalidateQueries({ queryKey:  ['UserResource',event_id.toString(),user?.id.toString()||''] });

       
        router.push(paths.dashboard.rating.tasks+'/' + event_id);
      }
    });
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
                    inputProps={{ min: 0, max: aspect.percentage,step:0.01 }}
                    fullWidth
                    value={ratingScore[index]?.score || ""}
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
