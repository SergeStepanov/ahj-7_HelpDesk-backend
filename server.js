/* eslint-disable no-useless-return */
/* eslint-disable consistent-return */
/* eslint-disable no-return-await */
import tickets from './tickets';

const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');

const app = new Koa();

// koaBody
app.use(
  koaBody({
    urlencoded: true,
    multipart: true,
    json: true,
    text: true,
  }),
);

// CORS
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

// response

app.use(async (ctx) => {
  const { method } = ctx.request.query;
  const res = tickets.map(({
    id, name, status, created,
  }) => ({
    id,
  }));

  switch (method) {
    case 'allTickets':
      // ????
      ctx.response.body = JSON.stringify(res);
      return;

    default:
      ctx.response.status = 404;
      return;
  }
});

// Server
const port = process.env.PORT || 7070;
http.createServer(app.callback()).listen(port);
