import { performance } from "node:perf_hooks";

import { expect, it } from "vitest";

import { DrizzleCandidate } from "../drizzle/src/drizzle-candidate.js";
import { KyselyCandidate } from "../kysely/src/kysely-candidate.js";
import { PrismaCandidate } from "../prisma/src/prisma-candidate.js";
import type { PersistenceTestHarness } from "../shared/contract.js";
import { confirmedRollFixture, ids } from "../shared/fixtures.js";

interface CandidateMeasurement {
  readonly candidate: string;
  readonly migrationMs: number;
  readonly warmupMs: number;
  readonly medianMs: number;
  readonly p95Ms: number;
  readonly samplesMs: readonly number[];
}

function rounded(value: number): number {
  return Number(value.toFixed(3));
}

function percentile(sortedValues: readonly number[], percentileValue: number): number {
  const index = Math.max(0, Math.ceil(percentileValue * sortedValues.length) - 1);
  const value = sortedValues[index];

  if (value === undefined) {
    throw new Error("Não há amostras suficientes para calcular o percentil.");
  }

  return value;
}

async function measureCandidate(
  candidate: PersistenceTestHarness,
): Promise<CandidateMeasurement> {
  try {
    await candidate.resetDatabase();
    const migrationStart = performance.now();
    await candidate.migrateEmptyDatabase();
    const migrationMs = performance.now() - migrationStart;
    await candidate.seedCharacter(ids.character);

    const warmupStart = performance.now();
    await candidate.confirmRoll(
      confirmedRollFixture(900_000, { expectedStateVersion: 0 }),
    );
    const warmupMs = performance.now() - warmupStart;

    await candidate.resetDatabase();
    await candidate.migrateEmptyDatabase();
    await candidate.seedCharacter(ids.character);

    const samples: number[] = [];
    for (let index = 1; index <= 100; index += 1) {
      const startedAt = performance.now();
      await candidate.confirmRoll(confirmedRollFixture(index));
      samples.push(rounded(performance.now() - startedAt));
    }

    const sorted = [...samples].sort((left, right) => left - right);
    return {
      candidate: candidate.name,
      migrationMs: rounded(migrationMs),
      warmupMs: rounded(warmupMs),
      medianMs: rounded(percentile(sorted, 0.5)),
      p95Ms: rounded(percentile(sorted, 0.95)),
      samplesMs: samples,
    };
  } finally {
    await candidate.close();
  }
}

it("mede 100 confirmações válidas por candidata", async () => {
  const measurements: CandidateMeasurement[] = [];

  for (const candidate of [
    new KyselyCandidate(),
    new DrizzleCandidate(),
    new PrismaCandidate(),
  ]) {
    measurements.push(await measureCandidate(candidate));
  }

  expect(measurements).toHaveLength(3);
  for (const measurement of measurements) {
    expect(measurement.samplesMs).toHaveLength(100);
  }

  console.log(
    `MEASUREMENTS_JSON=${JSON.stringify({
      recordedAt: new Date().toISOString(),
      environment: {
        node: process.version,
        postgresql: "18.6",
        operatingSystem: "Windows",
        timezone: "UTC",
        poolSize: 4,
        executionsPerCandidate: 100,
      },
      candidates: measurements,
    })}`,
  );
});
