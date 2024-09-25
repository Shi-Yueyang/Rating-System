'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useUser } from '@/hooks/use-user';



export function AccountInfo(): React.JSX.Element {
  const {user } = useUser();
  return (
    <Card >
      <CardContent>
        <Stack spacing={2} sx={{ alignItems: 'center' }}>
          <div>
            <Avatar src={user?.avatar} sx={{ height: '80px', width: '80px' }} />
          </div>
          <Stack spacing={1} sx={{ textAlign: 'center' }}>
            <Typography variant="h5">{user?.username}</Typography>

          </Stack>
        </Stack>
      </CardContent>
      <Divider />
      <CardActions sx={{justifyContent: 'center',}}>
        <input
          accept="image/*"
          style={{ display: 'none' }}
          id="upload-button-file"
          type="file"
        />
        <label htmlFor="upload-button-file">
          <Button component="span" variant="text" fullWidth>
            上传图片
          </Button>
        </label>

      </CardActions>
    </Card>
  );
}
