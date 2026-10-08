import { verifyPersistenceCandidate } from "../../shared/candidate-contract.test-support.js";
import { DrizzleCandidate } from "../src/drizzle-candidate.js";

verifyPersistenceCandidate(() => new DrizzleCandidate());
