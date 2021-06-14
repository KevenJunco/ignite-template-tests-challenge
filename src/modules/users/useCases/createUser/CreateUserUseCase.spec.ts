import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";

import { CreateUserError } from "./CreateUserError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(
      inMemoryUsersRepository
    );
  });

  it("Should be able to create a category", async () => {

    const user = await createUserUseCase.execute({
      name: "Keven",
      email: "keven@email.com",
      password: "123456"
    });

    expect(user).toHaveProperty("id");
  });


  it("should not be able to create a new User with email existent", async () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "Keven",
        email: "keven@email.com",
        password: "123456"
      });

      await createUserUseCase.execute({
        name: "john doe",
        email: "keven@email.com",
        password: "123456"
      });


    }).rejects.toBeInstanceOf(CreateUserError);
  });


});
