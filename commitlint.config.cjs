module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      ["feat", "fix", "chore", "docs", "style", "refactor", "perf", "test"],
    ],
    "scope-empty": [0, "never"], // Allows scope to be empty
    "subject-case": [0], // Disables case enforcement for the subject
  },
};
