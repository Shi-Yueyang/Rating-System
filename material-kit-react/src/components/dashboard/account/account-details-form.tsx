'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import Grid from '@mui/material/Unstable_Grid2';

import { useUser } from '@/hooks/use-user';
import useUploadUser from '@/hooks/UseUploadAvatar';

const states = [
  { value: 'alabama', label: 'Alabama' },
  { value: 'new-york', label: 'New York' },
  { value: 'san-francisco', label: 'San Francisco' },
  { value: 'los-angeles', label: 'Los Angeles' },
] as const;

export function AccountDetailsForm(): React.JSX.Element {
  const { user } = useUser();
  const uploadUser = useUploadUser();
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <Card>
        <CardHeader title="详细信息" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>用户名</InputLabel>
                <OutlinedInput defaultValue={user?.username} label="username" name="username" />
              </FormControl>
            </Grid>

            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>邮箱地址</InputLabel>
                <OutlinedInput defaultValue={user?.email} label="Email address" name="email" />
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            onClick={() => {
              uploadUser.mutate(user);
            }}
            disabled={!uploadUser.isIdle}
          >
            {uploadUser.isIdle?'上传信息' : '正在上传'}
            
          </Button>
        </CardActions>
      </Card>
    </form>
  );
}
