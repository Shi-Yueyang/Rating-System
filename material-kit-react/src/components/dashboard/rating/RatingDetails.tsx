'use client';
import { Aspect, UseApiResources } from '@/hooks/UseApiResource';
import { useParams } from 'next/navigation';
import React from 'react';

const RatingDetails = () => {

  const accessToken = localStorage.getItem('custom-auth-token');

  const { useFetchResources: fetchAspects } = UseApiResources<Aspect>({
    endPoint: 'http://127.0.0.1:8000/rate/aspects/',
    queryKey: ['users'],
    accessToken,
  });
  const { id: event_id } = useParams();

  const {data:aspects} = fetchAspects({event_id:event_id});
  console.log('aspects',aspects)

  return <></>;
};

export default RatingDetails;
