-- Jalankan sekali di Supabase → SQL Editor
-- Menambah kolom category pada tabel tech_stack

ALTER TABLE public.tech_stack
ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'Frontend Development';

-- Lepas constraint dulu agar baris lama bisa diperbaiki
ALTER TABLE public.tech_stack
DROP CONSTRAINT IF EXISTS tech_stack_category_check;

-- === Perbaiki data SEBELUM constraint baru ===

-- Nilai kategori lama (3 kategori)
UPDATE public.tech_stack SET category = 'Frontend Development' WHERE category = 'Development';
UPDATE public.tech_stack SET category = 'Tools & DevOps' WHERE category = 'Software';

-- Nilai salah (satu string panjang dari CHECK yang keliru)
UPDATE public.tech_stack
SET category = 'Frontend Development'
WHERE category LIKE '%,%';

-- Backfill berdasarkan nama (sesuaikan jika berbeda)
UPDATE public.tech_stack SET category = 'Frontend Development'
WHERE name IN (
  'HTML', 'CSS', 'JavaScript', 'Tailwind CSS', 'ReactJS', 'Vite', 'Bootstrap'
);

UPDATE public.tech_stack SET category = 'Backend Development'
WHERE name IN ('Node JS', 'Laravel 13');

UPDATE public.tech_stack SET category = 'Cloud & Backend Services'
WHERE name IN ('Firebase', 'Vercel');

-- Sisa baris yang masih di luar daftar → default aman
UPDATE public.tech_stack
SET category = 'Frontend Development'
WHERE category IS NULL
   OR trim(category) = ''
   OR category NOT IN (
     'Frontend Development',
     'Backend Development',
     'Database Management',
     'Mobile Development',
     'Design',
     'Cloud & Backend Services',
     'Tools & DevOps'
   );

-- === Baru pasang constraint setelah semua baris valid ===
ALTER TABLE public.tech_stack
ADD CONSTRAINT tech_stack_category_check
CHECK (category IN (
  'Frontend Development',
  'Backend Development',
  'Database Management',
  'Mobile Development',
  'Design',
  'Cloud & Backend Services',
  'Tools & DevOps'
));
