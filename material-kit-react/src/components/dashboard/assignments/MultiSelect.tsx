import React from "react";
import { TextField, Autocomplete, MenuItem } from "@mui/material";
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { User } from "@/types/user";


interface Props{
  users:User[];
  selectedUsers:User[];
  onChange:(selectedUsers:User[])=>void
}

export default function MultiSelect({users,selectedUsers,onChange}:Props) {
  return (
    <Autocomplete
      // sx={{ m: 1, width: 500 }}
      multiple
      fullWidth
      options={users}
      value={selectedUsers}
      getOptionLabel={(option) => option.username||' '}
      disableCloseOnSelect
      isOptionEqualToValue={(option,value)=>option.id == value.id}
      onChange ={(_, newSelectedUsers) => onChange(newSelectedUsers)}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          label="添加评委"
          placeholder="输入姓名"
        />
      )}
      renderOption={(props, option, { selected }) => (
       <MenuItem
          {...props}
          key={option.id}
          value={option.username}
          sx={{ justifyContent: "space-between" }}
        >
          {option.username} {/* Display the username */}
          {selected ? <PlusIcon color="info" /> : null}
        </MenuItem>
      )}
    />
  );
}