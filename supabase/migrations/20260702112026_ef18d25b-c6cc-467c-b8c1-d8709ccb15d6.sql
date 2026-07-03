
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TABLE public.pricing_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price text NOT NULL,
  features text[] NOT NULL DEFAULT '{}',
  is_popular boolean NOT NULL DEFAULT false,
  cta_label text,
  sort_order integer NOT NULL DEFAULT 0,
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.pricing_packages TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.pricing_packages TO authenticated;
GRANT ALL ON public.pricing_packages TO service_role;

ALTER TABLE public.pricing_packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view enabled packages"
  ON public.pricing_packages FOR SELECT
  USING (enabled = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert packages"
  ON public.pricing_packages FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update packages"
  ON public.pricing_packages FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete packages"
  ON public.pricing_packages FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_pricing_packages_updated_at
  BEFORE UPDATE ON public.pricing_packages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.pricing_packages (name, price, features, is_popular, sort_order) VALUES
('Starter', '৳46,000', ARRAY['5-page custom website','Mobile responsive','Basic SEO setup','1 month support','Contact form'], false, 1),
('Growth', '৳80,000', ARRAY['10-page website','Advanced SEO','Facebook Ads setup','Content calendar','3 months support','Analytics dashboard'], true, 2),
('Dominator', '৳1,90,000', ARRAY['Full e-commerce site','SEO + Ads + Social','Custom branding','6 months management','Priority support','Conversion optimization'], false, 3);
