'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

import { paths } from '@/paths';
import { logger } from '@/lib/default-logger';
import { useUser } from '@/hooks/use-user';

export interface StaffOrOrganizerGuardProps {
  children: React.ReactNode;
}

export function StaffOrOrganizerGuard({ children }: StaffOrOrganizerGuardProps): React.JSX.Element | null {
  const router = useRouter();
  const { user, isLoading } = useUser();

  React.useEffect(() => {
    if (!isLoading) {
      if (!user || (!user.is_staff && !user.groups.includes('Organizer'))) {
        logger.debug('[StaffOrOrganizerGuard]: User is not authorized, redirecting');
        router.replace(paths.auth.signIn);
      }
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return null;
  }

  return <>{children}</>;
}
