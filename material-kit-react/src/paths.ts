export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password' },
  dashboard: {
    account: '/dashboard/account',
    customers: '/dashboard/customers',
    activity: '/dashboard/assignment', // newly added
  },
  createEvent:'/dashboard/assignment/create',
  eventDetails:'/dashboard/assignment/details/',
  errors: { notFound: '/errors/not-found' },
} as const;
