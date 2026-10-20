import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config/index.js';
import { AlternativeExerciseResponse, AlternativeExerciseResponseSchema } from '../schemas/index.js';

// Local curated fallbacks by target muscle
const LOCAL_FALLBACKS: Record<string, AlternativeExerciseResponse[]> = {
  pecho: [
    {
      exerciseName: 'Flexiones / Push-ups Deficit',
      targetMuscle: 'Pecho',
      reasonForAlternative: 'Alternativa inmediata de peso corporal con máxima activación pectoral sin necesidad de máquinas.',
      recommendedSets: 4,
      recommendedReps: '12-15',
      equipmentNeeded: 'Suelo o discos para elevación',
      executionTip: 'Baja en 3 segundos controlados sintiendo la apertura del pecho y empuja con fuerza juntando las manos mentalmente.',
    },
    {
      exerciseName: 'Press con Mancuernas en Suelo (Floor Press)',
      targetMuscle: 'Pecho',
      reasonForAlternative: 'Sustituto directo para press de banca que protege los hombros y no requiere banco.',
      recommendedSets: 4,
      recommendedReps: '10-12',
      equipmentNeeded: 'Par de mancuernas',
      executionTip: 'Haz una pausa de 1 segundo cuando los codos rocen el suelo antes de empujar verticalmente.',
    },
    {
      exerciseName: 'Aperturas / Flyes con Mancuernas en Suelo',
      targetMuscle: 'Pecho',
      reasonForAlternative: 'Aislamiento pectoral sin ocupar bancos ni cruce de poleas.',
      recommendedSets: 3,
      recommendedReps: '12-15',
      equipmentNeeded: 'Mancuernas ligeras',
      executionTip: 'Mantén una ligera flexión en los codos y concéntrate en apretar el pecho en la parte superior.',
    },
  ],
  espalda: [
    {
      exerciseName: 'Remo Unilateral con Mancuerna',
      targetMuscle: 'Espalda',
      reasonForAlternative: 'Máxima activación del dorsal ancho sin depender de la polea ni máquina de remo.',
      recommendedSets: 4,
      recommendedReps: '10-12',
      equipmentNeeded: '1 mancuerna y apoyo/banco',
      executionTip: 'Lleva la mancuerna hacia la cadera, manteniendo la espalda recta y sin rotar el torso.',
    },
    {
      exerciseName: 'Remo Invertido en Barra Baja / TRX',
      targetMuscle: 'Espalda',
      reasonForAlternative: 'Excelente constructor de densidad para espalda media y dorsales con peso corporal.',
      recommendedSets: 4,
      recommendedReps: '10-12',
      equipmentNeeded: 'Barra en rack o anillas/TRX',
      executionTip: 'Mantén el cuerpo rígido en plancha y jala el pecho hacia la barra apretando escápulas.',
    },
    {
      exerciseName: 'Pullover con Mancuerna',
      targetMuscle: 'Espalda',
      reasonForAlternative: 'Estiramiento profundo del dorsal sustituyendo jalones en polea.',
      recommendedSets: 3,
      recommendedReps: '12-15',
      equipmentNeeded: '1 mancuerna',
      executionTip: 'Baja los brazos extendidos detrás de la cabeza sintiendo cómo se abren los dorsales.',
    },
  ],
  pierna: [
    {
      exerciseName: 'Sentadilla Búlgara con Mancuernas',
      targetMuscle: 'Pierna',
      reasonForAlternative: 'Estímulo brutal en cuádriceps y glúteos sin necesidad de rack de sentadilla ni prensa.',
      recommendedSets: 3,
      recommendedReps: '10-12 por pierna',
      equipmentNeeded: 'Mancuernas y un banco/soporte bajo',
      executionTip: 'Desciende verticalmente cargando el 85% del peso en el talón de la pierna delantera.',
    },
    {
      exerciseName: 'Goblet Squat (Sentadilla Copa)',
      targetMuscle: 'Pierna',
      reasonForAlternative: 'Sustituto rápido y seguro de sentadilla con barra y prensa de piernas.',
      recommendedSets: 4,
      recommendedReps: '12-15',
      equipmentNeeded: '1 mancuerna o kettlebell',
      executionTip: 'Sujeta la mancuerna contra el esternón y baja profundo manteniendo el torso erguido.',
    },
    {
      exerciseName: 'Peso Muerto Rumano con Mancuernas',
      targetMuscle: 'Pierna',
      reasonForAlternative: 'Aislamiento directo de isquiotibiales y glúteos libre de máquinas.',
      recommendedSets: 4,
      recommendedReps: '10-12',
      equipmentNeeded: 'Par de mancuernas',
      executionTip: 'Empuja la cadera hacia atrás manteniendo las rodillas semi-rígidas y la espalda neutra.',
    },
  ],
  hombro: [
    {
      exerciseName: 'Press Militar de Pie con Mancuernas',
      targetMuscle: 'Hombro',
      reasonForAlternative: 'Constructor de deltoides anterior y lateral sin esperar banco de press.',
      recommendedSets: 4,
      recommendedReps: '10-12',
      equipmentNeeded: 'Par de mancuernas',
      executionTip: 'Empuja con fuerza vertical sin arquear la zona lumbar, contrayendo glúteos y core.',
    },
    {
      exerciseName: 'Elevaciones Laterales con Mancuerna Inclinado',
      targetMuscle: 'Hombro',
      reasonForAlternative: 'Tensión constante en deltoides lateral sin depender de polea.',
      recommendedSets: 4,
      recommendedReps: '12-15',
      equipmentNeeded: 'Par de mancuernas ligeras',
      executionTip: 'Guía el movimiento con los codos ligeramente por delante del torso, sin dar tirones.',
    },
    {
      exerciseName: 'Pájaros / Face Pull con Mancuernas',
      targetMuscle: 'Hombro',
      reasonForAlternative: 'Activación del deltoides posterior para equilibrio y salud articular.',
      recommendedSets: 3,
      recommendedReps: '15',
      equipmentNeeded: 'Mancuernas ligeras',
      executionTip: 'Flexiona el torso 45 grados y eleva los codos hacia afuera apretando atrás.',
    },
  ],
  brazo: [
    {
      exerciseName: 'Curl Martillo con Mancuernas',
      targetMuscle: 'Brazo',
      reasonForAlternative: 'Desarrollo de braquial y antebrazo sin necesitar barra Z ni poleas.',
      recommendedSets: 3,
      recommendedReps: '10-12',
      equipmentNeeded: 'Par de mancuernas',
      executionTip: 'Agarre neutro (palmas enfrentadas) y sube de forma estricta sin balancear los hombros.',
    },
    {
      exerciseName: 'Fondos en Paralelas o Banco (Dips)',
      targetMuscle: 'Brazo',
      reasonForAlternative: 'Constructor masivo de tríceps usando peso corporal.',
      recommendedSets: 4,
      recommendedReps: '10-15',
      equipmentNeeded: 'Barras paralelas o banco',
      executionTip: 'Mantén los codos pegados al cuerpo y baja hasta 90 grados antes de empujar.',
    },
    {
      exerciseName: 'Extensión de Tríceps Copa a Dos Manos',
      targetMuscle: 'Brazo',
      reasonForAlternative: 'Enfoca la cabeza larga del tríceps con una sola mancuerna.',
      recommendedSets: 3,
      recommendedReps: '12-15',
      equipmentNeeded: '1 mancuerna',
      executionTip: 'Mantén los codos apuntando hacia adelante y extiende completamente arriba.',
    },
  ],
  core: [
    {
      exerciseName: 'Hollow Body Hold / Plancha Dinámica',
      targetMuscle: 'Core',
      reasonForAlternative: 'Tensión isométrica profunda de la pared abdominal sin máquinas.',
      recommendedSets: 4,
      recommendedReps: '30-45 seg',
      equipmentNeeded: 'Esterilla o suelo',
      executionTip: 'Pega la zona lumbar completamente al suelo mientras extiendes piernas y brazos.',
    },
    {
      exerciseName: 'Elevación de Piernas Colgado o en Suelo',
      targetMuscle: 'Core',
      reasonForAlternative: 'Enfoque en recto abdominal inferior sin peso adicional.',
      recommendedSets: 3,
      recommendedReps: '12-15',
      equipmentNeeded: 'Barra o esterilla',
      executionTip: 'Controla la bajada sin balanceo para evitar usar los flexores de cadera.',
    },
  ],
};

function getLocalFallback(targetMuscle: string, exerciseName: string): AlternativeExerciseResponse {
  const normalizedMuscle = targetMuscle.toLowerCase().trim();
  const options = LOCAL_FALLBACKS[normalizedMuscle] || LOCAL_FALLBACKS['pecho'];
  
  // Choose an option that is not the same name
  const filtered = options.filter(
    (opt) => !opt.exerciseName.toLowerCase().includes(exerciseName.toLowerCase())
  );
  const choice = filtered.length > 0 ? filtered[Math.floor(Math.random() * filtered.length)] : options[0];

  return {
    ...choice,
    targetMuscle: targetMuscle || choice.targetMuscle,
  };
}

export async function generateAlternativeExercise(
  exerciseName: string,
  targetMuscle: string,
  reason: string = 'Máquina ocupada'
): Promise<AlternativeExerciseResponse> {
  // If no Gemini API key configured, use local curated fallback instantly
  if (!config.geminiApiKey || config.geminiApiKey.trim() === '') {
    return getLocalFallback(targetMuscle, exerciseName);
  }

  // Attempt Gemini API call with strict 3-second timeout
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Gemini API timeout (3s limit reached)')), 3000)
  );

  const fetchPromise = (async () => {
    const genAI = new GoogleGenerativeAI(config.geminiApiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.4,
      },
    });

    const prompt = `
Eres un entrenador de fuerza de élite en el gimnasio.
El usuario está entrenando el grupo muscular "${targetMuscle}" y su ejercicio asignado es "${exerciseName}".
Sin embargo, el equipo está ocupado o no disponible (${reason}).

Sugiere UN ejercicio alternativo excelente y equivalente para el mismo grupo muscular (${targetMuscle}) usando preferiblemente mancuernas, barras libres o peso corporal.

DEBES responder con un JSON válido que cumpla estrictamente con esta estructura:
{
  "exerciseName": "Nombre específico del ejercicio alternativo",
  "targetMuscle": "${targetMuscle}",
  "reasonForAlternative": "Explicación breve de por qué es un sustituto biomecánico ideal",
  "recommendedSets": 3 o 4 (número entero),
  "recommendedReps": "10-12" (rango en string),
  "equipmentNeeded": "Equipamiento necesario (ej. Par de mancuernas)",
  "executionTip": "1 consejo táctico de ejecución clave para sentir el músculo"
}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsed = JSON.parse(text);
    return AlternativeExerciseResponseSchema.parse(parsed);
  })();

  try {
    const result = await Promise.race([fetchPromise, timeoutPromise]);
    return result;
  } catch (err) {
    console.warn('[AI Service] Gemini API call failed or timed out. Falling back to local catalog:', (err as Error).message);
    return getLocalFallback(targetMuscle, exerciseName);
  }
}
