import { defineCollection, z } from 'astro:content';

const dishes = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    restaurant: z.string(),
    rating: z.number().min(0).max(5),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    image: z.string(),
    locations: z.array(z.string().regex(/^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/))
  })
});

export const collections = { dishes };
