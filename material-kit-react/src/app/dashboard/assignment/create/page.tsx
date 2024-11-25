import React from 'react';

import CreateActivity from '@/components/dashboard/assignments/CreateActivity';
import { StaffOrOrganizerGuard } from '@/components/dashboard/StaffOrOrganizerGuard';

const page = () => {
  return (
    <StaffOrOrganizerGuard>
      <CreateActivity />
    </StaffOrOrganizerGuard>
  );
};

export default page;
