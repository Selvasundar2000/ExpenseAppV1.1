// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dtmpcigbofeutdrwpkow.supabase.co'   // ← from Supabase dashboard
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0bXBjaWdib2ZldXRkcndwa293Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4MDYwNjUsImV4cCI6MjA2MzM4MjA2NX0.5L8qpq4iK7rauqJCse4Laa5RAGHbT1LWRHpKPB9a6a4'                         // ← from Supabase dashboard

export const supabase = createClient(supabaseUrl, supabaseKey)
