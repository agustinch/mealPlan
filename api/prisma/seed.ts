import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import states from './constants/states';
import units from './constants/units';
import users from './constants/users';
const prisma = new PrismaClient();
async function main() {
  //States
  await prisma.state.createMany({ data: states, skipDuplicates: true });
  //Units
  await prisma.unit.createMany({ data: units, skipDuplicates: true });

  //User
  const createUsers = users.map(async (u) => {
    const { password, ...userWithoutPass } = u;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    return prisma.user.create({
      data: {
        ...userWithoutPass,
        password: hashedPassword,
      },
    });
  });
  await Promise.allSettled(createUsers);
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
