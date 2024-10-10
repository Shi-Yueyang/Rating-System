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
import { FileUpload, FileUploadProps } from './FileUpload';

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

  const fileUploadProp: FileUploadProps = {
    accept: 'file/*',
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
        if (
            event.target.files !== null &&
            event.target?.files?.length > 0
        ) {
          const files = event.target.files;
          const newAssignments: AssignmentFile[] = Array.from(files).map((file) => ({ file, users: [] }));
          setAssignments((prev) => [...prev, ...newAssignments]);
        }
    },
    onDrop: (event: React.DragEvent<HTMLElement>) => {
        console.log(`Drop ${event.dataTransfer.files[0].name}`)
    },
  }
  
  return (
    <>
      {/* First card: File upload section */}
      <Card
        sx={{
          boxShadow: '0 3px 5px rgba(0,0,0,0.2)', // Add some shadow for depth
          marginBottom: 3, // Space below the card
        }}
      >
        <CardContent>
          <Grid container direction="column" justifyContent="center" alignItems="center" spacing={2}>
            <Grid item>
              <Typography variant="h5" color="secondary">上传文件</Typography> {/* Primary color for text */}
            </Grid>
            <Grid item>
              <Box mt={2}>
                <FileUpload {...fileUploadProp} />
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Second card: List of uploaded files and multi-select options */}
      <Card
        sx={{
          boxShadow: '0 3px 5px rgba(0,0,0,0.2)', // Add shadow
        }}
      >
        <CardContent>
          <Grid container direction="column" spacing={3}>
            {assignments.map((assignment, index) => (
              <Grid item key={index} container justifyContent="center" alignItems="center" spacing={2}>
                <Grid item>
                  <Typography variant="body1" color="textSecondary" style={{ marginRight: 16 }}>
                    {assignment.file?.name}
                  </Typography>
                </Grid>
                <Grid item>
                  <MultiSelect />
                </Grid>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </>
  );
};

export default ActivityDetails;
