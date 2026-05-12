CREATE TABLE "benchmark_samples" (
	"id" text PRIMARY KEY NOT NULL,
	"tenant_id" text NOT NULL,
	"source_opportunity_id" text NOT NULL,
	"source_award_id" text NOT NULL,
	"region" text NOT NULL,
	"trade_section" text NOT NULL,
	"project_type" text,
	"awarded_value" numeric(14, 2) NOT NULL,
	"award_date" date,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "benchmark_samples" ADD CONSTRAINT "benchmark_samples_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "benchmark_samples_dim_idx" ON "benchmark_samples" USING btree ("region","trade_section","project_type");--> statement-breakpoint
CREATE UNIQUE INDEX "benchmark_samples_dedup_idx" ON "benchmark_samples" USING btree ("source_opportunity_id","source_award_id");