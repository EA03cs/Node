//http://3.76.36.129:3000/
import bootstrap from './app.controller.js';
bootstrap().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
});
