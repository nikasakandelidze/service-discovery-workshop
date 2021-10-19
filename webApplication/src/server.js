const http = require("http");
const consul = require("consul");
const portfinder = require("portfinder");
const nanoid = require("nanoid");

//argument to service launch
const serviceType = process.argv[2] || "users-service";

const { pid } = process;

const main = async () => {
  const consulClient = consul();

  const port = await portfinder.getPortPromise();
  console.log("strating service with service type of: " + serviceType);
  //Id of current instance of service
  const serviceId = nanoid.nanoid();

  const registerService = () => {
    consulClient.agent.service.register(
      {
        id: serviceId,
        name: serviceType,
        localhost: "localhost",
        port,
        tags: [serviceType],
      },
      () => {
        console.log(`${serviceType} registered successfully`);
      }
    );
  };
  const unregisterService = (err) => {
    console.log(`deregistering ${serviceId}`);
    consulClient.agent.service.deregister(serviceId, () => {
      process.exit(err ? 1 : 0);
    });
  };

  process.on("exit", unregisterService);

  process.on("uncaughtException", unregisterService);

  process.on("SIGINT", unregisterService);

  const server = http.createServer((req, res) => {
    console.log(`Handling request from ${pid}`);
    res.end(`${serviceType} response from ${pid}\n`);
  });

  server.listen(port, "localhost", () => {
    registerService();
    console.log(`Started ${serviceType} at ${pid} on port ${port}`);
  });
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
