import { Application, Router } from '@oak/oak';
import { Gpio } from 'npm:onoff';

export function startServer() {
  const router = new Router();

  router.get('/', (ctx) => {
    ctx.response.body = 'Hello world';
  });

  router.post('/toggle_led', async (ctx) => {
    console.log(await ctx.request.body.text());

    const led = new Gpio(17, 'out');

    Deno.addSignalListener('SIGINT', () => {
      console.log('SIGINT received (Ctrl+C)');
      led.unexport(); // or your equivalent cleanup
      console.log('interrupted!');
      Deno.exit();
    });
  });

  const app = new Application();
  app.use(router.routes());
  app.use(router.allowedMethods());

  app.listen({ port: 8008 });
}
