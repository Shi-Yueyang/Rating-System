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
import { baseURL } from '@/config';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {User} from '@/types/user';
import { UseApiResources } from '@/hooks/UseApiResource';


interface Props {
  avatarFile: File | null;
}
const userSchema = z.object({
  username: z.string().min(1, "用户名不能为空").max(20, "用户名不能超过20个字符"),
  email: z.string().email("请输入有效的邮箱地址"),
  realname: z.string(),
});

export function AccountDetailsForm({ avatarFile }: Props): React.JSX.Element {

  // hooks
  const { user } = useUser();
  const accessToken = localStorage.getItem('custom-auth-token');
  const{useMutateResources:useMutateUser} = UseApiResources<User>({
    endPoint: `${baseURL}/rate/users/${user?.id}/`,
    queryKey: ['users', String(user?.id)],
    accessToken,
    contentType: 'multipart/form-data',
  })
  const {mutate:mutateUsers,isPending,isError,error} = useMutateUser('PATCH');



  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: user?.username || '',
      email: user?.email || '',
      realname: user?.realname || '',
    },
  });


  const onSubmit = (data: { username: string; email: string; realname:string }) => {
    if(user)
    {
      const formData = new FormData();
      formData.append('username', data.username);
      formData.append('email', data.email);
      formData.append('realname', data.realname);
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }
      mutateUsers(formData);
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

            <Grid md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>真实姓名</InputLabel>
                <Controller
                  name="realname"
                  control={control}
                  rules={{ required: false }}
                  render={({ field }) => (
                    <OutlinedInput {...field} label="真实姓名" />
                  )}
                />
              </FormControl>
            </Grid>
            
          </Grid>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained" disabled={isPending}>
           提交
          </Button>
        </CardActions>
      </Card>

      {isError && (
        <div>
          <p>Error uploading data: {error?.message}</p>
        </div>
      )}
    </form>
  );
}
