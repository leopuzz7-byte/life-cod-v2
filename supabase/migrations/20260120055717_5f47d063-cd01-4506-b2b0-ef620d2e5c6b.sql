-- Create enum for payment provider
CREATE TYPE public.payment_provider AS ENUM ('stripe', 'prodamus');

-- Create enum for purchase status
CREATE TYPE public.purchase_status AS ENUM ('pending', 'completed', 'failed', 'refunded');

-- Create table for analysis packages
CREATE TABLE public.analysis_packages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  credits INTEGER NOT NULL DEFAULT 1,
  price_rub INTEGER NOT NULL,
  price_usd INTEGER,
  stripe_price_id TEXT,
  prodamus_product_id TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for purchases (access tokens)
CREATE TABLE public.purchases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  access_token TEXT NOT NULL UNIQUE DEFAULT gen_random_uuid()::text,
  email TEXT NOT NULL,
  package_id UUID REFERENCES public.analysis_packages(id),
  credits_remaining INTEGER NOT NULL DEFAULT 0,
  provider payment_provider NOT NULL,
  provider_payment_id TEXT,
  status purchase_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for analysis results (stored after payment)
CREATE TABLE public.analysis_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  purchase_id UUID REFERENCES public.purchases(id) ON DELETE CASCADE,
  analysis_type TEXT NOT NULL,
  input_data JSONB NOT NULL,
  result_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.analysis_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_results ENABLE ROW LEVEL SECURITY;

-- Public can read active packages
CREATE POLICY "Anyone can view active packages"
ON public.analysis_packages
FOR SELECT
USING (is_active = true);

-- Purchases accessed via access_token (checked in edge functions)
CREATE POLICY "Service role only for purchases"
ON public.purchases
FOR ALL
USING (false);

-- Analysis results accessed via purchase (checked in edge functions)
CREATE POLICY "Service role only for results"
ON public.analysis_results
FOR ALL
USING (false);

-- Insert default packages
INSERT INTO public.analysis_packages (name, description, credits, price_rub, price_usd) VALUES
('1 разбор', 'Один полный разбор на выбор', 1, 299, 3),
('5 разборов', 'Пакет из 5 разборов со скидкой 20%', 5, 1199, 12),
('10 разборов', 'Пакет из 10 разборов со скидкой 30%', 10, 2099, 21),
('20 разборов', 'Пакет из 20 разборов со скидкой 40%', 20, 3599, 36);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_analysis_packages_updated_at
BEFORE UPDATE ON public.analysis_packages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_purchases_updated_at
BEFORE UPDATE ON public.purchases
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();