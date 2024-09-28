'use client';

import * as React from 'react';
import { useState } from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Grid from '@mui/material/Unstable_Grid2';

import { useUser } from '@/hooks/use-user';
import useUploadUser from '@/hooks/UseUpload';
import { Alert, Snackbar } from '@mui/material';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

interface Props {
  avatarFile: File | null;
}
const userSchema = z.object({
  username: z.string().min(1, "用户名不能为空").max(20, "用户名不能超过20个字符"),
  email: z.string().email("请输入有效的邮箱地址"),
});

export function AccountDetailsForm({ avatarFile }: Props): React.JSX.Element {
  const { user } = useUser();
  const uploadUser = useUploadUser({});
  
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: user?.username || '',
      email: user?.email || '',
    },
  });


  const onSubmit = (data: { username: string; email: string }) => {
    if(user)
    {
      const updatedUser = {
        ...user,
        username: data.username, 
        email: data.email, 
      };
      uploadUser.mutate({ user: updatedUser, avatarFile });
    }
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader title="详细信息" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required error={!!errors.username}>
                <InputLabel>用户名</InputLabel>
                <Controller
                  name="username"
                  control={control}
                  render={({ field }) => (
                    <OutlinedInput {...field} label="用户名" />
                  )}
                />
                {errors.username && <p style={{ color: 'red' }}>{errors.username.message}</p>}

              </FormControl>
            </Grid>

            <Grid md={6} xs={12}>
              <FormControl fullWidth required error={!!errors.email}>
                <InputLabel>邮箱地址</InputLabel>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <OutlinedInput {...field} label="邮箱地址" />
                  )}
                />
                {errors.email && <p style={{ color: 'red' }}>{errors.email.message}</p>}
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained" disabled={uploadUser.isPending}>
           Submit
          </Button>
        </CardActions>
      </Card>

      {uploadUser.isError && (
        <div>
          <p>Error uploading data: {uploadUser.error?.message}</p>
        </div>
      )}
    </form>
  );
}
