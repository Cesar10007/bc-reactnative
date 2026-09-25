import { z } from 'zod';

export const itemSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(80, 'El nombre no puede superar 80 caracteres'),

  description: z
    .string()
    .trim()
    .max(500, 'La descripción no puede superar 500 caracteres')
    .optional()
    .or(z.literal('')),

  price: z
    .string()
    .trim()
    .min(1, 'El precio es requerido')
    .refine((value) => !Number.isNaN(Number(value)), 'El precio debe ser un número válido')
    .refine((value) => Number(value) > 0, 'El precio debe ser mayor que 0')
    .refine(
      (value) => Number(value) <= 200000,
      'El precio no puede superar $200.000',
    ),

  flavor: z
    .string()
    .trim()
    .min(3, 'El sabor debe tener al menos 3 caracteres')
    .max(60, 'El sabor no puede superar 60 caracteres'),

  doughType: z.enum(['delgada', 'gruesa'], {
    error: 'Selecciona masa delgada o gruesa',
  }),
});

export type ItemFormData = z.infer<typeof itemSchema>;