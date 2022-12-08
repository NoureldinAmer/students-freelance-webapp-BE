function getCurrentDate() {
  return new Date().toLocaleDateString("es-CL");
}

module.exports = {getCurrentDate};