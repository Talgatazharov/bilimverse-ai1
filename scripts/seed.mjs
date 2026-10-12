import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 BILIMVERSE AI дерекқорын толтыру (Seeding database)...');

  // 1. Create or upsert Subjects
  const subjects = [
    {
      id: 'math',
      name: 'Математика',
      realmName: 'Сандар патшалығы',
      description: 'Алтын қамал, сандар монументтері және логикалық көпірлер',
      icon: 'Calculator',
      bgImage: '/world/regions/sandar-patshalygy.png',
      color: '#f59e0b',
      order: 1,
    },
    {
      id: 'kazakh',
      name: 'Қазақ тілі',
      realmName: 'Сөздер орманы',
      description: 'Сиқырлы алып Бәйтерек, жарқыраған сөздер мен әріптер бұлағы',
      icon: 'Feather',
      bgImage: '/world/regions/sozder-ormany.png',
      color: '#10b981',
      order: 2,
    },
    {
      id: 'literature',
      name: 'Әдебиеттік оқу',
      realmName: 'Ертегілер елі',
      description: 'Қазақ ауылы, киіз үйлер, тұлпарлар және батырлар дастаны',
      icon: 'BookOpen',
      bgImage: '/world/regions/ertegiler-eli.png',
      color: '#e11d48',
      order: 3,
    },
    {
      id: 'science',
      name: 'Жаратылыстану',
      realmName: 'Табиғат ғажайыптары',
      description: 'Сарқырамалар, сиқырлы зертхана мен жануарлар әлемі',
      icon: 'Compass',
      bgImage: '/world/regions/zertteushiler-araly.png',
      color: '#06b6d4',
      order: 4,
    },
    {
      id: 'world',
      name: 'Дүниетану',
      realmName: 'Зерттеушілер аралы',
      description: 'Жер шары, обсерватория және Ұлы Дала тарихы',
      icon: 'Globe2',
      bgImage: '/world/regions/zertteushiler-araly.png',
      color: '#84cc16',
      order: 5,
    },
    {
      id: 'english',
      name: 'Ағылшын тілі',
      realmName: 'English Town',
      description: 'Көне сағат мұнарасы бар еуропалық жарқын қалашық',
      icon: 'Languages',
      bgImage: '/world/regions/english-town.png',
      color: '#8b5cf6',
      order: 6,
    },
    {
      id: 'digital',
      name: 'Цифрлық сауаттылық',
      realmName: 'Digital City',
      description: 'Неонды көк мұнаралар, робот көмекшілер мен кибер-кеңістік',
      icon: 'Cpu',
      bgImage: '/world/regions/digital-city.png',
      color: '#0ea5e9',
      order: 7,
    },
  ];

  for (const s of subjects) {
    await prisma.subject.upsert({
      where: { id: s.id },
      update: s,
      create: s,
    });
  }
  console.log('✓ 7 Пән сәтті сақталды');

  // 2. Create Users (Teacher, Student, Parent, Admin)
  // Teacher
  const teacherUser = await prisma.user.upsert({
    where: { email: 'gulnur@bilimverse.kz' },
    update: {},
    create: {
      email: 'gulnur@bilimverse.kz',
      name: 'Гүлнұр апай',
      role: 'TEACHER',
      avatar: 'teacher-gulnur',
      teacherProfile: {
        create: {
          school: '№1 Астана Лицейі',
        },
      },
    },
    include: { teacherProfile: true },
  });

  // Classroom 3A
  let classroom = await prisma.classroom.findFirst({
    where: { name: '3А сыныбы' },
  });
  if (!classroom && teacherUser.teacherProfile) {
    classroom = await prisma.classroom.create({
      data: {
        name: '3А сыныбы',
        grade: 3,
        teacherId: teacherUser.teacherProfile.id,
      },
    });
  }

  // Student: Аян
  const studentUser = await prisma.user.upsert({
    where: { email: 'ayan@bilimverse.kz' },
    update: {},
    create: {
      email: 'ayan@bilimverse.kz',
      name: 'Аян Сейілхан',
      role: 'STUDENT',
      avatar: 'boy-explorer',
      studentProfile: {
        create: {
          grade: 3,
          xp: 1250,
          level: 7,
          currency: 340,
          streak: 6,
          avatarChoice: 'boy-explorer',
          title: 'Жас ғалым',
          petName: 'Қыран',
          petStage: 'explorer',
          petExp: 350,
          classroomId: classroom?.id,
        },
      },
    },
    include: { studentProfile: true },
  });

  // Parent: Айгүл
  await prisma.user.upsert({
    where: { email: 'aigul@bilimverse.kz' },
    update: {},
    create: {
      email: 'aigul@bilimverse.kz',
      name: 'Айгүл ханым',
      role: 'PARENT',
      avatar: 'parent-aigul',
      parentProfile: {
        create: {
          studentEmail: 'ayan@bilimverse.kz',
        },
      },
    },
  });

  // Admin
  await prisma.user.upsert({
    where: { email: 'admin@bilimverse.kz' },
    update: {},
    create: {
      email: 'admin@bilimverse.kz',
      name: 'Бас Әкімші',
      role: 'ADMIN',
      avatar: 'admin-shield',
    },
  });
  console.log('✓ Демо қолданушылар мен рөлдер құрылды (Student, Teacher, Parent, Admin)');

  // 3. Achievements
  const achievements = [
    {
      id: 'first_step',
      title: 'Алғашқы Қадам',
      description: 'BILIMVERSE әлеміндегі алғашқы миссияны сәтті орындадың.',
      category: 'general',
      icon: 'Footprints',
      xpReward: 50,
    },
    {
      id: 'math_bridge',
      title: 'Сандар Сәулетшісі',
      description: 'Сандар патшалығының логикалық көпір миссиясын аяқтадың.',
      category: 'math',
      icon: 'Calculator',
      xpReward: 100,
    },
    {
      id: 'streak_master',
      title: 'Жалынды Қатарлық',
      description: 'Қатарынан 5 күн бойы білім жинап, жалынды сөндірмедің.',
      category: 'streak',
      icon: 'Flame',
      xpReward: 150,
    },
  ];

  for (const a of achievements) {
    await prisma.achievement.upsert({
      where: { id: a.id },
      update: a,
      create: a,
    });
  }
  console.log('✓ Жетістіктер сақталды');

  console.log('🎉 BILIMVERSE AI дерекқоры сәтті толтырылды!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
