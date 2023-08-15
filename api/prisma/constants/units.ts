import { StateType, Unit } from '@prisma/client';

const units = {
  KG: {
    id: 1,
    name: 'Kilogramos',
    abbreviation: 'kg',
  } as Unit,
  G: {
    id: 2,
    name: 'Gramos',
    abbreviation: 'g',
  } as Unit,
  UNIT: {
    id: 3,
    name: 'Unidad',
    abbreviation: 'unidad',
  },
};

export default [units.KG, units.G, units.UNIT];
