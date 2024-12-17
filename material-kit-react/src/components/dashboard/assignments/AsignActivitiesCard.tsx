import React from 'react';
import { Button, Card, CardContent, CardHeader, Divider, Grid, TextField, Typography } from '@mui/material';

import { User } from '@/types/user';

import { AssignmentFile, isNotResource, Resource } from './ActivityDetails';
import MultiSelect from './MultiSelect';

interface AsignActivitiesCardProps {
  assignments: AssignmentFile[];
  users: User[];
  handleFileNameChange: (index: number, fileName: string) => void;
  handleFileDelete: (id: number) => void;
  handleUserChange: (assignmentId: number, selectedUsers: User[]) => void;
}

const AsignActivitiesCard = ({
  assignments,
  users,
  handleFileNameChange,
  handleFileDelete,
  handleUserChange,
}: AsignActivitiesCardProps) => {
  return (
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
      />
      <CardContent>
        <Grid container direction="column" spacing={3}>
          {assignments.map((assignment, index) => (
            <Grid item key={index} container justifyContent="center" alignItems="center" spacing={2}>
              <Grid item xs={12}>
                <Typography variant="body1" color="textSecondary" style={{ marginRight: 16 }}>
                  <a
                    href={
                      isNotResource(assignment.resource)
                        ? URL.createObjectURL(assignment.resource.resource_file) // new file
                        : assignment.resource.resource_file
                    }
                    download={
                      isNotResource(assignment.resource)
                        ? assignment.resource.resource_file.name
                        : decodeURIComponent((assignment.resource as Resource).resource_file.split('/').pop() || '')
                    }
                  >
                    {isNotResource(assignment.resource)
                      ? assignment.resource.resource_file.name // new file
                      : decodeURIComponent((assignment.resource as Resource).resource_file.split('/').pop() || '')}
                  </a>
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="作品名"
                  fullWidth
                  onChange={(e) => {
                    handleFileNameChange(index, e.target.value);
                  }}
                  value={assignment.resource.resource_name}
                />
              </Grid>
              <Grid item xs={12}>
                <MultiSelect
                  users={users || []}
                  onChange={(selectedUsers) => {
                    handleUserChange(index, selectedUsers);
                  }}
                  selectedUsers={assignment.users}
                />
              </Grid>
              {isNotResource(assignment.resource) && (
                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => {
                      handleFileDelete(index);
                    }}
                  >
                    删除
                  </Button>
                </Grid>
              )}
              <Grid item xs={12}>
                <Divider />
              </Grid>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default AsignActivitiesCard;
