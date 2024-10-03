
import * as React from 'react';
import type { Metadata } from 'next';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';

import { config } from '@/config';
import { AccountDetailsForm } from '@/components/dashboard/account/account-details-form';
import { AccountInfo } from '@/components/dashboard/account/account-info';
import AccountPage from '@/components/dashboard/account/account-page';

export const metadata = { title: `Account | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {

  return (
    
    <Stack spacing={3}>
      <div>
        <Typography variant="h4" padding={3}>账号信息</Typography>
      </div>
      <AccountPage/>
    </Stack>
  );
}
