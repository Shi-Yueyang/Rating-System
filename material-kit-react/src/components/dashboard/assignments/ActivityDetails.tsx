'use client';

import { ChangeEvent, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Grid,
  InputLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';

import { User } from '@/types/user';
import { ActivityWithAspect, UseApiResources } from '@/hooks/UseApiResource';
import MultiSelect from './MultiSelect';

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

  const { useFetchResources: fetchUsers } = UseApiResources<User>({
    endPoint: 'http://127.0.0.1:8000/rate/users/',
    queryKey: ['users'],
    accessToken,
  });
  const { data: activity } = fetchAcitvity();
  const { data: users } = fetchUsers();
  // assignment state
  const [assignments, setAssignments] = useState<AssignmentFile[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) {
      return;
    }
    const newAssignments: AssignmentFile[] = Array.from(files).map((file) => ({ file, users: [] }));
    setAssignments((prev) => [...prev, ...newAssignments]);
  };

  const handleUserChange = (index: number, selectedUsersIds: string[]) => {
    if (!users) return;
    const selectedUsers = users?.filter((user) => selectedUsersIds.includes(user.id));
    setAssignments((prev) => {
      const updated = [...prev];
      updated[index].users = selectedUsers;
      return updated;
    });
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
            <Typography variant="body1" style={{ marginRight: 16 }}>
              {assignment.file?.name}
            </Typography>
            <MultiSelect></MultiSelect>
          </Grid>
        ))}
      </CardContent>
    </Card>
  );
};

export default ActivityDetails;
