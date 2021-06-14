import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

import { ShowUserProfileError } from "./ShowUserProfileError";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { CreateUserError } from "../createUser/CreateUserError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Create User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(
      inMemoryUsersRepository
    );
    showUserProfileUseCase = new ShowUserProfileUseCase(
      inMemoryUsersRepository
    );
  });

  it("Should be able to show a user profile", async () => {

    const user = await createUserUseCase.execute({
      name: "Keven",
      email: "keven@email.com",
      password: "123456"
    });

    const id = user.id;

    if (!id){
      throw new CreateUserError();
    }

    const userProfile = await showUserProfileUseCase.execute(id);

    expect(userProfile).toHaveProperty("id");
  });


  it("should not be able to create show a non existant profile", async () => {
    expect(async () => {
      await showUserProfileUseCase.execute("id");

    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });


});
