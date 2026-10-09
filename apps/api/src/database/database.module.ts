import { Global, Module } from "@nestjs/common";

import { DatabaseReadinessController } from "./database-readiness.controller.js";
import { DatabaseService } from "./database.service.js";

@Global()
@Module({
  controllers: [DatabaseReadinessController],
  exports: [DatabaseService],
  providers: [DatabaseService],
})
export class DatabaseModule {}
