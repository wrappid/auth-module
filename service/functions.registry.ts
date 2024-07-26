import * as authFunctions from "./functions/auth.functions";

const FunctionsRegistry = {
  userExistenceChecker: authFunctions.userExistenceChecker,
};

export default FunctionsRegistry;
