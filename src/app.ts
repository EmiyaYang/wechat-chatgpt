import Koa from "koa";
import { main } from "./main.js";
const app = new Koa();

app.use(async (ctx) => {
  if (ctx.request.path === "/health") {
    ctx.response.status = 200;
    ctx.response.body = "health OK";
  } else {
    ctx.response.status = 404;
    ctx.response.body = "Not Found";
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log(
    "Server running at http://localhost:" + (process.env.PORT || 3000)
  );
  main();
});
