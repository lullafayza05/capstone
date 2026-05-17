const app = require('./src/app');
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`========================================`);
  console.log(`🚀 BE ADUIN MENYALA DI PORT : ${PORT}`);
  console.log(`🔗 URL: http://127.0.0.1:${PORT}`);
  console.log(`========================================`);
});