BEGIN;

-- Preserva saldos antigos até a correção pelo Estoque e impede novos saldos negativos.
ALTER TABLE public.products
  ADD CONSTRAINT products_stock_nonnegative CHECK (stock_quantity >= 0) NOT VALID;

ALTER TABLE public.sale_items
  ADD COLUMN IF NOT EXISTS item_type text,
  ADD COLUMN IF NOT EXISTS description text;

CREATE OR REPLACE FUNCTION public.update_stock_after_sale()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  IF NEW.quantity IS NULL OR NEW.quantity <= 0 THEN
    RAISE EXCEPTION USING ERRCODE = '22023', MESSAGE = 'Informe uma quantidade inteira maior que zero.';
  END IF;

  IF NEW.product_id IS NOT NULL THEN
    UPDATE public.products
    SET stock_quantity = stock_quantity - NEW.quantity
    WHERE id = NEW.product_id AND is_active AND stock_quantity >= NEW.quantity;

    IF NOT FOUND THEN
      RAISE EXCEPTION USING ERRCODE = 'P0001',
        MESSAGE = format('Estoque insuficiente ou produto indisponível: %s.', NEW.description);
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_update_stock_after_sale ON public.sale_items;
CREATE TRIGGER trigger_update_stock_after_sale
  AFTER INSERT ON public.sale_items
  FOR EACH ROW EXECUTE FUNCTION public.update_stock_after_sale();

CREATE OR REPLACE FUNCTION public.register_sale(
  p_sale_id uuid,
  p_customer_id uuid,
  p_payment_method text,
  p_discount numeric,
  p_items jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE
  item record;
  item_name text;
  item_price numeric;
  subtotal_amount numeric := 0;
  discount_amount numeric := round(p_discount, 2);
  sale_total numeric;
  -- O script de criação usa total/discount e transaction_date. O cliente anterior
  -- também foi distribuído com os nomes total_amount/discount_amount e date.
  uses_total_amount boolean := EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'sales' AND column_name = 'total_amount'
  );
  uses_cash_flow_date boolean := EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'cash_flow' AND column_name = 'date'
  );
BEGIN
  IF p_discount IS NULL OR p_discount < 0 OR p_discount >= 'Infinity'::numeric THEN
    RAISE EXCEPTION USING ERRCODE = '22023', MESSAGE = 'Informe um desconto válido.';
  END IF;

  IF jsonb_typeof(p_items) IS DISTINCT FROM 'array' THEN
    RAISE EXCEPTION USING ERRCODE = '22023', MESSAGE = 'Informe os itens da venda.';
  END IF;

  IF jsonb_array_length(p_items) = 0 THEN
    RAISE EXCEPTION USING ERRCODE = '22023', MESSAGE = 'Adicione pelo menos um item à venda.';
  END IF;

  -- O ID enviado pelo cliente permite repetir a mesma solicitação após uma falha de conexão.
  IF uses_total_amount THEN
    INSERT INTO public.sales (id, customer_id, payment_method, status, total_amount, discount_amount)
    VALUES (p_sale_id, p_customer_id, p_payment_method, 'completed', 0, discount_amount)
    ON CONFLICT (id) DO NOTHING;
  ELSE
    INSERT INTO public.sales (id, customer_id, payment_method, status, total, discount)
    VALUES (p_sale_id, p_customer_id, p_payment_method, 'completed', 0, discount_amount)
    ON CONFLICT (id) DO NOTHING;
  END IF;

  IF NOT FOUND THEN
    RETURN;
  END IF;

  -- Adquire os bloqueios de estoque na mesma ordem em vendas concorrentes.
  FOR item IN
    SELECT *
    FROM jsonb_to_recordset(p_items) AS line(product_id uuid, service_id uuid, quantity integer)
    ORDER BY line.product_id
  LOOP
    IF (item.product_id IS NULL) = (item.service_id IS NULL)
      OR item.quantity IS NULL OR item.quantity <= 0 THEN
      RAISE EXCEPTION USING ERRCODE = '22023', MESSAGE = 'Informe um item e uma quantidade inteira maior que zero.';
    END IF;

    IF item.product_id IS NOT NULL THEN
      SELECT name, sale_price INTO item_name, item_price
      FROM public.products WHERE id = item.product_id AND is_active;
    ELSE
      SELECT name, price INTO item_name, item_price
      FROM public.services WHERE id = item.service_id AND is_active;
    END IF;

    IF NOT FOUND THEN
      RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Um dos itens da venda está indisponível.';
    END IF;

    INSERT INTO public.sale_items (sale_id, product_id, service_id, item_type, description, quantity, unit_price, total_price)
    VALUES (p_sale_id, item.product_id, item.service_id,
      CASE WHEN item.product_id IS NOT NULL THEN 'product' ELSE 'service' END,
      item_name, item.quantity, item_price, item.quantity * item_price);

    subtotal_amount := subtotal_amount + item.quantity * item_price;
  END LOOP;

  sale_total := greatest(0, subtotal_amount - discount_amount);

  IF uses_total_amount THEN
    UPDATE public.sales SET total_amount = sale_total WHERE id = p_sale_id;
  ELSE
    UPDATE public.sales SET subtotal = subtotal_amount, total = sale_total WHERE id = p_sale_id;
  END IF;

  IF NOT FOUND THEN
    RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Não foi possível confirmar a venda.';
  END IF;

  IF uses_cash_flow_date THEN
    INSERT INTO public.cash_flow (type, category, description, amount, date, reference_type, reference_id)
    VALUES ('income', 'Venda', 'Venda #' || left(p_sale_id::text, 8), sale_total,
      (now() AT TIME ZONE 'America/Sao_Paulo')::date, 'sale', p_sale_id);
  ELSE
    INSERT INTO public.cash_flow (type, category, description, amount, reference_type, reference_id)
    VALUES ('income', 'Venda', 'Venda #' || left(p_sale_id::text, 8), sale_total, 'sale', p_sale_id);
  END IF;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.register_sale(uuid, uuid, text, numeric, jsonb) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.register_sale(uuid, uuid, text, numeric, jsonb) TO authenticated;

NOTIFY pgrst, 'reload schema';

COMMIT;
