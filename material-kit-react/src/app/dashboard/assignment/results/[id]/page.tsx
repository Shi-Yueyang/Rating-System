'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Typography } from '@mui/material';
import { Stack } from '@mui/system';

import { User } from '@/types/user';
import { backendURL } from '@/config';
import { UseApiResources } from '@/hooks/UseApiResource';
import { Resource, UserResource } from '@/components/dashboard/assignments/ActivityDetails';
import ScoreList, { AspectScore, ReviewerScore, Work } from '@/components/dashboard/assignments/ResultList';
import { StaffOrOrganizerGuard } from '@/components/dashboard/StaffOrOrganizerGuard';

const Page = () => {
  const { id: eventId } = useParams();
  const accessToken = localStorage.getItem('custom-auth-token');

  const { useFetchResources: fetchUserResource } = UseApiResources<UserResource>({
    endPoint: `${backendURL}/rate/user-resource/`,
    queryKey: ['user_resources', eventId.toString()],
    accessToken,
  });

  const { useFetchResources: fetchAspectsScores } = UseApiResources<AspectScore>({
    endPoint: `${backendURL}/rate/user-resource-aspect-score/`,
    queryKey: ['user-resource-aspect-score', eventId.toString()],
    accessToken,
  });

  const { useFetchResources: fetchUsers } = UseApiResources<User>({
    endPoint: `${backendURL}/rate/users/`,
    queryKey: ['users'],
    accessToken,
  });

  const { data: userResources } = fetchUserResource({ event_id: eventId });
  const { data: userAspectScores } = fetchAspectsScores({ event_id: eventId });
  const { data: users } = fetchUsers();
  const [works, setWorks] = useState<Work[]>([]);
  
  // construct works
  useEffect(() => {
    const uniqueResources: Resource[] = Array.from(
      new Map(userResources?.map((userResource) => [userResource.resource.id, userResource.resource])).values()
    );

    const userIdUserObjectMap = new Map(users?.map((user) => [user.id, user]));

    const userResourceIdResourceIdMap = new Map(
      userResources?.map((userResource) => [userResource.id, userResource.resource.id])
    );

    const UserResourceIdUserIdMap = new Map(
      userResources?.map((userResource) => [userResource.id, userResource.user])
    );

    const tempWorks: Work[] = uniqueResources.map((resource, id) => {
      const relatedAspectScore =
        userAspectScores?.filter(
          (userAspectScore) => resource.id === userResourceIdResourceIdMap.get(userAspectScore.user_resource)
        ) || [];
      const relatedUsers =
        userResources
          ?.filter((userResource) => resource.id === userResource.resource.id)
          .map((userResource) => userResource.user) || [];

      const reviewerScores: ReviewerScore[] = relatedUsers?.map((userId, id) => {
        const aspectScores =
          relatedAspectScore?.filter(
            (aspectScore) => UserResourceIdUserIdMap.get(aspectScore.user_resource) === userId
          ) ?? [];
        return {
          id,
          name: userIdUserObjectMap.get(userId)?.username ?? '',
          aspectScores,
        };
      });

      return {
        id,
        title: resource.resource_name,
        reviewerScores,
      };
    });

    setWorks(tempWorks);
  }, [users, userResources, userAspectScores]);

  return (
    <StaffOrOrganizerGuard>
      <Stack spacing={3}>
        <div>
          <Typography variant="h4" padding={3}>
            结果
          </Typography>
        </div>
        <ScoreList works={works} />
      </Stack>
    </StaffOrOrganizerGuard>
  );
};

export default Page;
