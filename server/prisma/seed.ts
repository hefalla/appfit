import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 [Seed] Limpiando datos antiguos...');
  await prisma.workoutSet.deleteMany();
  await prisma.workoutSession.deleteMany();
  await prisma.exercise.deleteMany();
  await prisma.muscleGroup.deleteMany();
  await prisma.user.deleteMany();

  console.log('👤 [Seed] Creando usuario propietario...');
  await prisma.user.create({
    data: {
      id: 'owner-user',
      pinHash: '1234', // default demo PIN
    },
  });

  console.log('💪 [Seed] Creando grupos musculares y catálogo de ejercicios...');

  const muscleData = [
    {
      name: 'pecho',
      displayName: 'Pecho',
      icon: 'Shield',
      displayOrder: 1,
      exercises: [
        {
          name: 'Press de Banca Plano con Barra',
          instructions: 'Recuéstate en el banco con los ojos alineados con la barra. Retrae escápulas y apoya los pies firmes. Desciende la barra controladamente al esternón medio y empuja explosivo.',
          defaultSets: 4,
          defaultReps: 10,
          defaultWeightKg: 60.0,
          defaultRestSeconds: 90,
          imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
        },
        {
          name: 'Press Inclinado con Mancuernas',
          instructions: 'Banco a 30 grados. Sube las mancuernas con las rodillas. Baja controlando la apertura en 3 segundos hasta sentir estiramiento en la porción clavicular y empuja convergiendo arriba.',
          defaultSets: 4,
          defaultReps: 10,
          defaultWeightKg: 24.0,
          defaultRestSeconds: 75,
          imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80',
        },
        {
          name: 'Fondos en Paralelas (Pecho)',
          instructions: 'Inclina el torso 30 grados hacia adelante con los codos abiertos. Desciende hasta formar un ángulo de 90 grados en los brazos y empuja focalizando en los pectorales.',
          defaultSets: 3,
          defaultReps: 12,
          defaultWeightKg: 0.0,
          defaultRestSeconds: 60,
          imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80',
        },
        {
          name: 'Aperturas en Polea / Cruce en Crossover',
          instructions: 'Coloca las poleas a la altura del hombro. Da un paso al frente y junta las manos frente al pecho describiendo un arco amplio. Aguanta 1 segundo de contracción máxima.',
          defaultSets: 3,
          defaultReps: 15,
          defaultWeightKg: 12.5,
          defaultRestSeconds: 60,
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&auto=format&fit=crop&q=80',
        },
      ],
    },
    {
      name: 'espalda',
      displayName: 'Espalda',
      icon: 'Layers',
      displayOrder: 2,
      exercises: [
        {
          name: 'Dominadas Pronas (Pull-ups)',
          instructions: 'Agarre un poco más ancho que los hombros. Inicia el movimiento deprimiendo las escápulas y lleva la parte alta del pecho hacia la barra. Desciende con control total.',
          defaultSets: 4,
          defaultReps: 8,
          defaultWeightKg: 0.0,
          defaultRestSeconds: 90,
          imageUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=600&auto=format&fit=crop&q=80',
        },
        {
          name: 'Remo con Barra Inclinado (Pendlay / 45°)',
          instructions: 'Espalda recta y paralela al suelo o a 45°. Jala la barra hacia el ombligo manteniendo los codos cerca del cuerpo. Aprieta los dorsales y escápulas en la cima.',
          defaultSets: 4,
          defaultReps: 10,
          defaultWeightKg: 50.0,
          defaultRestSeconds: 90,
          imageUrl: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=600&auto=format&fit=crop&q=80',
        },
        {
          name: 'Jalón al Pecho en Polea Alta',
          instructions: 'Pecho erguido con leve inclinación trasera. Jala la barra directo a la clavícula guiando con los codos hacia abajo. Regresa extendiendo completamente los dorsales.',
          defaultSets: 4,
          defaultReps: 12,
          defaultWeightKg: 55.0,
          defaultRestSeconds: 60,
          imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&auto=format&fit=crop&q=80',
        },
        {
          name: 'Remo Gironda en Polea Baja',
          instructions: 'Pies firmes en la plataforma. Mantén el torso perpendicular y jala el agarre hacia el abdomen bajo, retrayendo las escápulas con fuerza.',
          defaultSets: 3,
          defaultReps: 12,
          defaultWeightKg: 45.0,
          defaultRestSeconds: 60,
          imageUrl: 'https://images.unsplash.com/photo-1584466977773-e625c37cdd50?w=600&auto=format&fit=crop&q=80',
        },
      ],
    },
    {
      name: 'pierna',
      displayName: 'Pierna',
      icon: 'Activity',
      displayOrder: 3,
      exercises: [
        {
          name: 'Sentadilla Trasera con Barra (Squat)',
          instructions: 'Pies al ancho de hombros con puntas ligeramente hacia afuera. Baja la cadera rompiendo el paralelo, manteniendo el pecho erguido y las rodillas alineadas.',
          defaultSets: 4,
          defaultReps: 10,
          defaultWeightKg: 70.0,
          defaultRestSeconds: 120,
          imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&auto=format&fit=crop&q=80',
        },
        {
          name: 'Prensa de Piernas a 45°',
          instructions: 'Coloca los pies al centro de la plataforma. Baja con cadencia lenta sin que la zona lumbar se despegue del respaldo. Empuja empujando con talones.',
          defaultSets: 4,
          defaultReps: 12,
          defaultWeightKg: 140.0,
          defaultRestSeconds: 90,
          imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80',
        },
        {
          name: 'Peso Muerto Rumano (Isquios y Glúteo)',
          instructions: 'Sujeta la barra frente a los muslos. Empuja los glúteos hacia la pared de atrás manteniendo la espalda rígida hasta sentir el estiramiento en isquiotibiales.',
          defaultSets: 4,
          defaultReps: 10,
          defaultWeightKg: 60.0,
          defaultRestSeconds: 90,
          imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
        },
        {
          name: 'Extensión de Cuádriceps en Máquina',
          instructions: 'Alinea la rodilla con el eje de la máquina. Eleva las piernas extendiendo completamente y pausa 1 segundo en contracción máxima antes de bajar lento.',
          defaultSets: 3,
          defaultReps: 15,
          defaultWeightKg: 40.0,
          defaultRestSeconds: 60,
          imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80',
        },
      ],
    },
    {
      name: 'hombro',
      displayName: 'Hombro',
      icon: 'Target',
      displayOrder: 4,
      exercises: [
        {
          name: 'Press Militar de Pie con Barra (Overhead Press)',
          instructions: 'Agarre justo por fuera de los hombros. Glúteos y abdomen apretados. Empuja la barra en línea recta bloqueando los codos arriba sin balancear el cuerpo.',
          defaultSets: 4,
          defaultReps: 8,
          defaultWeightKg: 40.0,
          defaultRestSeconds: 90,
          imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80',
        },
        {
          name: 'Elevaciones Laterales con Mancuerna',
          instructions: 'Codos ligeramente flexionados. Eleva las mancuernas en el plano escapular (ligeramente adelante) hasta la altura de los hombros, bajando en 3 segundos.',
          defaultSets: 4,
          defaultReps: 15,
          defaultWeightKg: 10.0,
          defaultRestSeconds: 60,
          imageUrl: 'https://images.unsplash.com/photo-1584466977773-e625c37cdd50?w=600&auto=format&fit=crop&q=80',
        },
        {
          name: 'Face Pull con Cuerda en Polea Alta',
          instructions: 'Ajusta la polea a la altura del cuello. Jala la cuerda hacia la cara separando las manos y rotando los hombros hacia atrás. Excelente para postura y deltoides posterior.',
          defaultSets: 3,
          defaultReps: 15,
          defaultWeightKg: 20.0,
          defaultRestSeconds: 60,
          imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&auto=format&fit=crop&q=80',
        },
      ],
    },
    {
      name: 'brazo',
      displayName: 'Brazo',
      icon: 'Zap',
      displayOrder: 5,
      exercises: [
        {
          name: 'Curl de Bíceps con Barra Z',
          instructions: 'Codos pegados a los costados. Flexiona los brazos subiendo la barra sin mover los hombros. Aprieta el bíceps en el punto más alto y desciende con control.',
          defaultSets: 4,
          defaultReps: 10,
          defaultWeightKg: 25.0,
          defaultRestSeconds: 60,
          imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80',
        },
        {
          name: 'Press Francés con Mancuernas en Banco',
          instructions: 'Brazos perpendiculares al suelo. Flexiona los codos llevando las mancuernas hacia los lados de la cabeza y extiende los tríceps con fuerza.',
          defaultSets: 4,
          defaultReps: 10,
          defaultWeightKg: 12.0,
          defaultRestSeconds: 60,
          imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80',
        },
        {
          name: 'Curl Martillo Alterno con Mancuerna',
          instructions: 'Palmas enfrentadas en agarre neutro. Eleva alternadamente las mancuernas enfocando el braquial y antebrazo sin oscilar la espalda.',
          defaultSets: 3,
          defaultReps: 12,
          defaultWeightKg: 14.0,
          defaultRestSeconds: 60,
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&auto=format&fit=crop&q=80',
        },
        {
          name: 'Extensiones de Tríceps en Polea Alta',
          instructions: 'Codos bloqueados junto al torso. Empuja la barra o cuerda hacia abajo abriendo al final para exprimir la cabeza lateral y medial del tríceps.',
          defaultSets: 3,
          defaultReps: 15,
          defaultWeightKg: 25.0,
          defaultRestSeconds: 60,
          imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
        },
      ],
    },
    {
      name: 'core',
      displayName: 'Core y Estabilidad',
      icon: 'Compass',
      displayOrder: 6,
      exercises: [
        {
          name: 'Rueda Abdominal (Ab Wheel Rollout)',
          instructions: 'De rodillas, rueda hacia adelante manteniendo la espalda ligeramente encorvada y el abdomen contraído al 100%. Regresa jalando con los abdominales.',
          defaultSets: 3,
          defaultReps: 10,
          defaultWeightKg: 0.0,
          defaultRestSeconds: 60,
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop&q=80',
        },
        {
          name: 'Elevación de Piernas en Barra',
          instructions: 'Colgado de la barra sin balanceo. Eleva las rodillas o piernas estiradas hasta que los muslos toquen el pecho, controlando la bajada en 2 segundos.',
          defaultSets: 3,
          defaultReps: 12,
          defaultWeightKg: 0.0,
          defaultRestSeconds: 60,
          imageUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=600&auto=format&fit=crop&q=80',
        },
        {
          name: 'Plancha Abdominal con Toque de Hombros',
          instructions: 'Posición de flexión con pies ligeramente separados. Toca el hombro contrario alternadamente sin permitir que la cadera se mueva ni rote.',
          defaultSets: 3,
          defaultReps: 20,
          defaultWeightKg: 0.0,
          defaultRestSeconds: 45,
          imageUrl: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=600&auto=format&fit=crop&q=80',
        },
      ],
    },
  ];

  for (const group of muscleData) {
    const createdGroup = await prisma.muscleGroup.create({
      data: {
        name: group.name,
        displayName: group.displayName,
        icon: group.icon,
        displayOrder: group.displayOrder,
      },
    });

    for (const ex of group.exercises) {
      await prisma.exercise.create({
        data: {
          name: ex.name,
          instructions: ex.instructions,
          defaultSets: ex.defaultSets,
          defaultReps: ex.defaultReps,
          defaultWeightKg: ex.defaultWeightKg,
          defaultRestSeconds: ex.defaultRestSeconds,
          imageUrl: ex.imageUrl,
          muscleGroupId: createdGroup.id,
        },
      });
    }
  }

  // Pre-seed 3 past workout sessions in the current month to show immediate rich monthly stats!
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  
  // Create past dates
  const pastDates = [
    `${year}-${month}-02`,
    `${year}-${month}-05`,
    `${year}-${month}-08`,
    `${year}-${month}-12`,
    `${year}-${month}-16`,
  ];

  const allMuscles = await prisma.muscleGroup.findMany();
  for (let i = 0; i < pastDates.length; i++) {
    const m = allMuscles[i % allMuscles.length];
    await prisma.workoutSession.create({
      data: {
        userId: 'owner-user',
        muscleGroupId: m.id,
        date: pastDates[i],
        completed: true,
        durationMinutes: 48 + i * 3,
        totalSets: 14 + i,
        totalWeightKg: 3500 + i * 420,
      },
    });
  }

  console.log('✅ [Seed] Base de datos poblada exitosamente con ejercicios y sesiones previas.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
