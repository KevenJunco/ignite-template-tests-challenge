import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "@modules/users/useCases/authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { ICreateStatementDTO } from "./ICreateStatementDTO";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

describe("Create Statement", () => {
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
  });

  it("Should be able to create a new deposit", async () => {
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

    const newStatement = await createStatementUseCase.execute(statement);

    expect(newStatement).toHaveProperty("description");
  });

  it("Should be able to create a new withdraw", async () => {
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

    const deposit: ICreateStatementDTO = {
      user_id: id,
      type: OperationType.DEPOSIT,
      amount: 500,
      description: "description"
    };

    const withdraw: ICreateStatementDTO = {
      user_id: id,
      type: OperationType.WITHDRAW,
      amount: 123,
      description: "description"
    };

    await createStatementUseCase.execute(deposit);
    const newStatement = await createStatementUseCase.execute(withdraw);

    console.log()


    expect(newStatement.amount).toEqual(123);
  });

  it("Should not be able to create a new withdraw with insufficient funds", async () => {
    expect(async () => {
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
        type: OperationType.WITHDRAW,
        amount: 123,
        description: "description"
      };

      await createStatementUseCase.execute(statement);

    }).rejects.toBeInstanceOf(CreateStatementError);
  });


});
