import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './user.entity';

const mockUserService = {
  create: jest.fn(),
};

describe('UserController', () => {
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', async () => {
    const user = new User();
    user.id = 1;

    mockUserService.create.mockResolvedValue(user);

    const result = await controller.createUser();
    expect(result).toEqual(user);
    expect(mockUserService.create).toHaveBeenCalledWith(expect.any(User));
  });

  it('should handle errors when creating a user', async () => {
    mockUserService.create.mockRejectedValue(new Error('Failed to create user'));

    await expect(controller.createUser()).rejects.toThrow('Failed to create user');
  });
});
