'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import { paths } from '@/paths';
import { useUser } from '@/hooks/use-user';
import { UseApiResources } from '@/hooks/UseApiResource';
import { Resource } from '../assignments/ActivityDetails';
import { backendURL } from '@/config';

interface UserResourceFull {
  id: number;
  user: number;
  resource: Resource;
  score: number;
}
const RatingTaskList = () => {
  const { event_id: eventId } = useParams();
  const { user } = useUser();
  const accessToken = localStorage.getItem('custom-auth-token');
  const { useFetchResources: useFetchUserResources } = UseApiResources<UserResourceFull>({
    endPoint:`${backendURL}/rate/user-resource/`,
    queryKey: ['UserResource',eventId.toString(),user?.id.toString()||''],
    accessToken,
  });
  const { data: userResources } = useFetchUserResources({ event_id: eventId, user_id: user?.id });
  const router = useRouter();
  return (
    <Stack>
      <Typography variant="h4" padding={3}>
        作品列表
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>作品名</TableCell>
              <TableCell>分数</TableCell>
              <TableCell>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(userResources) &&
              userResources.map((userResource) => (
                <TableRow key={userResource.id}>
                  <TableCell>{userResource.resource.resource_name}</TableCell>
                  <TableCell>{userResource.score}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => {
                        router.push(paths.dashboard.rating.tasks +'/' + eventId.toString() + '/resource/' + userResource.id.toString());
                      }}
                    >
                      点评
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      href={`${backendURL}/${userResource.resource.resource_file}/`} 
                      download
                      style={{ marginLeft: '10px' }}
                    >
                      下载
                    </Button>
                  </TableCell>

                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
};

export default RatingTaskList;
