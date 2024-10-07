'use client';

import { ChangeEvent, useState } from 'react';
import { useParams } from 'next/navigation';
import { Box, Button, Card, CardContent, Grid, InputLabel, Select, Stack, TextField, Typography } from '@mui/material';

import { User } from '@/types/user';
import { Activity, ActivityWithAspect, Aspect, UseApiResources } from '@/hooks/UseApiResource';

interface AssignmentFile {
  file: File | null;
  users: User[];
}

const ActivityDetails = () => {
  // get activity
  const { id } = useParams();
  const accessToken = localStorage.getItem('custom-auth-token');
  const { useFetchSingleResource: fetchAcitvity } = UseApiResources<ActivityWithAspect>({
    endPoint: 'http://127.0.0.1:8000/rate/events/' + id,
    queryKey: ['events', id as string],
    accessToken: accessToken,
  });
  const { data: activity } = fetchAcitvity();

  // assignment state
  const [assignments, setAssignments] = useState<AssignmentFile[]>([]);
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) {
      return;
    }
    const newAssignments: AssignmentFile[] = Array.from(files).map((file) => ({ file, users: [] }));
    setAssignments((prev) => [...prev, ...newAssignments]);
  };

  return (
    <Card>
      <CardContent>
        <Grid>
          <Typography variant="h5">上传文件</Typography>
          <Box mt={2}>
            <Button variant="contained" component="label">
              选择文件
              <input type="file" hidden multiple onChange={handleFileChange}></input>
            </Button>
          </Box>
        </Grid>
        {assignments.map((assignment, index) => (
          <Grid item xs={12}>
            <Typography variant="body1">{assignment.file?.name}</Typography>
            <InputLabel id={`user-select-${index}`}>Assign Users</InputLabel>
            <Select labelId={`user-select-${index}`} multiple value={assignment.users}></Select>
          </Grid>
        ))}
      </CardContent>
    </Card>
  );
};

export default ActivityDetails;
