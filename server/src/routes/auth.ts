import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { config } from '../config/index.js';
import { VerifyPinSchema } from '../schemas/index.js';

export const authRouter = Router();

authRouter.post('/verify-pin', async (req: Request, res: Response): Promise<void> => {
  try {
    const parseResult = VerifyPinSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        message: parseResult.error.errors[0]?.message || 'PIN inválido',
      });
      return;
    }

    const { pin } = parseResult.data;

    // Compare with configured APP_PIN
    const isValid = pin === config.appPin;

    if (!isValid) {
      res.status(401).json({
        success: false,
        message: 'PIN incorrecto. Inténtalo de nuevo.',
      });
      return;
    }

    // In a personal app, returning a lightweight token or success flag
    res.json({
      success: true,
      token: 'session_appfit_authorized',
      user: {
        id: 'owner',
        name: 'Atleta',
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error interno de autenticación' });
  }
});
