

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pgsodium";








ALTER SCHEMA "public" OWNER TO "postgres";


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."CommentStatus" AS ENUM (
    'approved',
    'onReview',
    'pending',
    'deleted',
    'spam',
    'rejected'
);


ALTER TYPE "public"."CommentStatus" OWNER TO "postgres";


CREATE TYPE "public"."ResourceCategory" AS ENUM (
    'exams',
    'resumes',
    'books',
    'videos',
    'other'
);


ALTER TYPE "public"."ResourceCategory" OWNER TO "postgres";


CREATE TYPE "public"."Rol" AS ENUM (
    'normal',
    'manager',
    'super_user'
);


ALTER TYPE "public"."Rol" OWNER TO "postgres";


CREATE TYPE "public"."Status" AS ENUM (
    'active',
    'draft',
    'reported',
    'deleted'
);


ALTER TYPE "public"."Status" OWNER TO "postgres";


CREATE TYPE "public"."UserStatus" AS ENUM (
    'active',
    'deleted',
    'blocked'
);


ALTER TYPE "public"."UserStatus" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_difficulty_quality_courseteacher"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
	declare
		promedio_difficulty DECIMAL(5, 1);
		promedio_quality DECIMAL(5, 1);
	BEGIN
	    IF (TG_OP = 'DELETE') THEN
	        SELECT ROUND(AVG(c.difficulty), 1), ROUND(AVG(c.quality), 1)
	        INTO promedio_difficulty, promedio_quality
	        FROM public."Comment" c
	        WHERE c.teacher_id = OLD.teacher_id AND c.course_id = OLD.course_id;
	       
	        UPDATE "CourseTeacher"
	    	SET quality = promedio_quality, difficulty = promedio_difficulty
	    	WHERE "CourseTeacher".course_id = OLD.course_id and "CourseTeacher".teacher_id = OLD.teacher_id;
	        RETURN OLD;
	    ELSE
	        SELECT ROUND(AVG(c.difficulty), 1), ROUND(AVG(c.quality), 1)
	        INTO promedio_difficulty, promedio_quality
	        FROM public."Comment" c 
	        WHERE c.teacher_id = NEW.teacher_id AND c.course_id = NEW.course_id;
	       
	        UPDATE "CourseTeacher" 
	    	SET quality = promedio_quality, difficulty = promedio_difficulty
	    	WHERE "CourseTeacher".course_id = NEW.course_id and "CourseTeacher".teacher_id = new.teacher_id;
	        RETURN NEW;
	    END IF;
	
	
	END;
$$;


ALTER FUNCTION "public"."update_difficulty_quality_courseteacher"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_likes_dislikes_comment"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    likes_count INTEGER;
    dislikes_count INTEGER;
BEGIN
    IF (TG_OP = 'DELETE') THEN
        -- Acci�n para eliminaci�n
        SELECT COUNT(*) INTO likes_count
        FROM "CommentLikes" cl 
        WHERE cl.comment_id = old.comment_id AND cl.is_like = true;

        SELECT COUNT(*) INTO dislikes_count
        FROM "CommentLikes" cl 
        WHERE cl.comment_id = old.comment_id AND cl.is_like = false;
    ELSE
        -- Acci�n para inserci�n o actualizaci�n
        SELECT COUNT(*) INTO likes_count
        FROM "CommentLikes" cl 
        WHERE cl.comment_id = new.comment_id AND cl.is_like = true;

        SELECT COUNT(*) INTO dislikes_count
        FROM "CommentLikes" cl 
        WHERE cl.comment_id = new.comment_id AND cl.is_like = false;
    END IF;

    UPDATE "Comment"
    SET likes = likes_count, "disLikes" = dislikes_count
    WHERE "Comment".id = COALESCE(new.comment_id, old.comment_id);

    -- Si es una operaci�n de eliminaci�n, retorna OLD; si no, retorna NEW.
    RETURN CASE
        WHEN TG_OP = 'DELETE' THEN OLD
        ELSE NEW
    END;
END;
$$;


ALTER FUNCTION "public"."update_likes_dislikes_comment"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."Comment" (
    "comment" "text" NOT NULL,
    "status" "public"."CommentStatus" DEFAULT 'approved'::"public"."CommentStatus" NOT NULL,
    "created_by" "text" NOT NULL,
    "created_at" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp(3) without time zone NOT NULL,
    "difficulty" integer NOT NULL,
    "quality" integer NOT NULL,
    "disLikes" integer DEFAULT 0,
    "likes" integer DEFAULT 0,
    "course_id" integer NOT NULL,
    "teacher_id" integer NOT NULL,
    "id" "text" NOT NULL
);


ALTER TABLE "public"."Comment" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."CommentLikes" (
    "is_like" boolean NOT NULL,
    "created_by" "text" NOT NULL,
    "comment_id" "text" NOT NULL
);


ALTER TABLE "public"."CommentLikes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Country" (
    "id" integer NOT NULL,
    "name" "text" NOT NULL
);


ALTER TABLE "public"."Country" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."Country_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."Country_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."Country_id_seq" OWNED BY "public"."Country"."id";



CREATE TABLE IF NOT EXISTS "public"."Course" (
    "name" "text" NOT NULL,
    "description" "text",
    "short_name" "text" NOT NULL,
    "course_code" "text",
    "status" "public"."Status" DEFAULT 'active'::"public"."Status",
    "created_by" "text" NOT NULL,
    "created_at" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp(3) without time zone NOT NULL,
    "id" integer NOT NULL,
    "faculty_id" integer NOT NULL
);


ALTER TABLE "public"."Course" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."CourseTeacher" (
    "quality" numeric(65,30),
    "difficulty" numeric(65,30),
    "status" "public"."Status" DEFAULT 'active'::"public"."Status" NOT NULL,
    "created_at" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp(3) without time zone NOT NULL,
    "created_by" "text" NOT NULL,
    "course_id" integer NOT NULL,
    "teacher_id" integer NOT NULL,
    "teacher_class_name" "text"
);


ALTER TABLE "public"."CourseTeacher" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."Course_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."Course_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."Course_id_seq" OWNED BY "public"."Course"."id";



CREATE TABLE IF NOT EXISTS "public"."Degree" (
    "name" "text" NOT NULL,
    "description" "text",
    "duration" numeric(65,30),
    "status" "public"."Status" DEFAULT 'active'::"public"."Status",
    "created_by" "text" NOT NULL,
    "created_at" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp(3) without time zone NOT NULL,
    "slug" "text",
    "id" integer NOT NULL,
    "faculty_id" integer NOT NULL
);


ALTER TABLE "public"."Degree" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."DegreeComent" (
    "user_id" "text" NOT NULL,
    "degree_id" integer NOT NULL,
    "comment" "text" NOT NULL,
    "created_at" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "public"."DegreeComent" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."DegreeCourse" (
    "created_at" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp(3) without time zone NOT NULL,
    "created_by" "text" NOT NULL,
    "degree_id" integer NOT NULL,
    "course_id" integer NOT NULL
);


ALTER TABLE "public"."DegreeCourse" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."Degree_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."Degree_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."Degree_id_seq" OWNED BY "public"."Degree"."id";



CREATE TABLE IF NOT EXISTS "public"."Faculty" (
    "name" "text" NOT NULL,
    "status" "public"."Status" DEFAULT 'active'::"public"."Status",
    "created_by" "text" NOT NULL,
    "created_at" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp(3) without time zone NOT NULL,
    "slug" "text",
    "id" integer NOT NULL,
    "university_id" integer NOT NULL
);


ALTER TABLE "public"."Faculty" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."FacultyComment" (
    "user_id" "text" NOT NULL,
    "faculty_id" integer NOT NULL,
    "comment" "text" NOT NULL,
    "created_at" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "public"."FacultyComment" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."Faculty_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."Faculty_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."Faculty_id_seq" OWNED BY "public"."Faculty"."id";



CREATE TABLE IF NOT EXISTS "public"."ResourceReports" (
    "resource_id" integer NOT NULL,
    "created_by" "text" NOT NULL,
    "created_at" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "public"."ResourceReports" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Resources" (
    "id" integer NOT NULL,
    "name" "text" NOT NULL,
    "url" "text" NOT NULL,
    "category" "public"."ResourceCategory" DEFAULT 'other'::"public"."ResourceCategory" NOT NULL,
    "created_by" "text" NOT NULL,
    "created_at" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp(3) without time zone NOT NULL,
    "course_id" integer NOT NULL,
    "teacher_id" integer NOT NULL,
    "reports" integer DEFAULT 0
);


ALTER TABLE "public"."Resources" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."Resources_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."Resources_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."Resources_id_seq" OWNED BY "public"."Resources"."id";



CREATE TABLE IF NOT EXISTS "public"."Teacher" (
    "name" "text" NOT NULL,
    "last_name" "text" NOT NULL,
    "score" integer,
    "status" "public"."Status" DEFAULT 'active'::"public"."Status",
    "created_by" "text" NOT NULL,
    "created_at" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp(3) without time zone NOT NULL,
    "id" integer NOT NULL,
    "university_id" integer NOT NULL
);


ALTER TABLE "public"."Teacher" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."Teacher_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."Teacher_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."Teacher_id_seq" OWNED BY "public"."Teacher"."id";



CREATE TABLE IF NOT EXISTS "public"."University" (
    "name" "text" NOT NULL,
    "website" "text",
    "phone" "text",
    "status" "public"."Status" DEFAULT 'active'::"public"."Status",
    "created_by" "text" NOT NULL,
    "created_at" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp(3) without time zone NOT NULL,
    "country_id" integer NOT NULL,
    "slug" "text" NOT NULL,
    "id" integer NOT NULL
);


ALTER TABLE "public"."University" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."UniversityComment" (
    "user_id" "text" NOT NULL,
    "university_id" integer NOT NULL,
    "comment" "text" NOT NULL,
    "created_at" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "public"."UniversityComment" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."University_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."University_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."University_id_seq" OWNED BY "public"."University"."id";



CREATE TABLE IF NOT EXISTS "public"."User" (
    "id" "text" NOT NULL,
    "email" "text" NOT NULL,
    "password" "text" NOT NULL,
    "username" "text" NOT NULL,
    "rol" "public"."Rol" DEFAULT 'normal'::"public"."Rol" NOT NULL,
    "status" "public"."UserStatus" DEFAULT 'active'::"public"."UserStatus" NOT NULL,
    "is_verified" boolean DEFAULT false NOT NULL,
    "university_id" "text",
    "degree_id" "text",
    "created_at" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp(3) without time zone NOT NULL,
    "reset_token" "text",
    "confirm_token" "text",
    "profile_img" "text"
);


ALTER TABLE "public"."User" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."_prisma_migrations" (
    "id" character varying(36) NOT NULL,
    "checksum" character varying(64) NOT NULL,
    "finished_at" timestamp with time zone,
    "migration_name" character varying(255) NOT NULL,
    "logs" "text",
    "rolled_back_at" timestamp with time zone,
    "started_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "applied_steps_count" integer DEFAULT 0 NOT NULL
);


ALTER TABLE "public"."_prisma_migrations" OWNER TO "postgres";


ALTER TABLE ONLY "public"."Country" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."Country_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."Course" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."Course_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."Degree" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."Degree_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."Faculty" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."Faculty_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."Resources" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."Resources_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."Teacher" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."Teacher_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."University" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."University_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."CommentLikes"
    ADD CONSTRAINT "CommentLikes_pkey" PRIMARY KEY ("comment_id", "created_by");



ALTER TABLE ONLY "public"."Comment"
    ADD CONSTRAINT "Comment_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Country"
    ADD CONSTRAINT "Country_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."CourseTeacher"
    ADD CONSTRAINT "CourseTeacher_pkey" PRIMARY KEY ("course_id", "teacher_id");



ALTER TABLE ONLY "public"."Course"
    ADD CONSTRAINT "Course_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."DegreeComent"
    ADD CONSTRAINT "DegreeComent_pkey" PRIMARY KEY ("user_id", "degree_id");



ALTER TABLE ONLY "public"."DegreeCourse"
    ADD CONSTRAINT "DegreeCourse_pkey" PRIMARY KEY ("degree_id", "course_id");



ALTER TABLE ONLY "public"."Degree"
    ADD CONSTRAINT "Degree_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."FacultyComment"
    ADD CONSTRAINT "FacultyComment_pkey" PRIMARY KEY ("user_id", "faculty_id");



ALTER TABLE ONLY "public"."Faculty"
    ADD CONSTRAINT "Faculty_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."ResourceReports"
    ADD CONSTRAINT "ResourceReports_pkey" PRIMARY KEY ("resource_id", "created_by");



ALTER TABLE ONLY "public"."Resources"
    ADD CONSTRAINT "Resources_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Teacher"
    ADD CONSTRAINT "Teacher_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."UniversityComment"
    ADD CONSTRAINT "UniversityComment_pkey" PRIMARY KEY ("user_id", "university_id");



ALTER TABLE ONLY "public"."University"
    ADD CONSTRAINT "University_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."_prisma_migrations"
    ADD CONSTRAINT "_prisma_migrations_pkey" PRIMARY KEY ("id");



CREATE UNIQUE INDEX "Comment_id_key" ON "public"."Comment" USING "btree" ("id");



CREATE UNIQUE INDEX "Country_name_key" ON "public"."Country" USING "btree" ("name");



CREATE UNIQUE INDEX "Course_id_key" ON "public"."Course" USING "btree" ("id");



CREATE UNIQUE INDEX "Degree_id_key" ON "public"."Degree" USING "btree" ("id");



CREATE UNIQUE INDEX "Degree_slug_key" ON "public"."Degree" USING "btree" ("slug");



CREATE UNIQUE INDEX "Faculty_id_key" ON "public"."Faculty" USING "btree" ("id");



CREATE UNIQUE INDEX "Faculty_slug_key" ON "public"."Faculty" USING "btree" ("slug");



CREATE UNIQUE INDEX "Resources_id_key" ON "public"."Resources" USING "btree" ("id");



CREATE UNIQUE INDEX "Teacher_id_key" ON "public"."Teacher" USING "btree" ("id");



CREATE UNIQUE INDEX "University_id_key" ON "public"."University" USING "btree" ("id");



CREATE UNIQUE INDEX "University_slug_key" ON "public"."University" USING "btree" ("slug");



CREATE UNIQUE INDEX "User_confirm_token_key" ON "public"."User" USING "btree" ("confirm_token");



CREATE UNIQUE INDEX "User_email_key" ON "public"."User" USING "btree" ("email");



CREATE UNIQUE INDEX "User_id_key" ON "public"."User" USING "btree" ("id");



CREATE UNIQUE INDEX "User_reset_token_key" ON "public"."User" USING "btree" ("reset_token");



CREATE UNIQUE INDEX "User_username_key" ON "public"."User" USING "btree" ("username");



CREATE UNIQUE INDEX "unique_course_by_faculty" ON "public"."Course" USING "btree" ("name", "faculty_id");



CREATE UNIQUE INDEX "unique_degree_by_faculty" ON "public"."Degree" USING "btree" ("name", "faculty_id");



CREATE UNIQUE INDEX "unique_faculty_by_university" ON "public"."Faculty" USING "btree" ("name", "university_id");



CREATE UNIQUE INDEX "unique_teacher_by_university" ON "public"."Teacher" USING "btree" ("name", "last_name", "university_id");



CREATE UNIQUE INDEX "unique_university_by_country" ON "public"."University" USING "btree" ("name", "country_id");



CREATE OR REPLACE TRIGGER "update_table_comment_likes" AFTER INSERT OR DELETE OR UPDATE ON "public"."CommentLikes" FOR EACH ROW EXECUTE FUNCTION "public"."update_likes_dislikes_comment"();



CREATE OR REPLACE TRIGGER "update_table_course_teacher_avg" AFTER INSERT OR DELETE OR UPDATE ON "public"."Comment" FOR EACH ROW EXECUTE FUNCTION "public"."update_difficulty_quality_courseteacher"();



ALTER TABLE ONLY "public"."CommentLikes"
    ADD CONSTRAINT "CommentLikes_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "public"."Comment"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."CommentLikes"
    ADD CONSTRAINT "CommentLikes_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."User"("id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."Comment"
    ADD CONSTRAINT "Comment_course_id_teacher_id_fkey" FOREIGN KEY ("course_id", "teacher_id") REFERENCES "public"."CourseTeacher"("course_id", "teacher_id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."Comment"
    ADD CONSTRAINT "Comment_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."User"("id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."CourseTeacher"
    ADD CONSTRAINT "CourseTeacher_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."Course"("id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."CourseTeacher"
    ADD CONSTRAINT "CourseTeacher_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."User"("id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."CourseTeacher"
    ADD CONSTRAINT "CourseTeacher_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "public"."Teacher"("id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."Course"
    ADD CONSTRAINT "Course_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."User"("id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."Course"
    ADD CONSTRAINT "Course_faculty_id_fkey" FOREIGN KEY ("faculty_id") REFERENCES "public"."Faculty"("id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."DegreeComent"
    ADD CONSTRAINT "DegreeComent_degree_id_fkey" FOREIGN KEY ("degree_id") REFERENCES "public"."Degree"("id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."DegreeComent"
    ADD CONSTRAINT "DegreeComent_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."DegreeCourse"
    ADD CONSTRAINT "DegreeCourse_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."Course"("id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."DegreeCourse"
    ADD CONSTRAINT "DegreeCourse_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."User"("id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."DegreeCourse"
    ADD CONSTRAINT "DegreeCourse_degree_id_fkey" FOREIGN KEY ("degree_id") REFERENCES "public"."Degree"("id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."Degree"
    ADD CONSTRAINT "Degree_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."User"("id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."Degree"
    ADD CONSTRAINT "Degree_faculty_id_fkey" FOREIGN KEY ("faculty_id") REFERENCES "public"."Faculty"("id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."FacultyComment"
    ADD CONSTRAINT "FacultyComment_faculty_id_fkey" FOREIGN KEY ("faculty_id") REFERENCES "public"."Faculty"("id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."FacultyComment"
    ADD CONSTRAINT "FacultyComment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."Faculty"
    ADD CONSTRAINT "Faculty_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."User"("id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."Faculty"
    ADD CONSTRAINT "Faculty_university_id_fkey" FOREIGN KEY ("university_id") REFERENCES "public"."University"("id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."ResourceReports"
    ADD CONSTRAINT "ResourceReports_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."User"("id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."ResourceReports"
    ADD CONSTRAINT "ResourceReports_resource_id_fkey" FOREIGN KEY ("resource_id") REFERENCES "public"."Resources"("id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."Resources"
    ADD CONSTRAINT "Resources_course_id_teacher_id_fkey" FOREIGN KEY ("course_id", "teacher_id") REFERENCES "public"."CourseTeacher"("course_id", "teacher_id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."Resources"
    ADD CONSTRAINT "Resources_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."User"("id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."Teacher"
    ADD CONSTRAINT "Teacher_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."User"("id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."Teacher"
    ADD CONSTRAINT "Teacher_university_id_fkey" FOREIGN KEY ("university_id") REFERENCES "public"."University"("id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."UniversityComment"
    ADD CONSTRAINT "UniversityComment_university_id_fkey" FOREIGN KEY ("university_id") REFERENCES "public"."University"("id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."UniversityComment"
    ADD CONSTRAINT "UniversityComment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."University"
    ADD CONSTRAINT "University_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "public"."Country"("id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."University"
    ADD CONSTRAINT "University_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."User"("id") ON UPDATE CASCADE ON DELETE RESTRICT;





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";




















































































































































































GRANT ALL ON FUNCTION "public"."update_difficulty_quality_courseteacher"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_difficulty_quality_courseteacher"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_difficulty_quality_courseteacher"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_likes_dislikes_comment"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_likes_dislikes_comment"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_likes_dislikes_comment"() TO "service_role";



























GRANT ALL ON TABLE "public"."Comment" TO "anon";
GRANT ALL ON TABLE "public"."Comment" TO "authenticated";
GRANT ALL ON TABLE "public"."Comment" TO "service_role";



GRANT ALL ON TABLE "public"."CommentLikes" TO "anon";
GRANT ALL ON TABLE "public"."CommentLikes" TO "authenticated";
GRANT ALL ON TABLE "public"."CommentLikes" TO "service_role";



GRANT ALL ON TABLE "public"."Country" TO "anon";
GRANT ALL ON TABLE "public"."Country" TO "authenticated";
GRANT ALL ON TABLE "public"."Country" TO "service_role";



GRANT ALL ON SEQUENCE "public"."Country_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."Country_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."Country_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."Course" TO "anon";
GRANT ALL ON TABLE "public"."Course" TO "authenticated";
GRANT ALL ON TABLE "public"."Course" TO "service_role";



GRANT ALL ON TABLE "public"."CourseTeacher" TO "anon";
GRANT ALL ON TABLE "public"."CourseTeacher" TO "authenticated";
GRANT ALL ON TABLE "public"."CourseTeacher" TO "service_role";



GRANT ALL ON SEQUENCE "public"."Course_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."Course_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."Course_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."Degree" TO "anon";
GRANT ALL ON TABLE "public"."Degree" TO "authenticated";
GRANT ALL ON TABLE "public"."Degree" TO "service_role";



GRANT ALL ON TABLE "public"."DegreeComent" TO "anon";
GRANT ALL ON TABLE "public"."DegreeComent" TO "authenticated";
GRANT ALL ON TABLE "public"."DegreeComent" TO "service_role";



GRANT ALL ON TABLE "public"."DegreeCourse" TO "anon";
GRANT ALL ON TABLE "public"."DegreeCourse" TO "authenticated";
GRANT ALL ON TABLE "public"."DegreeCourse" TO "service_role";



GRANT ALL ON SEQUENCE "public"."Degree_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."Degree_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."Degree_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."Faculty" TO "anon";
GRANT ALL ON TABLE "public"."Faculty" TO "authenticated";
GRANT ALL ON TABLE "public"."Faculty" TO "service_role";



GRANT ALL ON TABLE "public"."FacultyComment" TO "anon";
GRANT ALL ON TABLE "public"."FacultyComment" TO "authenticated";
GRANT ALL ON TABLE "public"."FacultyComment" TO "service_role";



GRANT ALL ON SEQUENCE "public"."Faculty_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."Faculty_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."Faculty_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."ResourceReports" TO "anon";
GRANT ALL ON TABLE "public"."ResourceReports" TO "authenticated";
GRANT ALL ON TABLE "public"."ResourceReports" TO "service_role";



GRANT ALL ON TABLE "public"."Resources" TO "anon";
GRANT ALL ON TABLE "public"."Resources" TO "authenticated";
GRANT ALL ON TABLE "public"."Resources" TO "service_role";



GRANT ALL ON SEQUENCE "public"."Resources_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."Resources_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."Resources_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."Teacher" TO "anon";
GRANT ALL ON TABLE "public"."Teacher" TO "authenticated";
GRANT ALL ON TABLE "public"."Teacher" TO "service_role";



GRANT ALL ON SEQUENCE "public"."Teacher_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."Teacher_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."Teacher_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."University" TO "anon";
GRANT ALL ON TABLE "public"."University" TO "authenticated";
GRANT ALL ON TABLE "public"."University" TO "service_role";



GRANT ALL ON TABLE "public"."UniversityComment" TO "anon";
GRANT ALL ON TABLE "public"."UniversityComment" TO "authenticated";
GRANT ALL ON TABLE "public"."UniversityComment" TO "service_role";



GRANT ALL ON SEQUENCE "public"."University_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."University_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."University_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."User" TO "anon";
GRANT ALL ON TABLE "public"."User" TO "authenticated";
GRANT ALL ON TABLE "public"."User" TO "service_role";



GRANT ALL ON TABLE "public"."_prisma_migrations" TO "anon";
GRANT ALL ON TABLE "public"."_prisma_migrations" TO "authenticated";
GRANT ALL ON TABLE "public"."_prisma_migrations" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
