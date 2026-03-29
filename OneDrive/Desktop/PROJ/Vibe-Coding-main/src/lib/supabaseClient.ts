import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  "https://yisdbhbcnmtfrulxinwi.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlpc2RiaGJjbm10ZnJ1bHhpbndpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5NDU2MjIsImV4cCI6MjA2ODUyMTYyMn0.aluz9APowBaUOHOsT-ifVnP6r8p5K7ib7QzHCvS_oNw"
);
