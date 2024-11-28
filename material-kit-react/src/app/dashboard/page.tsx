
import * as React from 'react';
import type { Metadata } from 'next';
import Grid from '@mui/material/Unstable_Grid2';

import { config } from '@/config';
import { redirect } from 'next/navigation';
import { paths } from '@/paths';


export const metadata = { title: `Overview | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  redirect(paths.dashboard.assignment.base);
  return (
    <Grid container spacing={3}>
    </Grid>
  );
}
