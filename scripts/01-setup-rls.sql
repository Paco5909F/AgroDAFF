-- 1. Enable RLS on all tables
ALTER TABLE "empresas" ENABLE ROW LEVEL SECURITY;

-- SPLIT --

ALTER TABLE "miembros" ENABLE ROW LEVEL SECURITY;

-- SPLIT --

ALTER TABLE "usuarios" ENABLE ROW LEVEL SECURITY;

-- SPLIT --

ALTER TABLE "clientes" ENABLE ROW LEVEL SECURITY;

-- SPLIT --

ALTER TABLE "establecimientos" ENABLE ROW LEVEL SECURITY;

-- SPLIT --

ALTER TABLE "silos" ENABLE ROW LEVEL SECURITY;

-- SPLIT --

ALTER TABLE "movimientos_stock" ENABLE ROW LEVEL SECURITY;

-- SPLIT --

ALTER TABLE "lotes" ENABLE ROW LEVEL SECURITY;

-- SPLIT --

ALTER TABLE "servicios" ENABLE ROW LEVEL SECURITY;

-- SPLIT --

ALTER TABLE "ordenes_trabajo" ENABLE ROW LEVEL SECURITY;

-- SPLIT --

ALTER TABLE "orden_items" ENABLE ROW LEVEL SECURITY;

-- SPLIT --

ALTER TABLE "facturas" ENABLE ROW LEVEL SECURITY;

-- SPLIT --

ALTER TABLE "campanas" ENABLE ROW LEVEL SECURITY;

-- SPLIT --

ALTER TABLE "presupuestos" ENABLE ROW LEVEL SECURITY;

-- SPLIT --

ALTER TABLE "presupuesto_items" ENABLE ROW LEVEL SECURITY;

-- SPLIT --

ALTER TABLE "cartas_porte" ENABLE ROW LEVEL SECURITY;

-- SPLIT --

ALTER TABLE "invitations" ENABLE ROW LEVEL SECURITY;

-- SPLIT --

-- 2. Drop existing policies to avoid conflicts (clean slate)
DROP POLICY IF EXISTS "Users can see organizations they belong to" ON "empresas";

-- SPLIT --

DROP POLICY IF EXISTS "Users can see their own memberships" ON "miembros";

-- SPLIT --

DROP POLICY IF EXISTS "Tenant isolation for clientes" ON "clientes";

-- SPLIT --

-- 3. Create Helper Function to check membership
CREATE OR REPLACE FUNCTION public.is_member_of(requested_empresa_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM miembros 
    WHERE usuario_id = auth.uid() 
      AND empresa_id = requested_empresa_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- SPLIT --

-- 4. Define Policies

-- --- EMPRESAS ---
CREATE POLICY "Select_Empresas_Membership" ON "empresas"
FOR SELECT USING (
  exists (
    select 1 from miembros 
    where miembros.empresa_id = empresas.id 
    and miembros.usuario_id = auth.uid()
  )
);

-- SPLIT --

-- --- MIEMBROS ---
CREATE POLICY "Select_Miembros_Own" ON "miembros"
FOR SELECT USING (
  usuario_id = auth.uid() 
  OR 
  exists (
    select 1 from miembros as m
    where m.usuario_id = auth.uid() 
    and m.empresa_id = miembros.empresa_id
    and m.rol IN ('ADMIN', 'ENCARGADO')
  )
);

-- SPLIT --

-- --- RESOURCES (Generic Isolation) ---

CREATE POLICY "Isolation_Clientes" ON "clientes"
USING (public.is_member_of(empresa_id));

-- SPLIT --

CREATE POLICY "Isolation_Establecimientos" ON "establecimientos"
USING (public.is_member_of(empresa_id));

-- SPLIT --

CREATE POLICY "Isolation_Silos" ON "silos"
USING (public.is_member_of(empresa_id));

-- SPLIT --

CREATE POLICY "Isolation_Movimientos" ON "movimientos_stock"
USING (public.is_member_of(empresa_id));

-- SPLIT --

CREATE POLICY "Isolation_Lotes" ON "lotes"
USING (public.is_member_of(empresa_id));

-- SPLIT --

CREATE POLICY "Isolation_Servicios" ON "servicios"
USING (public.is_member_of(empresa_id));

-- SPLIT --

CREATE POLICY "Isolation_Ordenes" ON "ordenes_trabajo"
USING (public.is_member_of(empresa_id));

-- SPLIT --

CREATE POLICY "Isolation_OrdenItems" ON "orden_items"
USING (
  exists (
    select 1 from ordenes_trabajo o
    where o.id = orden_items.orden_id
    and public.is_member_of(o.empresa_id)
  )
);

-- SPLIT --

CREATE POLICY "Isolation_Facturas" ON "facturas"
USING (public.is_member_of(empresa_id));

-- SPLIT --

CREATE POLICY "Isolation_Campanas" ON "campanas"
USING (public.is_member_of(empresa_id));

-- SPLIT --

CREATE POLICY "Isolation_Presupuestos" ON "presupuestos"
USING (public.is_member_of(empresa_id));

-- SPLIT --

CREATE POLICY "Isolation_PresupuestoItems" ON "presupuesto_items"
USING (
  exists (
    select 1 from presupuestos p
    where p.id = presupuesto_items.presupuesto_id
    and public.is_member_of(p.empresa_id)
  )
);

-- SPLIT --

CREATE POLICY "Isolation_CartasPorte" ON "cartas_porte"
USING (public.is_member_of(empresa_id));

-- SPLIT --

CREATE POLICY "Isolation_Invitations" ON "invitations"
USING (
  email = (select email from auth.users where id = auth.uid())
  OR
  public.is_member_of(empresa_id) 
);

-- SPLIT --

CREATE POLICY "Select_Usuarios" ON "usuarios"
FOR SELECT USING (id = auth.uid());
