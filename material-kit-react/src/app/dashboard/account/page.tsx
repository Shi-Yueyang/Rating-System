
import * as React from 'react';
import type { Metadata } from 'next';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { config } from '@/config';
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
