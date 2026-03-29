const fs = require("fs");
const path = require("path");

const carpetaProcesados = path.join(__dirname, "procesados");
const salida = {};

const archivos = fs.readdirSync(carpetaProcesados).filter(f => f.endsWith(".js"));

for (const archivo of archivos) {
  const ruta = path.join(carpetaProcesados, archivo);
  let contenido = fs.readFileSync(ruta, "utf8");

  // Convierte "export default [...]" en JSON puro
  contenido = contenido.replace(/^export\s+default\s+/, "").trim();

  // Si termina con ; se lo quitamos
  if (contenido.endsWith(";")) {
    contenido = contenido.slice(0, -1);
  }

  const nombreLibro = path.basename(archivo, ".js").toLowerCase();

  try {
    const capitulos = JSON.parse(contenido);
    salida[nombreLibro] = capitulos;
  } catch (error) {
    console.error(`Error procesando ${archivo}:`, error.message);
  }
}

fs.writeFileSync(
  path.join(__dirname, "biblia.json"),
  JSON.stringify(salida, null, 2),
  "utf8"
);

console.log("✅ biblia.json generado correctamente");
