import { z } from "zod"

// generated using https://transform.tools/typescript-to-zod

export const clipTypeSchema = z.object({
  name: z.string(),
  duration: z.number(),
  path: z.string().optional(),
  url: z.string()
})

export const memoryClipTransitionTypeSchema = z.object({
  type: z.string(),
  start: z.number(),
  stop: z.number(),
  duration: z.number()
})

export const effectTypeSchema = z.object({
  type: z.string(),
  duration: z.number().optional(),
  start: z.number(),
  stop: z.number().optional()
})

export const audioTypeSchema = z.object({
  name: z.string(),
  path: z.string(),
  url: z.string()
})

export const memoryClipTypeSchema = z.object({
  uid: z.string(),
  name: z.string(),
  start: z.number(),
  stop: z.number(),
  duration: z.number(),
  clip: clipTypeSchema,
  transition: memoryClipTransitionTypeSchema.optional()
})

export const memoryTypeSchema = z.object({
  clips: z.array(memoryClipTypeSchema),
  duration: z.number(),
  fadeIn: effectTypeSchema.optional(),
  fadeOut: effectTypeSchema.optional(),
  audio: audioTypeSchema.optional(),
  effectsTimeline: z.array(effectTypeSchema).optional()
})