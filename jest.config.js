module.exports = {
  preset: "@shelf/jest-mongodb",
  displayName: "Colourful API tests",
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.+(ts|tsx|js)", "**/?(*.)+(spec|test).+(ts|tsx|js)"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
    "^.+\\.js$": "babel-jest",
    "^[./a-zA-Z0-9$_-]+\\.(bmp|gif|jpg|jpeg|png|psd|svg|webp)$":
      "<rootDir>/tests/mediaFileTransformer.js",
  },
};
