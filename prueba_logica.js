// Simulación de carga del archivo JSON (como si viniera de una petición fetch o base de datos)
const fs = require('fs'); // Si lo corres en Node.js (o puedes usar fetch si lo pruebas en navegador con un servidor local)

// ==========================================
// 1. LÓGICA DE INICIO DE SESIÓN
// ==========================================
function probarLogin(usuarioIngresado, passwordIngresado) {
    // Convertir a mayúsculas para estandarizar
    const userClean = usuarioIngresado.trim().toUpperCase();
    const passClean = passwordIngresado.trim();

    // Simulando la consulta a la BD (buscando en el JSON)
    const datosRaw = fs.readFileSync('datos_prueba.json', 'utf8');
    const baseDatos = JSON.parse(datosRaw);

    const usuarioEncontrado = baseDatos.usuarios.find(
        u => u.usuario === userClean && u.password === passClean
    );

    if (usuarioEncontrado) {
        console.log(`✅ [LOGIN EXITOSO] Bienvenido, ${usuarioEncontrado.nombre_completo} (Rol: ${usuarioEncontrado.rol})`);
        return true;
    } else {
        console.log(`❌ [ERROR DE LOGIN] Usuario o contraseña incorrectos.`);
        return false;
    }
}

// ==========================================
// 2. LÓGICA DE REGISTRO DE ACCESOS
// ==========================================
function registrarNuevoAcceso(nombre, placas, modelo, color, asunto, casa, guardiaEnTurno) {
    const datosRaw = fs.readFileSync('datos_prueba.json', 'utf8');
    const baseDatos = JSON.parse(datosRaw);

    // Estructurar el nuevo registro forzando MAYÚSCULAS
    const nuevoAcceso = {
        id: Date.now(),
        fecha: new Date().toISOString().split('T')[0],
        nombre: nombre.trim().toUpperCase(),
        placas: (placas.trim() || 'S/N').toUpperCase(),
        modelo: (modelo.trim() || '-').toUpperCase(),
        color: (color.trim() || '-').toUpperCase(),
        asunto: asunto.trim().toUpperCase(),
        casa: casa.trim().toUpperCase(),
        guardia: guardiaEnTurno.trim().toUpperCase(),
        horaEntrada: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        horaSalida: null // Aún en el fraccionamiento
    };

    // Agregarlo a la lista
    baseDatos.accesos.unshift(nuevoAcceso);

    // Guardarlo de vuelta (simulando el INSERT INTO de MySQL)
    fs.writeFileSync('datos_prueba.json', JSON.stringify(baseDatos, null, 2), 'utf8');
    console.log(`💾 [ACCESO GUARDADO] Se registró correctamente la entrada para: ${nuevoAcceso.nombre} (Casa ${nuevoAcceso.casa})`);
}

// ==========================================
// PRUEBAS DE EJECUCIÓN (Ejecuta esto para probar)
// ==========================================
console.log("--- INICIANDO PRUEBAS DE LÓGICA ---");

// Prueba 1: Login fallido
probarLogin("admin", "wrongpass");

// Prueba 2: Login exitoso
probarLogin("admin", "123");

// Prueba 3: Registrar un nuevo acceso en minúsculas para comprobar que se guarda en MAYÚSCULAS
registrarNuevoAcceso(
    "maria gomez", 
    "jkl-456", 
    "chevrolet aveo", 
    "azul", 
    "visita", 
    "88", 
    "juan pérez"
);