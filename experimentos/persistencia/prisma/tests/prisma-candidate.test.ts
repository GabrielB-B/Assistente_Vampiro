import { verifyPersistenceCandidate } from "../../shared/candidate-contract.test-support.js";
import { PrismaCandidate } from "../src/prisma-candidate.js";

verifyPersistenceCandidate(() => new PrismaCandidate());
