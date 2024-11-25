import React from 'react';

import ActivityDetails from '@/components/dashboard/assignments/ActivityDetails';
import { StaffOrOrganizerGuard } from '@/components/dashboard/StaffOrOrganizerGuard';

const page = () => {
  return (
    <StaffOrOrganizerGuard>
      <ActivityDetails />
    </StaffOrOrganizerGuard>
  );
};

export default page;
