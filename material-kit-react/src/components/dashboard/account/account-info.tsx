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
import useUploadUser from '@/hooks/UseUploadAvatar';
import { useState } from 'react';

interface Props{
  previewUrl:string|null;
  handleFileChange:(event:React.ChangeEvent<HTMLInputElement>)=>void;
}

export function AccountInfo({previewUrl,handleFileChange}:Props): React.JSX.Element {
  const { user } = useUser();


  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const useAvatar = useUploadUser();
  return (
    <Card>
      <CardContent>
        <Stack spacing={2} sx={{ alignItems: 'center' }}>
          <div>
            <Avatar src={previewUrl|| user?.avatar} sx={{ height: '80px', width: '80px' }} />
          </div>
          <Stack spacing={1} sx={{ textAlign: 'center' }}>
            <Typography variant="h5">{user?.username}</Typography>
          </Stack>
        </Stack>
      </CardContent>
      <Divider />
      <CardActions sx={{ justifyContent: 'center' }}>
        <input
          type="file"
          ref={fileInputRef} // Ref to access the file input
          id="upload-button-file"
          hidden
          accept="image/*"
          onChange={handleFileChange}
        />
        <label htmlFor="upload-button-file">
          <Button
            component="span"
            variant="text"
            fullWidth
            onClick={() => {
            }}
          >
            上传图片
          </Button>
        </label>
      </CardActions>
    </Card>
  );
}
