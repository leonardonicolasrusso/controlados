# CONTROLADOS 📡

App para buscar controles remotos compatibles con modelos de TV.

---

## Stack
- **Next.js 14** (App Router)
- **Supabase** (base de datos)
- **Vercel** (hosting)

---

## Paso a paso para desplegarlo

### 1. Supabase

1. Entrá a [supabase.com](https://supabase.com) y creá un proyecto nuevo
2. Andá a **SQL Editor** y pegá todo el contenido de `supabase_setup.sql`
3. Ejecutá el script — crea las tablas y carga los datos iniciales
4. Andá a **Settings → API** y copiá:
   - `Project URL`
   - `anon public` key

### 2. Subir imágenes de los controles

Las imágenes van en la carpeta `public/img/` con el nombre del **ID del control**:

```
public/img/500.png
public/img/477.png
public/img/446.png
public/img/452.png
public/img/506.png
public/img/522.png
public/img/525.png
public/img/1553.png   ← LCD 553
public/img/2553.png   ← LCD 553P
```

### 3. GitHub

```bash
# En la carpeta del proyecto
git init
git add .
git commit -m "primera versión de CONTROLADOS"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/controlados.git
git push -u origin main
```

### 4. Vercel

1. Entrá a [vercel.com](https://vercel.com) y conectá tu repo de GitHub
2. En el paso de configuración, agregá las **variables de entorno**:
   - `NEXT_PUBLIC_SUPABASE_URL` → tu Project URL de Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → tu anon key de Supabase
3. Deploy 🚀

---

## Agregar nuevos clientes

En Supabase → Table Editor → tabla `users`:
```sql
insert into users (id, name) values ('DNI_DEL_CLIENTE', 'Nombre');
```

## Agregar nuevos modelos de TV

En Supabase → tabla `marcasymodelos`:
```sql
insert into marcasymodelos (modelo, equivalencia) values ('MODELO_TV', 'ID_CONTROL');
```

## Agregar un nuevo control

```sql
insert into controles (id, nombre) values ('999', 'LCD 999');
-- Si tiene reemplazos:
insert into reemplazos (id, reemplazos) values ('999', '500,477');
```

---

## Desarrollo local

```bash
# Cloná el repo
git clone https://github.com/TU_USUARIO/controlados.git
cd controlados

# Instalá dependencias
npm install

# Creá el archivo de variables de entorno
cp .env.local.example .env.local
# Editá .env.local con tus keys de Supabase

# Corré en modo desarrollo
npm run dev
# → http://localhost:3000
```
