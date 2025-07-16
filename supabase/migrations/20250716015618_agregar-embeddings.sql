create extension if not exists "vector" with schema "public" version '0.8.0';

alter table "public"."Comment" add column "embedding" vector(1536);

CREATE INDEX embedding_idx ON public."Comment" USING ivfflat (embedding vector_cosine_ops) WITH (lists='100');