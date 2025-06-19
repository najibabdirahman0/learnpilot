/*
  # Add Mock Interview Tables

  1. New Tables
    - `mock_interviews`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `interviewer_type` (text, enum: friendly, professional, expert)
      - `job_description` (text, optional)
      - `cv_content` (text, optional)
      - `status` (text, enum: in_progress, completed)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `interview_feedback`
      - `id` (uuid, primary key)
      - `interview_id` (uuid, foreign key to mock_interviews)
      - `score` (integer, 0-100)
      - `feedback` (jsonb)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
*/

-- Create mock_interviews table
CREATE TABLE IF NOT EXISTS mock_interviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  interviewer_type text NOT NULL CHECK (interviewer_type IN ('friendly', 'professional', 'expert')),
  job_description text,
  cv_content text,
  status text NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create interview_feedback table
CREATE TABLE IF NOT EXISTS interview_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  interview_id uuid REFERENCES mock_interviews(id) NOT NULL,
  score integer CHECK (score >= 0 AND score <= 100),
  feedback jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE mock_interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_feedback ENABLE ROW LEVEL SECURITY;

-- Create policies for mock_interviews
CREATE POLICY "Users can create their own mock interviews"
  ON mock_interviews
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own mock interviews"
  ON mock_interviews
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own mock interviews"
  ON mock_interviews
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for interview_feedback
CREATE POLICY "Users can view their interview feedback"
  ON interview_feedback
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM mock_interviews
    WHERE mock_interviews.id = interview_feedback.interview_id
    AND mock_interviews.user_id = auth.uid()
  ));

CREATE POLICY "Users can create interview feedback"
  ON interview_feedback
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM mock_interviews
    WHERE mock_interviews.id = interview_feedback.interview_id
    AND mock_interviews.user_id = auth.uid()
  ));