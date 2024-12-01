'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { CaretDown, ListBullets, Star } from '@phosphor-icons/react';

import { backendURL } from '@/config';
import { UseApiResources } from '@/hooks/UseApiResource';

import { Resource, UserResource } from './ActivityDetails';

interface AspectScore {
  id: number;
  user_resource: number;
  aspect: string;
  score: number;
}

interface Reviewer {
  id: number;
  name: string;
  aspectScores: AspectScore[];
}

interface Work {
  id: number;
  title: string;
  reviewers: Reviewer[];
}

interface Props {
  works: Work[];
}

const ScoreList: React.FC<Props> = ({ works }) => {
  const { id: event_id } = useParams();
  const accessToken = localStorage.getItem('custom-auth-token');

  const { useFetchResources: fetchUserResource } = UseApiResources<UserResource>({
    endPoint: `${backendURL}/rate/user-resource/`,
    queryKey: ['user_resources', event_id.toString()],
    accessToken,
  });

  const { useFetchResources: fetchAspectsScores } = UseApiResources<AspectScore>({
    endPoint: `${backendURL}/rate/user-resource-aspect-score/`,
    queryKey: ['user-resource-aspect-score', event_id.toString()],
    accessToken,
  });

  const { data: userResources } = fetchUserResource({ event_id: event_id });
  const { data: userAspectScores } = fetchAspectsScores({ event_id: event_id });
  //--------------------------------------------------------------------------------
  const uniqueResources: Resource[] = Array.from(
    new Map(userResources?.map((userResource) => [userResource.resource.id, userResource.resource])).values()
  );

  const userResourceIdResourceIdMap = new Map(
    userResources?.map((userResource) => [userResource.id, userResource.resource.id])
  );
  const UserResourceIdUserIdMap = new Map(
    userResources?.map((userResource) => [userResource.id, userResource.user])
  )

  const tempWork = uniqueResources.map((resource) => {
    const relatedAspectScore = userAspectScores?.filter(
      (userAspectScore) => resource.id === userResourceIdResourceIdMap.get(userAspectScore.user_resource)
    );
    const relatedUsers = userResources
      ?.filter((userResource) => resource.id === userResource.resource.id)
      .map((userResource) => userResource.user);
    const groupedAspectScores = relatedUsers?.map((user) => {
      const aspectScores = relatedAspectScore?.filter((aspectScore) => UserResourceIdUserIdMap.get(aspectScore.user_resource) === user);
      return {
        user,
        aspectScores,
      };
    })
    return {
      resource,
      groupedAspectScores,
    };
  });

  console.log(tempWork)
  //--------------------------------------------------------------------------------

  const calculateTotalScore = (reviewers: Reviewer[]) =>
    reviewers.reduce(
      (sum, reviewer) => sum + reviewer.aspectScores.reduce((aspectSum, aspect) => aspectSum + aspect.score, 0),
      0
    );

  return (
    <Grid container spacing={3}>
      {works.map((work) => (
        <Grid item xs={12} key={work.id}>
          <Card>
            <CardHeader
              title={
                <Box display="flex" alignItems="center" gap={1}>
                  <ListBullets size={24} weight="bold" />
                  <Typography variant="h6">{work.title}</Typography>
                </Box>
              }
              subheader={
                <Box display="flex" alignItems="center" gap={1}>
                  <Star size={20} color="#ffb400" />
                  <Typography>Total Score: {calculateTotalScore(work.reviewers)}</Typography>
                </Box>
              }
            />
            <CardContent>
              <Accordion>
                <AccordionSummary expandIcon={<CaretDown size={20} />}>
                  <Typography variant="subtitle1">
                    <ListBullets size={20} /> View Reviewers
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {work.reviewers.map((reviewer) => (
                    <Box key={reviewer.id} mb={2}>
                      <Typography variant="h6">{reviewer.name}</Typography>
                      <Accordion>
                        <AccordionSummary expandIcon={<CaretDown size={20} />}>
                          <Typography>
                            <ListBullets size={16} /> View Aspect Scores
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <TableContainer>
                            <Table>
                              <TableHead>
                                <TableRow>
                                  <TableCell>Aspect</TableCell>
                                  <TableCell>Score</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {reviewer.aspectScores.map((aspect, index) => (
                                  <TableRow key={index}>
                                    <TableCell>{aspect.aspect}</TableCell>
                                    <TableCell>{aspect.score}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </AccordionDetails>
                      </Accordion>
                    </Box>
                  ))}
                </AccordionDetails>
              </Accordion>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ScoreList;
