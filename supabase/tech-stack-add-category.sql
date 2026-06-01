-- Jalankan sekali di Supabase → SQL Editor
-- Menambah kolom category pada tabel tech_stack

ALTER TABLE public.tech_stack
ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'Development';

ALTER TABLE public.tech_stack
DROP CONSTRAINT IF EXISTS tech_stack_category_check;

ALTER TABLE public.tech_stack
ADD CONSTRAINT tech_stack_category_check
CHECK (category IN ('Development', 'Design', 'Software'));

-- Backfill data seed (sesuaikan jika nama berbeda)
UPDATE public.tech_stack SET category = 'Development'
WHERE name IN (
  'HTML', 'CSS', 'JavaScript', 'Tailwind CSS', 'ReactJS', 'Vite',
  'Node JS', 'Bootstrap', 'Laravel 13'
);

UPDATE public.tech_stack SET category = 'Software'
WHERE name IN ('Firebase', 'Vercel');
