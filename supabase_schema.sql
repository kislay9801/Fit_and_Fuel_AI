-- Fit & Fuel AI Coach - Supabase Database Schema
-- Run this in your Supabase SQL Editor

-- Sessions table
CREATE TABLE IF NOT EXISTS public.sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  exercise TEXT NOT NULL CHECK (exercise IN ('squat', 'pushup', 'deadlift')),
  form_score NUMERIC(5,2) NOT NULL CHECK (form_score >= 0 AND form_score <= 100),
  reps INTEGER DEFAULT 0,
  issues TEXT[] DEFAULT '{}',
  best_score NUMERIC(5,2),
  worst_score NUMERIC(5,2),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access their own sessions
CREATE POLICY "Users can view own sessions"
  ON public.sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions"
  ON public.sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own sessions"
  ON public.sessions FOR DELETE
  USING (auth.uid() = user_id);

-- Index for fast user queries
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON public.sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON public.sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_exercise ON public.sessions(exercise);
