
-- Garante que cada empresa tenha apenas um administrador principal.
CREATE UNIQUE INDEX usuarios_admin_empresa_unico
ON usuarios (empresa_id)
WHERE perfil = 'ADMIN_EMPRESA';
