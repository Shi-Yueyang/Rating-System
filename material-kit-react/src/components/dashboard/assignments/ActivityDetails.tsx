'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import { Stack } from '@mui/system';
import { Cardholder } from '@phosphor-icons/react/dist/ssr';
import { useQueryClient } from '@tanstack/react-query';

import { User } from '@/types/user';
import { baseURL } from '@/config';
import { paths } from '@/paths';
import { Aspect, UseApiResources } from '@/hooks/UseApiResource';

import EditAspectCard from './EditAspectCard';
import { FileUpload, FileUploadProps } from './FileUpload';
import MultiSelect from './MultiSelect';

export interface Resource {
  id: number;
  resource_name: string;
  resource_file: string;
  event: number;
}

interface AssignmentFile {
  file: File | Resource;
  users: User[];
}

interface UserResource {
  id: number;
  user: number;
  resource: Resource;
  score: number;
}

const ActivityDetails = () => {
  // hooks
  const router = useRouter();
  const { id: event_id } = useParams();
  const queryClient = useQueryClient();

  const accessToken = localStorage.getItem('custom-auth-token');

  const { useFetchResources: fetchUsers } = UseApiResources<User>({
    endPoint: `${baseURL}/rate/users/`,
    queryKey: ['ActivityDetails-users'],
    accessToken,
  });

  const { useFetchResources: fetchUserResource } = UseApiResources<UserResource>({
    endPoint: `${baseURL}/rate/user-resource/`,
    queryKey: ['ActivityDetails-user_resource'],
    accessToken,
  });
  const { useMutateResources: useMutateUserResources } = UseApiResources<UserResource>({
    endPoint: `${baseURL}/rate/user-resource/bulk_create/`,
    accessToken,
    queryKey: ['ActivityDetails-bulk_create'],
    contentType: 'multipart/form-data',
  });

  const { useFetchResources: fetchAspects } = UseApiResources<Aspect>({
    endPoint: `${baseURL}/rate/aspects/`,
    queryKey: ['aspects'],
    accessToken,
  });

  const { mutate: mutateUserResources } = useMutateUserResources('POST');

  const { useFetchResources: fetchResources } = UseApiResources<Resource>({
    endPoint: `${baseURL}/rate/resources/`,
    queryKey: ['ActivityDetails-resources'],
    accessToken,
  });

  // call hooks
  const { data: users } = fetchUsers();
  const { data: userResources } = fetchUserResource({ event_id: event_id });
  const { data: aspects } = fetchAspects({ event_id: event_id });
  const { data: resources } = fetchResources({ event_id: event_id });

  const transformUserScoresToAssignments = (): AssignmentFile[] => {
    const assignmentMap: { [key: number]: AssignmentFile } = {};
    resources?.forEach((resource) => {
      assignmentMap[resource.id] = {
        file: resource,
        users: [],
      };
    });

    if (userResources && users) {
      userResources.forEach((userResource) => {
        const resourceId = userResource.resource.id;
        const foundUser = users.find((user) => user.id === userResource.user);
        if (foundUser && assignmentMap[resourceId]) {
          assignmentMap[resourceId].users.push(foundUser);
        }
      });
    }

    return Object.values(assignmentMap);
  };

  // states
  const [assignments, setAssignments] = useState<AssignmentFile[]>([]);
  const initializeAssignments = () => {
    const transformedAssignments = transformUserScoresToAssignments();
    setAssignments(transformedAssignments);
  };

  // without useEffect, it will cause infinite rerender
  useEffect(() => {
    initializeAssignments();
  }, [userResources, resources]);

  // callbacks
  const handleUserChange = (assignmentId: number, selectedUsers: User[]) => {
    setAssignments((prev) => {
      const updatedAssignment = [...prev];
      updatedAssignment[assignmentId].users = selectedUsers;
      return updatedAssignment;
    });
  };

  const handleFileDelete = (id: number) => {
    setAssignments((prevAssignments) => prevAssignments.filter((_, i) => i !== id));
  };

  const handleFileChange = () => {
    const userResourcePairs = assignments.flatMap((assignment) =>
      assignment.users.map((user) => ({
        user: user.id,
        resource: assignment.file instanceof File ? assignment.file : (assignment.file as Resource).id,
      }))
    );
    const formData = new FormData();
    userResourcePairs.forEach((pair, index) => {
      formData.append(`userResourcePairs_${index}_user`, pair.user.toString());
      if (pair.resource instanceof File) {
        formData.append(`userResourcePairs_${index}_resourcefile`, pair.resource);
        formData.append(`userResourcePairs_${index}_event`, event_id.toString());
      } else {
        formData.append(`userResourcePairs_${index}_resource`, pair.resource.toString());
      }
    });

    mutateUserResources(formData, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['ActivityDetails-user_resource'] });
        router.push(paths.dashboard.activity);
      },
    });
  };

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
      <EditAspectCard aspects={aspects || []}></EditAspectCard>
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
                上传作品文件
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
          boxShadow: '0 3px 5px rgba(0,0,0,0.2)',
        }}
      >
        <CardHeader
          title="分配任务"
          titleTypographyProps={{
            variant: 'h5',
            fontWeight: 'bold',
            color: 'primary',
          }}
        />{' '}
        <CardContent>
          <Grid container direction="column" spacing={3}>
            {assignments.map((assignment, index) => (
              <Grid item key={index} container justifyContent="center" alignItems="center" spacing={2}>
                <Grid item>
                  <Typography variant="body1" color="textSecondary" style={{ marginRight: 16 }}>
                    {assignment.file instanceof File
                      ? assignment.file.name
                      : (assignment.file as Resource).resource_name}
                  </Typography>
                </Grid>
                
                <Grid item>
                  <MultiSelect
                    users={users || []}
                    onChange={(selectedUsers) => handleUserChange(index, selectedUsers)}
                    selectedUsers={assignment.users}
                  />
                </Grid>
                <Grid item>
                  <Button variant="outlined" color="error" onClick={() => handleFileDelete(index)}>
                    删除
                  </Button>
                </Grid>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      <Box display={'flex'} justifyContent={'center'} mt={3}>
        <Button variant="contained" color="primary" onClick={handleFileChange}>
          提交
        </Button>
      </Box>
    </>
  );
};

export default ActivityDetails;
