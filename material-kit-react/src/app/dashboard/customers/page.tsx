import * as React from 'react';
import type { Metadata } from 'next';
import Stack from '@mui/material/Stack';

import { config } from '@/config';
import CustomerPage from '@/components/dashboard/customer/CustomerPage';
import { StaffOrOrganizerGuard } from '@/components/dashboard/StaffOrOrganizerGuard';

export const metadata = { title: `Customers | Dashboard | ${config.site.name}` } satisfies Metadata;
export default function Page(): React.JSX.Element {
  return (
    <StaffOrOrganizerGuard>
      <Stack spacing={3}>
        <CustomerPage />
      </Stack>
    </StaffOrOrganizerGuard>
  );
}
