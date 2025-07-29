@echo off
echo Configurando variables de entorno para desarrollo...

set MONGODB_URI=mongodb://localhost:27017/dcp_itcr
set JWT_SECRET=tu_clave_secreta_muy_segura_para_produccion_cambiar_esto
set PORT=5000
set NODE_ENV=development
set CLIENT_URL=http://localhost:3000

echo Variables configuradas:
echo MONGODB_URI=%MONGODB_URI%
echo JWT_SECRET=***configurado***
echo PORT=%PORT%
echo NODE_ENV=%NODE_ENV%
echo CLIENT_URL=%CLIENT_URL%

echo.
echo Iniciando servidor...
npm run dev 