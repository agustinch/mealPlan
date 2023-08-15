import { StateType, User } from '@prisma/client';

const users = {
  TEST_USER: {
    id: 1,
    email: 'test@test.com',
    password: 'test',
  } as User,
};

export default [users.TEST_USER];
