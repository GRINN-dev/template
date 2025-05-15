import { z } from "zod";

export const ContactSchema = z.object({
  id: z.string(),
  firstname: z.string().optional(),
  lastname: z.string().optional(),
  avatarColor: z.string().optional(),
  avatarUrl: z.string().optional(),
});

export const createForm = z.object({
  visibility: z.enum(["ALLOPEN", "OPENTEAM", "PRIVATE"], {
    message: "Veuillez choisir une visibilité",
  }),
  sport: z.string({ message: "Le sport est obligatoire" }),
  title: z.string({ message: "Inscrivez un nom d'activité" }),
  description: z
    .string({
      message: "La description est obligatoire",
    })
    .max(240, {
      message: "La description ne doit pas dépasser 240 caractères",
    }),
  date: z.date({ message: "Choisissez une date" }),
  time: z.date({ message: "Choisissez une heure" }),
  invitedUsers: z.array(ContactSchema).optional(),
  isClosed: z.boolean().optional(),
  maxParticipants: z.number().optional(),
});
