const test = require("node:test");
const assert = require("node:assert/strict");
const { createApp } = require("../app");

test("home page responds successfully", async () => {
  const server = createApp().listen(0, "127.0.0.1");

  await new Promise((resolve) => server.once("listening", resolve));
  const address = server.address();

  try {
    const response = await fetch(`http://127.0.0.1:${address.port}/`);
    assert.equal(response.status, 200);
    assert.equal(await response.text(), "Hello from Jenkins!");
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
});

test("health endpoint reports an ok status", async () => {
  const server = createApp().listen(0, "127.0.0.1");

  await new Promise((resolve) => server.once("listening", resolve));
  const address = server.address();

  try {
    const response = await fetch(`http://127.0.0.1:${address.port}/health`);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { status: "ok" });
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
});

test("home page uses the configured application message", async () => {
  const server = createApp({ message: "Hello, Kubernetes!" }).listen(0, "127.0.0.1");

  await new Promise((resolve) => server.once("listening", resolve));
  const address = server.address();

  try {
    const response = await fetch(`http://127.0.0.1:${address.port}/`);
    assert.equal(response.status, 200);
    assert.equal(await response.text(), "Hello, Kubernetes!");
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
});
