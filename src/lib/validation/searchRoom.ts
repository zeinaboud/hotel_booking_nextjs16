import { z } from 'zod';
const today = new Date();
today.setHours(0, 0, 0, 0);

export const searchRoomSchema = z
  .object({
    checkIn: z.string().min(1, 'check-in date is required'),
    checkOut: z.string().min(1, 'check-out date is required'),
    type: z.enum(['SINGLE', 'DOUBLE', 'SUITE']).optional(),
  })
  .refine(
    (data) => {
      if (!data.checkIn) return true;
      const today = new Date(); // move inside
      today.setHours(0, 0, 0, 0);
      const ci = new Date(data.checkIn);
      return ci >= today;
    },
    {
      message: 'check-in date cannot be in the past',
      path: ['checkIn'],
    },
  )
  .refine(
    (data) => {
      const ci = new Date(data.checkIn);
      const co = new Date(data.checkOut);
      return co > ci;
    },
    {
      message: 'check-out date must be after check-in date',
      path: ['checkOut'],
    },
  );
export type SearchRoomForm = z.infer<typeof searchRoomSchema>;
