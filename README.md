##
SEGUIR LOS PASOS PARA EJECUTAR LA PAGINA WEB EN LOCALHOST
##
1. git clone -b Victor https://github.com/VSCX10/Take-It.git
2.  cd backend
3.  npm install
4. Crear archivo ".env" en el backend porque al subirlo a github se elimina
  //
    1. DATABASE_URL=postgresql://neondb_owner:npg_6D7ROzpfSILT@ep-rough-bird-apmw8yl4.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require
    2. PORT=3000
    3. JWT_SECRET=ROMAINA3000_TakeAndIt_2026
  //
5. node index.js
6. cd ../frontend
7. npm install
8. npm run dev
