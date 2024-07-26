import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { fetchUsers } from '../hooks/useUsers';
import { useQuery } from '@tanstack/react-query';
import UserContext from '../context/UserContext';


const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [errorMessage, setErrorMessage] = useState('');
  const { data: users, error, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });
  const navigate = useNavigate();
  const { userState, setUserState } = useContext(UserContext)


  const onSubmit = (data, e) => {
    e.preventDefault();
    const foundUser = users.value.find(user =>
      user.Name === data.username && user.Password === data.password)
    if (foundUser) {
      setUserState(prevState => ({
        ...prevState,
        userId: foundUser.UserId,
      }));
      navigate('/next-page');
    }
    else {
      setErrorMessage('Invalid username or password');
    };
  }

  if (isLoading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error fetching users</Typography>;

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      autoComplete="off"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        width: '300px',
        padding: 2,
        backgroundColor: 'white',
        borderRadius: 1,
        boxShadow: 1,
        margin: 'auto',
        marginTop: '50px',
      }}
    >
      <TextField
        {...register('username', { required: 'Username is required' })}
        label="Username"
        variant="outlined"
        fullWidth
        error={!!errors.username}
        helperText={errors.username ? errors.username.message : ''}
      />
      <TextField
        {...register('password', { required: 'Password is required' })}
        label="Password"
        type="password"
        variant="outlined"
        fullWidth
        error={!!errors.password}
        helperText={errors.password ? errors.password.message : ''}
      />
      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
      {errorMessage && (
        <Typography color="error" sx={{ marginTop: 1 }}>
          {errorMessage}
        </Typography>
      )}
    </Box>
  );
};

export default LoginForm;
