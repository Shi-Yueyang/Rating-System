'use client';

import React, { useState } from 'react';
import { Grid } from '@mui/material';

import { AccountDetailsForm } from './account-details-form';
import { AccountInfo } from './account-info';

const AccountPage = () => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setAvatarFile(event.target.files[0]);
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    }
  };
  return (
    <>
      <Grid container spacing={3} padding={3}>
        <Grid lg={4} md={6} xs={12}>
          <AccountInfo previewUrl={previewUrl} handleFileChange={handleFileChange} />
        </Grid>
        <Grid lg={8} md={6} xs={12}>
          <AccountDetailsForm avatarFile={avatarFile} />
        </Grid>
      </Grid>
    </>
  );
};

export default AccountPage;
