'use client';

import { useParams } from 'next/navigation';

const ActivityDetails = () => {
    const { id } = useParams();

    return (
      <div>
        <h1>Activity ID: {id}</h1>
      </div>
    );
};

export default ActivityDetails;
