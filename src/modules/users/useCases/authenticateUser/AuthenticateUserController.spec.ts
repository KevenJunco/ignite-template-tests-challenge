import { Connection, createConnection } from "typeorm";
import request from "supertest";
import { app } from "../../../../app";
let connection: Connection;
describe("Authenticate User", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able authenticate user existent", async () => {
    await request(app).post("/api/v1/users").send({
      name: "keven",
      email: "keven@hotmail.com",
      password: "123456",
    });

    const response = await request(app).post("/api/v1/sessions").send({
      email: "keven@hotmail.com",
      password: "123456",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
    expect(response.body.user).toHaveProperty("id");
  });

  it("Should not be able authenticate user non-exist", async () => {
    const response = await request(app).post("/api/v1/sessions").send({
      email: "nonExistUser@hotmail.com",
      password: "123456",
    });

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({ message: "Incorrect email or password" });
  });

  it("Should not be able authenticate user with password incorrect", async () => {
    await request(app).post("/api/v1/users").send({
      name: "keven",
      email: "keven@hotmail.com",
      password: "123456",
    });

    const response = await request(app).post("/api/v1/sessions").send({
      email: "keven@hotmail.com",
      password: "incorrect email",
    });

    console.log(response.statusCode);


    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({ message: "Incorrect email or password" });
  });
});
