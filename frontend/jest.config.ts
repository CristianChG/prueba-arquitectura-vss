import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "jsdom", // necesario para localStorage
  transform: {
    "^.+\\.ts$": ["ts-jest", { tsconfig: "tsconfig.jest.json" }],
    "^.+\\.tsx$": ["ts-jest", { tsconfig: "tsconfig.jest.json" }],
  },
  moduleNameMapper: {
    "^@app/(.*)$": "<rootDir>/src/app/$1",
    "^@assets/(.*)$": "<rootDir>/src/app/assets/$1",
    "^@hooks/(.*)$": "<rootDir>/src/app/hooks/$1",
    "^@providers/(.*)$": "<rootDir>/src/app/providers/$1",
    "^@routes/(.*)$": "<rootDir>/src/app/routes/$1",
    "^@domain/(.*)$": "<rootDir>/src/domain/$1",
    "^@entities/(.*)$": "<rootDir>/src/domain/entities/$1",
    "^@repositories/(.*)$": "<rootDir>/src/domain/repositories/$1",
    "^@usecases/(.*)$": "<rootDir>/src/domain/usecases/$1",
    "^@validations/(.*)$": "<rootDir>/src/domain/validations/$1",
    "^@infrastructure/(.*)$": "<rootDir>/src/infrastructure/$1",
    "^@adapters/(.*)$": "<rootDir>/src/infrastructure/adapters/$1",
    "^@api/(.*)$": "<rootDir>/src/infrastructure/api/$1",
    "^@storage/(.*)$": "<rootDir>/src/infrastructure/storage/$1",
    "^@presentation/(.*)$": "<rootDir>/src/presentation/$1",
    "^@components/(.*)$": "<rootDir>/src/presentation/components/$1",
    "^@atoms/(.*)$": "<rootDir>/src/presentation/components/atoms/$1",
    "^@molecules/(.*)$": "<rootDir>/src/presentation/components/molecules/$1",
    "^@organisms/(.*)$": "<rootDir>/src/presentation/components/organisms/$1",
    "^@pages/(.*)$": "<rootDir>/src/presentation/components/pages/$1",
    "^@templates/(.*)$": "<rootDir>/src/presentation/components/templates/$1",
    "^@styles/(.*)$": "<rootDir>/src/presentation/styles/$1",
    "^@utils/(.*)$": "<rootDir>/src/utils/$1",
    "^@constants/(.*)$": "<rootDir>/src/utils/constants/$1",
    "^@formatters/(.*)$": "<rootDir>/src/utils/formatters/$1",
    "^@validators/(.*)$": "<rootDir>/src/utils/validators/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"], // mocks globales
};

export default config;
