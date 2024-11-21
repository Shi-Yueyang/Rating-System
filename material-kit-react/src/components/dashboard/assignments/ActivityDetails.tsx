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
import { set } from 'react-hook-form';

export interface Resource {
  id: number;
  resource_file: string;
  resource_name: string;
  event: number;
}

interface NewResource{
  resource_file:File;
  resource_name:string;
  event:number
}

const isNotResource = (resource: any): resource is NewResource => {
  return (resource as Resource).id === undefined;
}

interface AssignmentFile {
  resource: NewResource | Resource;
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
    queryKey: ['null'],
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

  // states
  const [assignments, setAssignments] = useState<AssignmentFile[]>([]);
  const [aspects, setAspects] = useState<Aspect[]>();
  const { data: users } = fetchUsers();
  const { data: userResources } = fetchUserResource({ event_id: event_id });
  const { data: resources } = fetchResources({ event_id: event_id });
  
  const transformUserScoresToAssignments = (): AssignmentFile[] => {
    const assignmentMap: { [key: number]: AssignmentFile } = {};
    resources?.forEach((resource) => {
      assignmentMap[resource.id] = {
        resource: resource,
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
  

  // call hooks
  useEffect(() => {
    const transformedAssignments = transformUserScoresToAssignments();
    setAssignments(transformedAssignments);
  }, [userResources, resources]);

  const { data: aspectsData } = fetchAspects({ event_id: event_id });
  useEffect(() => {
    setAspects(aspectsData);
  }, [event_id]);

  // callbacks
  const handleAspectChange = (index: number, field: keyof Aspect, value: any) => {
    if (aspects === undefined) return;
    const newAspects = aspects.map((aspect, i) => {
      if (i === index) {
        return { ...aspect, [field]: value };
      } else {
        return aspect;
      }
    });

    setAspects(newAspects);
  };

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

  const handleFileNameChange = (index: number, value: string) => {
    const newAssignments = assignments.map((assignment, i) => {
      if (i === index) {
        return {...assignment, resource: { ...assignment.resource, resource_name: value } };
      }
      return assignment
    });
    setAssignments(newAssignments);
  }

  const handleSubmit = () => {
    const formData = new FormData();
    // upload and rename
    assignments.forEach((assignment,id) => {
      if (isNotResource(assignment.resource)) {
        formData.append(`newResource_${id}_resourceFile`, assignment.resource.resource_file);
        formData.append(`newResource_${id}_event`, event_id.toString());
        formData.append(`newResource_${id}_resourceName`, assignment.resource.resource_name);
      }
      else{
        formData.append(`oldResource_${id}_resource`, assignment.resource.id.toString());
        formData.append(`oldResource_${id}_resourceName`, assignment.resource.resource_name);
      }
    });

    // upload userResourcePairs
    const userResourcePairs = assignments.flatMap((assignment) =>
      assignment.users.map((user) => ({
        resourceName:assignment.resource.resource_name,
        user: user.id,
      }))
    );

    userResourcePairs.forEach((pair, index) => {
      formData.append(`userResourcePairs_${index}_user`, pair.user.toString());
      formData.append(`userResourcePairs_${index}_resourceName`, pair.resourceName.toString());
    });

    mutateUserResources(formData, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['ActivityDetails-user_resource'] });
        queryClient.invalidateQueries({ queryKey: ['ActivityDetails-resources'] });
        queryClient.invalidateQueries({ queryKey: ['ActivityDetails-users'] });
        router.push(paths.dashboard.activity);
      },
    });
  };

  const fileUploadProp: FileUploadProps = {
    accept: 'file/*',
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files !== null && event.target?.files?.length > 0) {
        const files = event.target.files;
        const resource:NewResource = { resource_file: files[0], resource_name: "" ,event: parseInt(event_id as string)};
        const newAssignments: AssignmentFile[] = Array.from(files).map((file) => ({ resource, users: [] as User[] } ));
        setAssignments((prev) => [...prev, ...newAssignments]);
      }
    },
    onDrop: (event: React.DragEvent<HTMLElement>) => {
      console.log(`Drop ${event.dataTransfer.files[0].name}`);
    },
  };

  return (
    <>
      <EditAspectCard aspects={aspects || []} handleAspectChange={handleAspectChange}></EditAspectCard>
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
                <Grid item xs={12}>
                  <Typography variant="body1" color="textSecondary" style={{ marginRight: 16 }}>
                    {isNotResource(assignment.resource)
                      ? assignment.resource.resource_file.name
                      : (assignment.resource as Resource).resource_file.split('/').pop()}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="作品名"
                    fullWidth
                    onChange={(e) => handleFileNameChange(index, e.target.value)}
                    value={assignment.resource.resource_name}
                  />
                </Grid>
                <Grid item xs={12}>
                  <MultiSelect
                    users={users || []}
                    onChange={(selectedUsers) => handleUserChange(index, selectedUsers)}
                    selectedUsers={assignment.users}
                  />
                </Grid>
                {
                  isNotResource(assignment.resource) && 
                  <Grid item xs={12}>
                    <Button variant="outlined" color="error" onClick={() => handleFileDelete(index)}>
                      删除
                    </Button>
                  </Grid>
                }
                <Grid item xs={12}>
                  <Divider />
                </Grid>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      <Box display={'flex'} justifyContent={'center'} mt={3}>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          提交
        </Button>
      </Box>
    </>
  );
};

export default ActivityDetails;
