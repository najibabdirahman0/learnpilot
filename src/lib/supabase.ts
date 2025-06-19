import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if environment variables are placeholder values
const isPlaceholder = (value: string) => {
  return !value || 
         value === 'your-project-url' || 
         value === 'your-anon-key' ||
         value.includes('your-') ||
         value === '';
};

// Declare supabase variable at module level
let supabase: any;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey || isPlaceholder(supabaseUrl) || isPlaceholder(supabaseAnonKey)) {
  console.warn('⚠️ Supabase not configured properly. Using mock mode.');
  console.warn('To connect to Supabase:');
  console.warn('1. Click "Connect to Supabase" button in the top right');
  console.warn('2. Or manually update your .env file with actual Supabase credentials');
  
  // Create a mock client that won't cause errors
  const mockClient = {
    auth: {
      signUp: async () => ({ data: null, error: new Error('Supabase not configured') }),
      signInWithPassword: async () => ({ data: null, error: new Error('Supabase not configured') }),
      signOut: async () => ({ error: new Error('Supabase not configured') }),
      getUser: async () => ({ data: { user: null }, error: new Error('Supabase not configured') })
    },
    from: () => ({
      insert: () => ({ select: () => ({ single: async () => ({ data: null, error: new Error('Supabase not configured') }) }) }),
      update: () => ({ eq: () => ({ select: () => ({ single: async () => ({ data: null, error: new Error('Supabase not configured') }) }) }) }),
      select: () => ({ eq: () => ({ order: async () => ({ data: null, error: new Error('Supabase not configured') }) }) })
    })
  };
  
  supabase = mockClient;
} else {
  // Validate URL format only if not a placeholder
  try {
    new URL(supabaseUrl);
  } catch (error) {
    console.error('Invalid Supabase URL format:', supabaseUrl);
    throw new Error(`Invalid Supabase URL format: ${supabaseUrl}. Please ensure VITE_SUPABASE_URL is a valid URL (e.g., https://your-project-ref.supabase.co)`);
  }

  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

// Study Session Functions
export const createStudySession = async (
  userId: string,
  aiRole: 'lecturer' | 'student' | 'colleague',
  studyType: 'file' | 'book' | 'custom'
) => {
  const { data, error } = await supabase
    .from('study_sessions')
    .insert({
      user_id: userId,
      ai_role: aiRole,
      study_type: studyType,
      status: 'in_progress'
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const uploadStudyMaterial = async (
  sessionId: string,
  content: string,
  fileName?: string,
  fileType?: string
) => {
  const { data, error } = await supabase
    .from('study_materials')
    .insert({
      session_id: sessionId,
      content,
      file_name: fileName,
      file_type: fileType
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const saveQuizResult = async (
  sessionId: string,
  quizType: 'multiple' | 'written',
  score: number,
  feedback: string
) => {
  const { data, error } = await supabase
    .from('quiz_results')
    .insert({
      session_id: sessionId,
      quiz_type: quizType,
      score,
      feedback
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateStudySessionStatus = async (
  sessionId: string,
  status: 'in_progress' | 'completed'
) => {
  const { data, error } = await supabase
    .from('study_sessions')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', sessionId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getUserStudySessions = async (userId: string) => {
  const { data, error } = await supabase
    .from('study_sessions')
    .select(`
      *,
      study_materials(*),
      quiz_results(*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

// Authentication Functions
export const signUp = async (email: string, password: string, userData: any) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData
    }
  });

  if (error) throw error;
  return data;
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};

// Mock Interview Functions
export const createMockInterview = async (
  userId: string,
  interviewerType: 'friendly' | 'professional' | 'expert',
  jobDescription?: string,
  cvContent?: string
) => {
  const { data, error } = await supabase
    .from('mock_interviews')
    .insert({
      user_id: userId,
      interviewer_type: interviewerType,
      job_description: jobDescription,
      cv_content: cvContent,
      status: 'in_progress'
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const saveInterviewFeedback = async (
  interviewId: string,
  score: number,
  feedback: any
) => {
  const { data, error } = await supabase
    .from('interview_feedback')
    .insert({
      interview_id: interviewId,
      score,
      feedback
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Export the supabase client
export { supabase };