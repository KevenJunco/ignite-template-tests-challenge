import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "@modules/users/useCases/authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { GetStatementOperationUseCase } from "../getStatementOperation/GetStatementOperationUseCase";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;
let getBalanceUseCase: GetBalanceUseCase;

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

describe("Get Balance", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(
      inMemoryUsersRepository
    );
    authenticateUserUseCase = new AuthenticateUserUseCase(
      inMemoryUsersRepository
    );
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository

    );
  });

  it("Should be able to list a balance", async () => {
    const user = await createUserUseCase.execute({
      name: "Keven",
      email: "keven@email.com",
      password: "123456"
    });

    const email = "keven@email.com";
    const password = "123456";


    await authenticateUserUseCase.execute({ email, password });

    const id = user.id;

    if (!id) {
      throw new Error();
    }

    const statement: ICreateStatementDTO = {
      user_id: id,
      type: OperationType.DEPOSIT,
      amount: 123,
      description: "description"
    };

    await createStatementUseCase.execute(statement);

    const user_id = id;

    const getBalance = await getBalanceUseCase.execute({ user_id});

    console.log(getBalance);

    expect(getBalance).toHaveProperty("balance");
  });

  it("Should be able to create a new deposit", async () => {

    expect(async () => {

      const user_id = "id";

      await getBalanceUseCase.execute({user_id});
    }).rejects.toBeInstanceOf(GetBalanceError);
  });


});
