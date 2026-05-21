##
SEGUIR LOS PASOS PARA EJECUTAR LA PAGINA WEB EN LOCALHOST
##
1. git clone -b Victor https://github.com/VSCX10/Take-It.git
2. cd Take-It
3.  cd backend
4.  npm install
5. Crear archivo ".env" en el backend porque al subirlo a github se elimina
  //
    DATABASE_URL=postgresql://neondb_owner:npg_6D7ROzpfSILT@ep-rough-bird-apmw8yl4.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require
    PORT=3000
    JWT_SECRET=ROMAINA3000_TakeAndIt_2026
  //
6. node index.js
7. cd ../frontend
8. npm install
9. npm run dev
