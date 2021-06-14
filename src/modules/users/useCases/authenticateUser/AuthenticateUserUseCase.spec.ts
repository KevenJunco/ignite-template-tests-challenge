import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";


let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe("Authenticate User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(
      inMemoryUsersRepository
    );
    authenticateUserUseCase = new AuthenticateUserUseCase(
      inMemoryUsersRepository
    );
  });

  it("Should be able to authenticate user", async () => {
    await createUserUseCase.execute({
      name: "Keven",
      email: "keven@email.com",
      password: "123456"
    });

     const email = "keven@email.com";
     const password =  "123456";


    const authenticatedUser = await authenticateUserUseCase.execute({email, password});

    expect(authenticatedUser).toHaveProperty("token");
  });


  it("should not be able to athenticate user with a incorrect email", async () => {
    expect(async () => {
       await createUserUseCase.execute({
        name: "Keven",
        email: "keven@email.com",
        password: "123456"
      });

      const email = "kevend@email.com";
      const password =  "123456";


      await authenticateUserUseCase.execute({email, password});


    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should not be able to athenticate user with a incorrect password", async () => {
    expect(async () => {
       const user = await createUserUseCase.execute({
        name: "Keven",
        email: "keven@email.com",
        password: "123456"
      });

      const email = user.email;
      const password =  user.password;


      await authenticateUserUseCase.execute({email, password});


    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });


});
