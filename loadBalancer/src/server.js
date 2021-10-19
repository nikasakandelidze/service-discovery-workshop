const http = require("http");
const httpproxy = require("http-proxy");
const consul = require("consul");

const routing = [
  {
    path: "/api/user",
    service: "users-service",
    index: 0,
  },
  {
    path: "/api/admin",
    service: "admin-service",
    index: 1,
  },
];

const consulClient = consul();
const proxy = httpproxy.createProxyServer();
const server = http.createServer((req, res) => {
  const proxyRouting = routing.find((route) => req.url.startsWith(route.path));
  if (proxyRouting) {
    consulClient.agent.service.list((err, services) => {
      const servers =
        !err &&
        Object.values(services).filter((service) =>
          service.Tags.includes(proxyRouting.service)
        );
      if (err || !servers.length) {
        res.writeHead(502);
        return res.end("Bad gateway");
      }
      // round robin mechanism since there might be several instances of same service
      const server = servers[proxyRouting.index];
      console.log(server.Address);
      const target = `http://localhost:${server.Port}`;
      proxy.web(req, res, { target });
      proxyRouting.index = (proxyRouting.index + 1) % servers.length;
      console.log(
        `LoadBalancer  forwarded request from ${req.url} to http://${server.Address}:${server.Port}`
      );
    });
  } else {
    res.writeHead(502);
    return res.end("Bad gateway");
  }
});

server.listen(8080, () => {
  console.log("Load balancer started on port 8080");
});
