# PRD: Documento de Requisitos de Producto (Product Requirements Document)
**Proyecto:** AppFit - Asistente de Entrenamiento Inteligente Mobile-First  
**Versión:** 1.0.0 (MVP)  
**Estado:** Aprobado  
**Fecha:** 2026-10-15  

---

## 1. Visión y Propósito del Producto

### 1.1 Declaración del Problema
Al acudir al gimnasio, los usuarios frecuentemente experimentan incertidumbre respecto a qué grupo muscular entrenar cada día, qué ejercicios específicos realizar, cómo sustituirlos ante máquinas ocupadas y cómo llevar un control confiable de la sobrecarga progresiva (pesos y repeticiones) y de su constancia mensual.

### 1.2 Propuesta de Valor
AppFit es una aplicación web *mobile-first* de uso personal que actúa como un asistente de entrenamiento diario. Sugiere el grupo muscular y la rutina recomendada para la jornada actual, ofrece sustitución de ejercicios asistida por Inteligencia Artificial (Gemini) ante imprevistos, permite el registro táctil ultra rápido de series y contabiliza automáticamente los días entrenados al mes con desglose por grupo muscular.

### 1.3 Objetivos de Negocio y Métricas de Éxito (KPIs)
- **Consistencia Mensual (KPI Principal):** Registrar y alcanzar la meta de días entrenados al mes (frecuencia mensual).
- **Equilibrio Muscular:** Distribución proporcional de sesiones mensuales por grupos musculares (ej. Pecho, Espalda, Pierna, Hombro, Brazo, Core).
- **Tiempo de Fricción en Registro:** Menos de 5 segundos requeridos para desbloquear con PIN y registrar una serie de repeticiones y peso.

---

## 2. Perfil de Usuarios y Roles

### 2.1 Perfil de Usuario
- **Usuario Atleta / Final (Uso Personal):** Usuario único que accede desde su smartphone en el gimnasio para consultar su rutina del día, registrar sus levantamientos y consultar su constancia mensual.

### 2.2 Roles y Seguridad (RBAC)
- **Rol Único:** `Usuario Propietario / Autenticado`.
- **Mecanismo de Acceso:** Desbloqueo rápido mediante **PIN numérico de 4 dígitos** desde cualquier dispositivo o navegador, con persistencia de sesión segura.

---

## 3. Historias de Usuario y Criterios de Aceptación (El "Qué" Funcional)

### HU-01: Acceso Rápido mediante PIN
- **Como** usuario en el gimnasio,  
  **quiero** desbloquear la aplicación introduciendo un PIN numérico de 4 dígitos en el teclado táctil en pantalla,  
  **para** proteger mis registros y acceder de inmediato a mi rutina sin tener que escribir correos ni contraseñas complejas.
- **Criterios de Aceptación:**
  - El teclado numérico debe ser 100% táctil, con botones de gran tamaño para móvil.
  - Al digitar el 4to dígito correcto, la aplicación debe redirigir inmediatamente a la pantalla del día sin botón extra de envío.
  - Si el PIN es incorrecto, debe ejecutarse una animación de vibración visual en los indicadores y permitir reintentar de inmediato.

### HU-02: Sugerencia Inteligente de la Rutina del Día
- **Como** usuario,  
  **quiero** que al abrir la app hoy se me indique automáticamente el grupo muscular a entrenar y los ejercicios recomendados,  
  **para** comenzar mi calentamiento sin perder tiempo decidiendo.
- **Criterios de Aceptación:**
  - La app debe identificar el día de la semana y sugerir el split correspondiente (o sugerir según los músculos menos trabajados en el mes).
  - Debe existir un selector rápido que permita al usuario cambiar de grupo muscular si decide entrenar otro músculo hoy.
  - Cada ejercicio de la lista debe mostrar su nombre, grupo muscular objetivo e imagen demostrativa.

### HU-03: Sustitución de Ejercicio con IA ante Máquina Ocupada
- **Como** usuario que encuentra una máquina o mancuerna ocupada,  
  **quiero** presionar un botón de "Pedir alternativa con IA",  
  **para** que el sistema me prescriba un ejercicio equivalente para el mismo grupo muscular.
- **Criterios de Aceptación:**
  - La tarjeta del ejercicio debe incluir un botón táctil destacado de "Alternativa IA".
  - La respuesta debe generar un ejercicio sustituto con su nombre, breve instrucción de ejecución y la imagen correspondiente.
  - Si no hay señal o la API de IA tarda más de 3 segundos, debe entrar en acción un fallback automático con alternativas precargadas locales.

### HU-04: Registro Táctil de Series, Repeticiones y Peso
- **Como** usuario durante una serie de entrenamiento,  
  **quiero** ingresar el peso levantado (kg/lbs) y las repeticiones logradas y marcar la serie como completada,  
  **para** llevar la bitácora exacta de mi entrenamiento y sobrecarga progresiva.
- **Criterios de Aceptación:**
  - Inputs numéricos con botones rápidos de incremento/decremento (+/-) optimizados para dedos sudorosos o uso con una sola mano.
  - Guardado en memoria local inmediato (crash-proof) al marcar una serie.
  - Capacidad de editar o desmarcar una serie completada si se cometió un error de tipeo.

### HU-05: Finalización y Métricas Mensuales
- **Como** usuario que terminó su rutina,  
  **quiero** presionar "Terminar entrenamiento" y ver mi resumen del día y del mes,  
  **para** motivarme y verificar el cumplimiento de mi meta de frecuencia.
- **Criterios de Aceptación:**
  - Pantalla de celebración visual con resumen de ejercicios y series completadas en la jornada.
  - Contador acumulativo: total de días entrenados en el mes en curso.
  - Gráfico o desglose de días entrenados por cada grupo muscular en el mes.

---

## 4. Límites, Restricciones y Exclusiones (El "No")

### 4.1 Restricciones Obligatorias
- **Mobile-First Estricto:** La interfaz debe estar diseñada primariamente para pantallas táctiles de smartphone (360px a 430px de ancho).
- **Modo Oscuro Obligatorio:** Paleta *Dark Mode* de alto contraste y baja fatiga visual para entornos de gimnasio.
- **Cero Dependencias Pesadas de Animación:** Interfaz reactiva, rápida y ligera, sin bibliotecas que degraden el rendimiento en dispositivos móviles.
- **Catálogo Visual de Ejercicios:** Cada ejercicio debe incluir soporte para imagen/ilustración descriptiva.

### 4.2 Exclusiones Explícitas (Fuera de Alcance)
- **NO Redes Sociales ni Feed Público:** La app es estrictamente de uso personal privado.
- **NO Planes Nutricionales ni Recetas:** Foco 100% en prescripción y seguimiento de ejercicio físico.
- **NO Visión Artificial ni Procesamiento de Video:** No se utilizará la cámara para corregir posturas o contar repeticiones.

---

## 5. Expectativas de Pruebas y Comportamientos Críticos

### 5.1 Persistencia Anti-Cierre (Crash-proof)
- Si el usuario bloquea el móvil, cambia de pestaña o se refresca el navegador por falta de memoria RAM del teléfono, la sesión de entrenamiento activa y las series marcadas deben recuperarse intactas desde el almacenamiento local.

### 5.2 Resiliencia ante Pérdida de Conexión
- Las funciones básicas de registro de series y consulta del catálogo deben operar sin requerir conexión permanente a internet.
- Las consultas de IA deben tener un tiempo de espera límite (*timeout*) de 3 segundos antes de activar sugerencias estáticas de contingencia.

### 5.3 Validaciones de Entrada
- Validación de que el peso y repeticiones sean números positivos (> 0).
- Prevención de duplicación accidental de series mediante bloqueo momentáneo de doble toque (*debounce* táctil).
