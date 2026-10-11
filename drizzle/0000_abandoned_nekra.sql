CREATE TABLE "inquiries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"property_id" uuid,
	"name" varchar(160) NOT NULL,
	"email" varchar(254) NOT NULL,
	"phone" varchar(40),
	"message" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "properties" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(180) NOT NULL,
	"title" varchar(180) NOT NULL,
	"description" text NOT NULL,
	"city" varchar(100) NOT NULL,
	"area" varchar(120),
	"price" integer NOT NULL,
	"currency" varchar(3) NOT NULL,
	"bedrooms" integer,
	"bathrooms" integer,
	"size_sqft" integer,
	"image_url" text,
	"image_alt" varchar(240),
	"featured" boolean DEFAULT false NOT NULL,
	"published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "properties_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE set null ON UPDATE no action;