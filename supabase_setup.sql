-- ============================================
-- CONTROLADOS — Script de configuración Supabase
-- Ejecutá esto en el SQL Editor de tu proyecto
-- ============================================

-- 1. USUARIOS (clientes que pueden loguearse)
create table if not exists users (
  id   text primary key,   -- DNI
  name text not null
);

-- 2. CONTROLES
create table if not exists controles (
  id     text primary key,
  nombre text not null
);

-- 3. MARCAS Y MODELOS DE TV
create table if not exists marcasymodelos (
  modelo       text primary key,
  equivalencia text not null   -- id del control
);

-- 4. REEMPLAZOS
create table if not exists reemplazos (
  id         text primary key,
  reemplazos text not null    -- ids separados por coma. Ej: "522,2553"
);

-- ============================================
-- DATOS INICIALES
-- ============================================

-- Usuarios
insert into users (id, name) values
  ('36004936', 'Nicolás'),
  ('35705346', 'Florencia')
on conflict (id) do nothing;

-- Controles
insert into controles (id, nombre) values
  ('500',  'LCD 500'),
  ('477',  'LCD 477'),
  ('446',  'LCD 446'),
  ('1553', 'LCD 553'),
  ('2553', 'LCD 553P'),
  ('506',  'LCD 506'),
  ('525',  'LCD 525'),
  ('452',  'LCD 452'),
  ('522',  'LCD 522')
on conflict (id) do nothing;

-- Modelos de TV
insert into marcasymodelos (modelo, equivalencia) values
  ('EA50X6100', '500'),
  ('32LF565B',  '477'),
  ('Ble4014d',  '446'),
  ('DI32X500',  '506')
on conflict (modelo) do nothing;

-- Reemplazos (múltiples separados por coma)
insert into reemplazos (id, reemplazos) values
  ('500',  '522,2553'),
  ('477',  '525'),
  ('446',  '452'),
  ('1553', '506'),
  ('506',  '1553')
on conflict (id) do nothing;

-- ============================================
-- ROW LEVEL SECURITY — lectura pública (anon)
-- ============================================
alter table users          enable row level security;
alter table controles      enable row level security;
alter table marcasymodelos enable row level security;
alter table reemplazos     enable row level security;

-- La app usa la anon key del client, solo necesita leer
create policy "read_users"          on users          for select using (true);
create policy "read_controles"      on controles      for select using (true);
create policy "read_marcasymodelos" on marcasymodelos  for select using (true);
create policy "read_reemplazos"     on reemplazos     for select using (true);
