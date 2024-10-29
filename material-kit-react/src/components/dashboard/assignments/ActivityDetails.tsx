'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Box, Button, Card, CardContent, Grid, Typography } from '@mui/material';

import { User } from '@/types/user';
import { ActivityWithAspect, UseApiResources } from '@/hooks/UseApiResource';

import { FileUpload, FileUploadProps } from './FileUpload';
import MultiSelect from './MultiSelect';

interface AssignmentFile {
  file: File | null;
  users: User[];
}

interface Resource{
  id:number
  resource_file:File;
}

interface UserScore {
  id:number;
  user:User;
  resource:Resource
}

const ActivityDetails = () => {
  // hooks
  const { id } = useParams();
  const accessToken = localStorage.getItem('custom-auth-token');

  const { useFetchResources: fetchUsers } = UseApiResources<User>({
    endPoint: 'http://127.0.0.1:8000/rate/users/',
    queryKey: ['users'],
    accessToken,
  });

  const{useFetchResources:fetchUserScores} = UseApiResources<UserScore>({
    endPoint: "http://127.0.0.1:8000/rate/user-scores/",
    queryKey:['userscore'],
    accessToken
  })

  const {data:userScores} = fetchUserScores({event_id: id})
  const transformUserScoresToAssignments = (userScores: UserScore[]): AssignmentFile[] => {
    const assignmentMap: { [key: number]: AssignmentFile } = {};

    userScores.forEach((userScore) => {
      const resourceId = userScore.resource.id;

      // If the resource ID isn't in the map, initialize it with the file and an empty users array
      if (!assignmentMap[resourceId]) {
        assignmentMap[resourceId] = {
          file: userScore.resource.resource_file,
          users: [],
        };
      }

      // Add the user to the users array for this resource
      assignmentMap[resourceId].users.push(userScore.user);
    });

    // Convert the map to an array of AssignmentFile objects
    return Object.values(assignmentMap);
  };

  // states
  const [assignments, setAssignments] = useState<AssignmentFile[]>([]);
  const initializeAssignments = () => {
    const transformedAssignments = transformUserScoresToAssignments(userScores||[]);
    setAssignments(transformedAssignments);
  };

  // without useEffect, will cause infinite rerender
  useEffect(() => {
    initializeAssignments();
  }, [userScores]);
  
  const { data: users } = fetchUsers();
  // callbacks
  const handleUserChange = (assignmentId: number, selectedUsers: User[]) => {
    setAssignments((prev) => {
      const updatedAssignment = [...prev];
      updatedAssignment[assignmentId].users = selectedUsers;
      return updatedAssignment;
    });
    console.log('assignment',assignments)
  };

  const handleFileDelete = (id:number) => {
    setAssignments((prevAssignments) => 
      prevAssignments.filter((_, i) => i !== id)
    );
  }

  const fileUploadProp: FileUploadProps = {
    accept: 'file/*',
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files !== null && event.target?.files?.length > 0) {
        const files = event.target.files;
        const newAssignments: AssignmentFile[] = Array.from(files).map((file) => ({ file, users: [] }));
        setAssignments((prev) => [...prev, ...newAssignments]);
      }
    },
    onDrop: (event: React.DragEvent<HTMLElement>) => {
      console.log(`Drop ${event.dataTransfer.files[0].name}`);
    },
  };

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
              <Typography variant="h5" color="secondary">
                上传文件
              </Typography>{' '}
              {/* Primary color for text */}
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
                  <MultiSelect users={users||[]} onChange={(selectedUsers)=>handleUserChange(index,selectedUsers)}/>
                </Grid>
                <Grid item>
                  <Button variant="outlined" color="error" onClick={()=>handleFileDelete(index)}>
                    删除
                  </Button>
                </Grid>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
      
      <Box display={'flex'} justifyContent={'center'} mt={3}>
        <Button variant='outlined' color='primary'>
          提交
        </Button>
      </Box>
    </>
  );
};

export default ActivityDetails;