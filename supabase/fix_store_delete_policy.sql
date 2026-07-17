-- Fix: Add missing DELETE policy for stores table
-- The old policy was dropped but never recreated (schema_v2.sql line 457-459)
CREATE POLICY "Admins can delete stores" ON public.stores
  FOR DELETE USING (public.is_admin());
