# AppFit 🏋️‍♂️✨
> **Asistente de Entrenamiento Inteligente Mobile-First**  
> Desarrollado bajo especificación técnica rigurosa (PRD, TRD, PLAN, USER FLOW).

---

## 🌟 Características Principales del MVP

1. **Acceso Táctil con PIN de 4 Dígitos (`HU-01`)**:
   - Teclado numérico táctil optimizado para móvil.
   - Acceso inmediato al ingresar el 4to dígito correcto (**PIN por defecto: `1234`**).
   - Animación de vibración visual (*shake*) ante errores.

2. **Prescripción Inteligente de Rutina Diaria (`HU-02`)**:
   - Detección automática del día de la semana y prescripción del grupo muscular ideal (Split semanal).
   - Selector táctil para cambiar libremente de músculo (Pecho, Espalda, Pierna, Hombro, Brazo, Core).
   - Catálogo de ejercicios enriquecido con instrucciones técnicas, imágenes e historial.

3. **Alternativa Asistida por IA ante Máquinas Ocupadas (`HU-03`)**:
   - Botón táctil **"Alternativa IA"** en cada ejercicio.
   - Integración con **Google Gemini API** (BFF seguro) con validación estricta Zod y tiempo de espera límite de 3 segundos.
   - Fallback de contingencia automático con ejercicios libres de peso corporal o mancuernas.

4. **Registro Táctil de Series, Reps y Peso (`HU-04`)**:
   - Botones táctiles grandes de incremento y decremento (`+` y `-`) de 44px+ para uso con una sola mano.
   - Marcado de series con confirmación táctil y pulso verde esmeralda.
   - **Persistencia Anti-Cierre (Crash-Proof)**: Guarda el estado instantáneamente en `localStorage` y en la base de datos SQLite.

5. **Celebración y Métricas Mensuales (`HU-05`)**:
   - Lluvia de confeti al completar el entrenamiento.
   - Resumen total de ejercicios, series y volumen levantado (kg).
   - Contador de consistencia mensual (ej. *"5 / 20 días entrenados este mes"*).
   - Gráfico de balance de grupos musculares trabajados.

---

## 🚀 Cómo Ejecutar la Aplicación

### Requisitos Previos
- Node.js v18+ instalado.

### 1. Iniciar Servidor Backend (BFF + SQLite)
```bash
cd server
npm install
npx prisma db push
npm run prisma:seed
npm run dev
```
El servidor backend se ejecutará en: `http://localhost:3001` con endpoint de salud en `http://localhost:3001/health`.

### 2. Iniciar Cliente Frontend (React + Vite)
```bash
cd client
npm install
npm run dev
```
La aplicación web se ejecutará en: `http://localhost:5173/` con proxy automático configurado hacia el backend.

---

## 🔐 Configuración de Variables de Entorno (`server/.env`)

| Variable | Descripción | Valor por Defecto |
| :--- | :--- | :--- |
| `PORT` | Puerto del servidor backend | `3001` |
| `DATABASE_URL` | Conexión SQLite | `"file:./dev.db"` |
| `APP_PIN` | PIN numérico de 4 dígitos | `1234` |
| `GEMINI_API_KEY` | Clave API de Google Gemini (Opcional, cuenta con fallback local) | `""` |
