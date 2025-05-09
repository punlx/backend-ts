export const PrismaClient = jest.fn().mockImplementation(() => ({
  user: {
    create: jest.fn(),
    findUnique: jest.fn(),
  },
  todo: {
    // เพิ่มเติมตามที่ใช้งาน
  },
}));
