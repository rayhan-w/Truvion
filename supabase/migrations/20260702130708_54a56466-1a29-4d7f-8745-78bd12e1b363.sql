ALTER TABLE public.team_members ALTER COLUMN sort_order SET DEFAULT 0;
UPDATE public.team_members SET sort_order = 0 WHERE sort_order IS NULL;