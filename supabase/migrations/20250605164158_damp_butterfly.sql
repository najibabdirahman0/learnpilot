/*
  # Study Buddy Database Schema

  1. New Tables
    - `study_sessions`
      - Stores user study sessions with AI
      - Tracks content, role type, and progress
    - `study_materials`
      - Stores uploaded study materials and content
      - Links to study sessions
    - `quiz_results`
      - Stores quiz attempts and scores
      - Links to study sessions

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create study_sessions table
CREATE TABLE IF NOT EXISTS study_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  ai_role text NOT NULL CHECK (ai_role IN ('lecturer', 'student', 'colleague')),
  study_type text NOT NULL CHECK (study_type IN ('file', 'book', 'custom')),
  status text NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create study_materials table
CREATE TABLE IF NOT EXISTS study_materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES study_sessions(id) NOT NULL,
  content text NOT NULL,
  file_name text,
  file_type text,
  created_at timestamptz DEFAULT now()
);

-- Create quiz_results table
CREATE TABLE IF NOT EXISTS quiz_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES study_sessions(id) NOT NULL,
  quiz_type text NOT NULL CHECK (quiz_type IN ('multiple', 'written')),
  score integer CHECK (score >= 0 AND score <= 100),
  feedback text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can create their own study sessions"
  ON study_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own study sessions"
  ON study_sessions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own study sessions"
  ON study_sessions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their study materials"
  ON study_materials
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM study_sessions
    WHERE study_sessions.id = study_materials.session_id
    AND study_sessions.user_id = auth.uid()
  ));

CREATE POLICY "Users can create study materials"
  ON study_materials
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM study_sessions
    WHERE study_sessions.id = study_materials.session_id
    AND study_sessions.user_id = auth.uid()
  ));

CREATE POLICY "Users can view their quiz results"
  ON quiz_results
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM study_sessions
    WHERE study_sessions.id = quiz_results.session_id
    AND study_sessions.user_id = auth.uid()
  ));

CREATE POLICY "Users can create quiz results"
  ON quiz_results
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM study_sessions
    WHERE study_sessions.id = quiz_results.session_id
    AND study_sessions.user_id = auth.uid()
  ));