const app = require('./app');
const { baseUrl, port } = require('./utils/constant');

app.listen(port, () => {
    console.log(`Server running at ${baseUrl}:${port}`);
});
