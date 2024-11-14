'use client';

import React, { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { User } from '@/types/user';
import { UseApiResources } from '@/hooks/UseApiResource';
import { CustomersFilters } from '@/components/dashboard/customer/customers-filters';
import { CustomersTable } from '@/components/dashboard/customer/customers-table';

const CustomerPage = () => {
  const accessToken = localStorage.getItem('custom-auth-token');

  const { useFetchResources: fetchUsers } = UseApiResources<User>({
    endPoint: 'http://127.0.0.1:8000/rate/users/',
    queryKey: ['users'],
    accessToken,
  });

  const { data: users } = fetchUsers();
  const page = 0;
  const rowsPerPage = 5;

  const [paginatedCustomers, setPaginatedCustomers] = useState<User[]>([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    if (users) {
      const filteredUsers = users.filter(user =>{
        return user.realname.includes(filter);
      });
      setPaginatedCustomers(applyPagination(filteredUsers, page, rowsPerPage));
    }
  }, [users, filter, page, rowsPerPage]);
    
  const handleFilterChange = (value: string) => {
    setFilter(value);
  }

  return (
    <div>
      <Stack direction="row" spacing={3}>
        <Typography variant="h4">用户</Typography>
      </Stack>
      <CustomersFilters onFilterChange={handleFilterChange}/>
      <CustomersTable
        count={paginatedCustomers.length}
        page={page}
        rows={paginatedCustomers}
        rowsPerPage={rowsPerPage}
      />
    </div>
  );
};

function applyPagination(rows: User[], page: number, rowsPerPage: number): User[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}

export default CustomerPage;