/* eslint-disable no-useless-return */
/* eslint-disable consistent-return */
/* eslint-disable no-return-await */
const tickets = [];

const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');

const app = new Koa();

app.use(koaBody({
  urlencoded: true,
}));

app.use(async (ctx, next) => {
  const origin = ctx.request.get('Origin');
  if (!origin) return await next();

  const headers = { 'Access-Control-Allow-Origin': '*' };

  if (ctx.request.method !== 'OPTIONS') {
    ctx.response.set({ ...headers });
    try {
      return await next();
    } catch (error) {
      error.headers = { ...error.headers, ...headers };
      throw error;
    }
  }

  if (ctx.request.get('Access-Control-Request-Method')) {
    ctx.response.set({
      ...headers,
      'Access-Control-Request-Method': 'GET, POST, PUT, DELETE, PATCH',
    });

    if (ctx.request.get('Access-Control-Request-Headers')) {
      ctx.response.set(
        'Access-Control-Request-Headers',
        ctx.request.get('Access-Control-Request-Headers'),
      );
    }

    ctx.response.status = 204; // No content
  }
});

app.use(async (ctx) => {
  const { method } = ctx.request.querystring;

  switch (method) {
    case 'allTickets':
      ctx.response.body = tickets;
      return;

    default:
      ctx.response.status = 404;
      return;
  }
});

const port = process.env.PORT || 7070;
http.createServer(app.callback()).listen(port);