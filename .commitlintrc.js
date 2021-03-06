module.exports = {
  rules: {
    "type-case": [2, "always", "lower-case"],
    "type-enum": [
      2,
      "always",
      ["chore", "docs", "feat", "fix", "test", "perf", "refactor", "revert"],
    ],
    "type-empty": [2, "never"],
    "subject-case": [2, "always", "sentence-case"],
    "subject-max-length": [2, "always", 500],
    "subject-full-stop": [2, "never", "."],
    "subject-empty": [2, "never"],
    "body-leading-blank": [2, "always"],
    "body-max-line-length": [2, "always", 72],
    "footer-leading-blank": [2, "always"],
    "footer-max-line-length": [2, "always", 72],
  },
};
