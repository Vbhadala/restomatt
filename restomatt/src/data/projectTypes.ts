import { ProjectType } from '../types';

export const defaultProjectTypes: ProjectType[] = [
  {
    id: 'kitchen',
    name: 'Kitchen',
    icon: 'ChefHat',
    description: 'Design your perfect kitchen with custom cabinets and layouts',
    materials: [
      {
        id: 'oak-wood',
        name: 'Oak Wood',
        ratePerSqft: 950.00,
        projectTypeId: 'kitchen',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'maple-wood',
        name: 'Maple Wood',
        ratePerSqft: 1140.00,
        projectTypeId: 'kitchen',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'laminate',
        name: 'Laminate',
        ratePerSqft: 608.00,
        projectTypeId: 'kitchen',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'sofa',
    name: 'Sofa',
    icon: 'Armchair',
    description: 'Create comfortable seating solutions for your living space',
    materials: [
      {
        id: 'leather',
        name: 'Leather',
        ratePerSqft: 1900.00,
        projectTypeId: 'sofa',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'fabric',
        name: 'Fabric',
        ratePerSqft: 1368.00,
        projectTypeId: 'sofa',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'bedroom',
    name: 'Bedroom',
    icon: 'Bed',
    description: 'Design bedroom furniture including wardrobes and bed frames',
    materials: [
      {
        id: 'pine-wood',
        name: 'Pine Wood',
        ratePerSqft: 760.00,
        projectTypeId: 'bedroom',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'mdf',
        name: 'MDF',
        ratePerSqft: 494.00,
        projectTypeId: 'bedroom',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];