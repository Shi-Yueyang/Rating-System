'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

import { paths } from '@/paths';
import { logger } from '@/lib/default-logger';
import { useUser } from '@/hooks/use-user';

export interface GuestGuardProps {
  children: React.ReactNode;
}

export function GuestGuard({ children }: GuestGuardProps): React.JSX.Element | null {
  const router = useRouter();
  const { user, error, isLoading } = useUser();
  const [isChecking, setIsChecking] = React.useState<boolean>(true);

  const checkPermissions = async (): Promise<void> => {
    if (isLoading) {
      logger.debug('[GuestGuard]: isLoading');
      return;
    }

    if (error) {
      logger.error('[GuestGuard]: Error occured');
      setIsChecking(false);
      // router.replace(paths.auth.signIn);
      return;
    }

    if (user) {
      logger.debug('[GuestGuard]: User is logged in, redirecting',user);
      if(user.is_staff || user.groups.includes('admin')){
        router.replace(paths.dashboard.assignment.base);
      }else{
        router.replace(paths.dashboard.rating.base);
      }
      return;
    }

    setIsChecking(false);
  };

  React.useEffect(() => {
    checkPermissions().catch(() => {
      // noop
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Expected
  }, [user, error, isLoading]);

  if (isChecking) {
    logger.debug('[GuestGuard]: isChecking');
    return null;
  }

  return <React.Fragment>{children}</React.Fragment>;
}