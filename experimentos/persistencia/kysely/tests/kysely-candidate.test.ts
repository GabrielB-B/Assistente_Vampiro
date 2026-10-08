import { verifyPersistenceCandidate } from "../../shared/candidate-contract.test-support.js";
import { KyselyCandidate } from "../src/kysely-candidate.js";

verifyPersistenceCandidate(() => new KyselyCandidate());
