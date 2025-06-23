create type "public"."CommentStatus" as enum ('approved', 'onReview', 'pending', 'deleted', 'spam', 'rejected');

create type "public"."ResourceCategory" as enum ('exams', 'resumes', 'books', 'videos', 'other');

create type "public"."Rol" as enum ('normal', 'manager', 'super_user');

create type "public"."Status" as enum ('active', 'draft', 'reported', 'deleted');

create type "public"."UserStatus" as enum ('active', 'deleted', 'blocked');

create sequence "public"."Country_id_seq";

create sequence "public"."Course_id_seq";

create sequence "public"."Degree_id_seq";

create sequence "public"."Faculty_id_seq";

create sequence "public"."Resources_id_seq";

create sequence "public"."Teacher_id_seq";

create sequence "public"."University_id_seq";

create table "public"."Comment" (
    "comment" text not null,
    "status" "CommentStatus" not null default 'approved'::"CommentStatus",
    "created_by" text not null,
    "created_at" timestamp(3) without time zone not null default CURRENT_TIMESTAMP,
    "updated_at" timestamp(3) without time zone not null,
    "difficulty" integer not null,
    "quality" integer not null,
    "disLikes" integer default 0,
    "likes" integer default 0,
    "course_id" integer not null,
    "teacher_id" integer not null,
    "id" text not null
);


create table "public"."CommentLikes" (
    "is_like" boolean not null,
    "created_by" text not null,
    "comment_id" text not null
);


create table "public"."Country" (
    "id" integer not null default nextval('"Country_id_seq"'::regclass),
    "name" text not null
);


create table "public"."Course" (
    "name" text not null,
    "description" text,
    "short_name" text not null,
    "course_code" text,
    "status" "Status" default 'active'::"Status",
    "created_by" text not null,
    "created_at" timestamp(3) without time zone not null default CURRENT_TIMESTAMP,
    "updated_at" timestamp(3) without time zone not null,
    "id" integer not null default nextval('"Course_id_seq"'::regclass),
    "faculty_id" integer not null
);


create table "public"."CourseTeacher" (
    "quality" numeric(65,30),
    "difficulty" numeric(65,30),
    "status" "Status" not null default 'active'::"Status",
    "created_at" timestamp(3) without time zone not null default CURRENT_TIMESTAMP,
    "updated_at" timestamp(3) without time zone not null,
    "created_by" text not null,
    "course_id" integer not null,
    "teacher_id" integer not null,
    "teacher_class_name" text
);


create table "public"."Degree" (
    "name" text not null,
    "description" text,
    "duration" numeric(65,30),
    "status" "Status" default 'active'::"Status",
    "created_by" text not null,
    "created_at" timestamp(3) without time zone not null default CURRENT_TIMESTAMP,
    "updated_at" timestamp(3) without time zone not null,
    "slug" text,
    "id" integer not null default nextval('"Degree_id_seq"'::regclass),
    "faculty_id" integer not null
);


create table "public"."DegreeComent" (
    "user_id" text not null,
    "degree_id" integer not null,
    "comment" text not null,
    "created_at" timestamp(3) without time zone not null default CURRENT_TIMESTAMP,
    "updated_at" timestamp(3) without time zone not null
);


create table "public"."DegreeCourse" (
    "created_at" timestamp(3) without time zone not null default CURRENT_TIMESTAMP,
    "updated_at" timestamp(3) without time zone not null,
    "created_by" text not null,
    "degree_id" integer not null,
    "course_id" integer not null
);


create table "public"."Faculty" (
    "name" text not null,
    "status" "Status" default 'active'::"Status",
    "created_by" text not null,
    "created_at" timestamp(3) without time zone not null default CURRENT_TIMESTAMP,
    "updated_at" timestamp(3) without time zone not null,
    "slug" text,
    "id" integer not null default nextval('"Faculty_id_seq"'::regclass),
    "university_id" integer not null
);


create table "public"."FacultyComment" (
    "user_id" text not null,
    "faculty_id" integer not null,
    "comment" text not null,
    "created_at" timestamp(3) without time zone not null default CURRENT_TIMESTAMP,
    "updated_at" timestamp(3) without time zone not null
);


create table "public"."ResourceReports" (
    "resource_id" integer not null,
    "created_by" text not null,
    "created_at" timestamp(3) without time zone not null default CURRENT_TIMESTAMP,
    "updated_at" timestamp(3) without time zone not null
);


create table "public"."Resources" (
    "id" integer not null default nextval('"Resources_id_seq"'::regclass),
    "name" text not null,
    "url" text not null,
    "category" "ResourceCategory" not null default 'other'::"ResourceCategory",
    "created_by" text not null,
    "created_at" timestamp(3) without time zone not null default CURRENT_TIMESTAMP,
    "updated_at" timestamp(3) without time zone not null,
    "course_id" integer not null,
    "teacher_id" integer not null,
    "reports" integer default 0
);


create table "public"."Teacher" (
    "name" text not null,
    "last_name" text not null,
    "score" integer,
    "status" "Status" default 'active'::"Status",
    "created_by" text not null,
    "created_at" timestamp(3) without time zone not null default CURRENT_TIMESTAMP,
    "updated_at" timestamp(3) without time zone not null,
    "id" integer not null default nextval('"Teacher_id_seq"'::regclass),
    "university_id" integer not null
);


create table "public"."University" (
    "name" text not null,
    "website" text,
    "phone" text,
    "status" "Status" default 'active'::"Status",
    "created_by" text not null,
    "created_at" timestamp(3) without time zone not null default CURRENT_TIMESTAMP,
    "updated_at" timestamp(3) without time zone not null,
    "country_id" integer not null,
    "slug" text not null,
    "id" integer not null default nextval('"University_id_seq"'::regclass)
);


create table "public"."UniversityComment" (
    "user_id" text not null,
    "university_id" integer not null,
    "comment" text not null,
    "created_at" timestamp(3) without time zone not null default CURRENT_TIMESTAMP,
    "updated_at" timestamp(3) without time zone not null
);


create table "public"."User" (
    "id" text not null,
    "email" text not null,
    "password" text not null,
    "username" text not null,
    "rol" "Rol" not null default 'normal'::"Rol",
    "status" "UserStatus" not null default 'active'::"UserStatus",
    "is_verified" boolean not null default false,
    "university_id" text,
    "degree_id" text,
    "created_at" timestamp(3) without time zone not null default CURRENT_TIMESTAMP,
    "updated_at" timestamp(3) without time zone not null,
    "reset_token" text,
    "confirm_token" text,
    "profile_img" text
);


create table "public"."_prisma_migrations" (
    "id" character varying(36) not null,
    "checksum" character varying(64) not null,
    "finished_at" timestamp with time zone,
    "migration_name" character varying(255) not null,
    "logs" text,
    "rolled_back_at" timestamp with time zone,
    "started_at" timestamp with time zone not null default now(),
    "applied_steps_count" integer not null default 0
);


alter sequence "public"."Country_id_seq" owned by "public"."Country"."id";

alter sequence "public"."Course_id_seq" owned by "public"."Course"."id";

alter sequence "public"."Degree_id_seq" owned by "public"."Degree"."id";

alter sequence "public"."Faculty_id_seq" owned by "public"."Faculty"."id";

alter sequence "public"."Resources_id_seq" owned by "public"."Resources"."id";

alter sequence "public"."Teacher_id_seq" owned by "public"."Teacher"."id";

alter sequence "public"."University_id_seq" owned by "public"."University"."id";

CREATE UNIQUE INDEX "CommentLikes_pkey" ON public."CommentLikes" USING btree (comment_id, created_by);

CREATE UNIQUE INDEX "Comment_id_key" ON public."Comment" USING btree (id);

CREATE UNIQUE INDEX "Comment_pkey" ON public."Comment" USING btree (id);

CREATE UNIQUE INDEX "Country_name_key" ON public."Country" USING btree (name);

CREATE UNIQUE INDEX "Country_pkey" ON public."Country" USING btree (id);

CREATE UNIQUE INDEX "CourseTeacher_pkey" ON public."CourseTeacher" USING btree (course_id, teacher_id);

CREATE UNIQUE INDEX "Course_id_key" ON public."Course" USING btree (id);

CREATE UNIQUE INDEX "Course_pkey" ON public."Course" USING btree (id);

CREATE UNIQUE INDEX "DegreeComent_pkey" ON public."DegreeComent" USING btree (user_id, degree_id);

CREATE UNIQUE INDEX "DegreeCourse_pkey" ON public."DegreeCourse" USING btree (degree_id, course_id);

CREATE UNIQUE INDEX "Degree_id_key" ON public."Degree" USING btree (id);

CREATE UNIQUE INDEX "Degree_pkey" ON public."Degree" USING btree (id);

CREATE UNIQUE INDEX "Degree_slug_key" ON public."Degree" USING btree (slug);

CREATE UNIQUE INDEX "FacultyComment_pkey" ON public."FacultyComment" USING btree (user_id, faculty_id);

CREATE UNIQUE INDEX "Faculty_id_key" ON public."Faculty" USING btree (id);

CREATE UNIQUE INDEX "Faculty_pkey" ON public."Faculty" USING btree (id);

CREATE UNIQUE INDEX "Faculty_slug_key" ON public."Faculty" USING btree (slug);

CREATE UNIQUE INDEX "ResourceReports_pkey" ON public."ResourceReports" USING btree (resource_id, created_by);

CREATE UNIQUE INDEX "Resources_id_key" ON public."Resources" USING btree (id);

CREATE UNIQUE INDEX "Resources_pkey" ON public."Resources" USING btree (id);

CREATE UNIQUE INDEX "Teacher_id_key" ON public."Teacher" USING btree (id);

CREATE UNIQUE INDEX "Teacher_pkey" ON public."Teacher" USING btree (id);

CREATE UNIQUE INDEX "UniversityComment_pkey" ON public."UniversityComment" USING btree (user_id, university_id);

CREATE UNIQUE INDEX "University_id_key" ON public."University" USING btree (id);

CREATE UNIQUE INDEX "University_pkey" ON public."University" USING btree (id);

CREATE UNIQUE INDEX "University_slug_key" ON public."University" USING btree (slug);

CREATE UNIQUE INDEX "User_confirm_token_key" ON public."User" USING btree (confirm_token);

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);

CREATE UNIQUE INDEX "User_id_key" ON public."User" USING btree (id);

CREATE UNIQUE INDEX "User_pkey" ON public."User" USING btree (id);

CREATE UNIQUE INDEX "User_reset_token_key" ON public."User" USING btree (reset_token);

CREATE UNIQUE INDEX "User_username_key" ON public."User" USING btree (username);

CREATE UNIQUE INDEX _prisma_migrations_pkey ON public._prisma_migrations USING btree (id);

CREATE UNIQUE INDEX unique_course_by_faculty ON public."Course" USING btree (name, faculty_id);

CREATE UNIQUE INDEX unique_degree_by_faculty ON public."Degree" USING btree (name, faculty_id);

CREATE UNIQUE INDEX unique_faculty_by_university ON public."Faculty" USING btree (name, university_id);

CREATE UNIQUE INDEX unique_teacher_by_university ON public."Teacher" USING btree (name, last_name, university_id);

CREATE UNIQUE INDEX unique_university_by_country ON public."University" USING btree (name, country_id);

alter table "public"."Comment" add constraint "Comment_pkey" PRIMARY KEY using index "Comment_pkey";

alter table "public"."CommentLikes" add constraint "CommentLikes_pkey" PRIMARY KEY using index "CommentLikes_pkey";

alter table "public"."Country" add constraint "Country_pkey" PRIMARY KEY using index "Country_pkey";

alter table "public"."Course" add constraint "Course_pkey" PRIMARY KEY using index "Course_pkey";

alter table "public"."CourseTeacher" add constraint "CourseTeacher_pkey" PRIMARY KEY using index "CourseTeacher_pkey";

alter table "public"."Degree" add constraint "Degree_pkey" PRIMARY KEY using index "Degree_pkey";

alter table "public"."DegreeComent" add constraint "DegreeComent_pkey" PRIMARY KEY using index "DegreeComent_pkey";

alter table "public"."DegreeCourse" add constraint "DegreeCourse_pkey" PRIMARY KEY using index "DegreeCourse_pkey";

alter table "public"."Faculty" add constraint "Faculty_pkey" PRIMARY KEY using index "Faculty_pkey";

alter table "public"."FacultyComment" add constraint "FacultyComment_pkey" PRIMARY KEY using index "FacultyComment_pkey";

alter table "public"."ResourceReports" add constraint "ResourceReports_pkey" PRIMARY KEY using index "ResourceReports_pkey";

alter table "public"."Resources" add constraint "Resources_pkey" PRIMARY KEY using index "Resources_pkey";

alter table "public"."Teacher" add constraint "Teacher_pkey" PRIMARY KEY using index "Teacher_pkey";

alter table "public"."University" add constraint "University_pkey" PRIMARY KEY using index "University_pkey";

alter table "public"."UniversityComment" add constraint "UniversityComment_pkey" PRIMARY KEY using index "UniversityComment_pkey";

alter table "public"."User" add constraint "User_pkey" PRIMARY KEY using index "User_pkey";

alter table "public"."_prisma_migrations" add constraint "_prisma_migrations_pkey" PRIMARY KEY using index "_prisma_migrations_pkey";

alter table "public"."Comment" add constraint "Comment_course_id_teacher_id_fkey" FOREIGN KEY (course_id, teacher_id) REFERENCES "CourseTeacher"(course_id, teacher_id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."Comment" validate constraint "Comment_course_id_teacher_id_fkey";

alter table "public"."Comment" add constraint "Comment_created_by_fkey" FOREIGN KEY (created_by) REFERENCES "User"(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."Comment" validate constraint "Comment_created_by_fkey";

alter table "public"."CommentLikes" add constraint "CommentLikes_comment_id_fkey" FOREIGN KEY (comment_id) REFERENCES "Comment"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."CommentLikes" validate constraint "CommentLikes_comment_id_fkey";

alter table "public"."CommentLikes" add constraint "CommentLikes_created_by_fkey" FOREIGN KEY (created_by) REFERENCES "User"(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."CommentLikes" validate constraint "CommentLikes_created_by_fkey";

alter table "public"."Course" add constraint "Course_created_by_fkey" FOREIGN KEY (created_by) REFERENCES "User"(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."Course" validate constraint "Course_created_by_fkey";

alter table "public"."Course" add constraint "Course_faculty_id_fkey" FOREIGN KEY (faculty_id) REFERENCES "Faculty"(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."Course" validate constraint "Course_faculty_id_fkey";

alter table "public"."CourseTeacher" add constraint "CourseTeacher_course_id_fkey" FOREIGN KEY (course_id) REFERENCES "Course"(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."CourseTeacher" validate constraint "CourseTeacher_course_id_fkey";

alter table "public"."CourseTeacher" add constraint "CourseTeacher_created_by_fkey" FOREIGN KEY (created_by) REFERENCES "User"(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."CourseTeacher" validate constraint "CourseTeacher_created_by_fkey";

alter table "public"."CourseTeacher" add constraint "CourseTeacher_teacher_id_fkey" FOREIGN KEY (teacher_id) REFERENCES "Teacher"(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."CourseTeacher" validate constraint "CourseTeacher_teacher_id_fkey";

alter table "public"."Degree" add constraint "Degree_created_by_fkey" FOREIGN KEY (created_by) REFERENCES "User"(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."Degree" validate constraint "Degree_created_by_fkey";

alter table "public"."Degree" add constraint "Degree_faculty_id_fkey" FOREIGN KEY (faculty_id) REFERENCES "Faculty"(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."Degree" validate constraint "Degree_faculty_id_fkey";

alter table "public"."DegreeComent" add constraint "DegreeComent_degree_id_fkey" FOREIGN KEY (degree_id) REFERENCES "Degree"(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."DegreeComent" validate constraint "DegreeComent_degree_id_fkey";

alter table "public"."DegreeComent" add constraint "DegreeComent_user_id_fkey" FOREIGN KEY (user_id) REFERENCES "User"(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."DegreeComent" validate constraint "DegreeComent_user_id_fkey";

alter table "public"."DegreeCourse" add constraint "DegreeCourse_course_id_fkey" FOREIGN KEY (course_id) REFERENCES "Course"(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."DegreeCourse" validate constraint "DegreeCourse_course_id_fkey";

alter table "public"."DegreeCourse" add constraint "DegreeCourse_created_by_fkey" FOREIGN KEY (created_by) REFERENCES "User"(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."DegreeCourse" validate constraint "DegreeCourse_created_by_fkey";

alter table "public"."DegreeCourse" add constraint "DegreeCourse_degree_id_fkey" FOREIGN KEY (degree_id) REFERENCES "Degree"(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."DegreeCourse" validate constraint "DegreeCourse_degree_id_fkey";

alter table "public"."Faculty" add constraint "Faculty_created_by_fkey" FOREIGN KEY (created_by) REFERENCES "User"(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."Faculty" validate constraint "Faculty_created_by_fkey";

alter table "public"."Faculty" add constraint "Faculty_university_id_fkey" FOREIGN KEY (university_id) REFERENCES "University"(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."Faculty" validate constraint "Faculty_university_id_fkey";

alter table "public"."FacultyComment" add constraint "FacultyComment_faculty_id_fkey" FOREIGN KEY (faculty_id) REFERENCES "Faculty"(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."FacultyComment" validate constraint "FacultyComment_faculty_id_fkey";

alter table "public"."FacultyComment" add constraint "FacultyComment_user_id_fkey" FOREIGN KEY (user_id) REFERENCES "User"(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."FacultyComment" validate constraint "FacultyComment_user_id_fkey";

alter table "public"."ResourceReports" add constraint "ResourceReports_created_by_fkey" FOREIGN KEY (created_by) REFERENCES "User"(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."ResourceReports" validate constraint "ResourceReports_created_by_fkey";

alter table "public"."ResourceReports" add constraint "ResourceReports_resource_id_fkey" FOREIGN KEY (resource_id) REFERENCES "Resources"(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."ResourceReports" validate constraint "ResourceReports_resource_id_fkey";

alter table "public"."Resources" add constraint "Resources_course_id_teacher_id_fkey" FOREIGN KEY (course_id, teacher_id) REFERENCES "CourseTeacher"(course_id, teacher_id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."Resources" validate constraint "Resources_course_id_teacher_id_fkey";

alter table "public"."Resources" add constraint "Resources_created_by_fkey" FOREIGN KEY (created_by) REFERENCES "User"(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."Resources" validate constraint "Resources_created_by_fkey";

alter table "public"."Teacher" add constraint "Teacher_created_by_fkey" FOREIGN KEY (created_by) REFERENCES "User"(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."Teacher" validate constraint "Teacher_created_by_fkey";

alter table "public"."Teacher" add constraint "Teacher_university_id_fkey" FOREIGN KEY (university_id) REFERENCES "University"(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."Teacher" validate constraint "Teacher_university_id_fkey";

alter table "public"."University" add constraint "University_country_id_fkey" FOREIGN KEY (country_id) REFERENCES "Country"(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."University" validate constraint "University_country_id_fkey";

alter table "public"."University" add constraint "University_created_by_fkey" FOREIGN KEY (created_by) REFERENCES "User"(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."University" validate constraint "University_created_by_fkey";

alter table "public"."UniversityComment" add constraint "UniversityComment_university_id_fkey" FOREIGN KEY (university_id) REFERENCES "University"(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."UniversityComment" validate constraint "UniversityComment_university_id_fkey";

alter table "public"."UniversityComment" add constraint "UniversityComment_user_id_fkey" FOREIGN KEY (user_id) REFERENCES "User"(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."UniversityComment" validate constraint "UniversityComment_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_resource_reports()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$BEGIN
  UPDATE public."Resources"
  SET reports = (
    SELECT COUNT(*) FROM public."ResourceReports"
    WHERE resource_id = COALESCE(NEW.resource_id, OLD.resource_id)
  )
  WHERE id = COALESCE(NEW.resource_id, OLD.resource_id);

  RETURN NULL;
END;$function$
;

grant delete on table "public"."Comment" to "anon";

grant insert on table "public"."Comment" to "anon";

grant references on table "public"."Comment" to "anon";

grant select on table "public"."Comment" to "anon";

grant trigger on table "public"."Comment" to "anon";

grant truncate on table "public"."Comment" to "anon";

grant update on table "public"."Comment" to "anon";

grant delete on table "public"."Comment" to "authenticated";

grant insert on table "public"."Comment" to "authenticated";

grant references on table "public"."Comment" to "authenticated";

grant select on table "public"."Comment" to "authenticated";

grant trigger on table "public"."Comment" to "authenticated";

grant truncate on table "public"."Comment" to "authenticated";

grant update on table "public"."Comment" to "authenticated";

grant delete on table "public"."Comment" to "service_role";

grant insert on table "public"."Comment" to "service_role";

grant references on table "public"."Comment" to "service_role";

grant select on table "public"."Comment" to "service_role";

grant trigger on table "public"."Comment" to "service_role";

grant truncate on table "public"."Comment" to "service_role";

grant update on table "public"."Comment" to "service_role";

grant delete on table "public"."CommentLikes" to "anon";

grant insert on table "public"."CommentLikes" to "anon";

grant references on table "public"."CommentLikes" to "anon";

grant select on table "public"."CommentLikes" to "anon";

grant trigger on table "public"."CommentLikes" to "anon";

grant truncate on table "public"."CommentLikes" to "anon";

grant update on table "public"."CommentLikes" to "anon";

grant delete on table "public"."CommentLikes" to "authenticated";

grant insert on table "public"."CommentLikes" to "authenticated";

grant references on table "public"."CommentLikes" to "authenticated";

grant select on table "public"."CommentLikes" to "authenticated";

grant trigger on table "public"."CommentLikes" to "authenticated";

grant truncate on table "public"."CommentLikes" to "authenticated";

grant update on table "public"."CommentLikes" to "authenticated";

grant delete on table "public"."CommentLikes" to "service_role";

grant insert on table "public"."CommentLikes" to "service_role";

grant references on table "public"."CommentLikes" to "service_role";

grant select on table "public"."CommentLikes" to "service_role";

grant trigger on table "public"."CommentLikes" to "service_role";

grant truncate on table "public"."CommentLikes" to "service_role";

grant update on table "public"."CommentLikes" to "service_role";

grant delete on table "public"."Country" to "anon";

grant insert on table "public"."Country" to "anon";

grant references on table "public"."Country" to "anon";

grant select on table "public"."Country" to "anon";

grant trigger on table "public"."Country" to "anon";

grant truncate on table "public"."Country" to "anon";

grant update on table "public"."Country" to "anon";

grant delete on table "public"."Country" to "authenticated";

grant insert on table "public"."Country" to "authenticated";

grant references on table "public"."Country" to "authenticated";

grant select on table "public"."Country" to "authenticated";

grant trigger on table "public"."Country" to "authenticated";

grant truncate on table "public"."Country" to "authenticated";

grant update on table "public"."Country" to "authenticated";

grant delete on table "public"."Country" to "service_role";

grant insert on table "public"."Country" to "service_role";

grant references on table "public"."Country" to "service_role";

grant select on table "public"."Country" to "service_role";

grant trigger on table "public"."Country" to "service_role";

grant truncate on table "public"."Country" to "service_role";

grant update on table "public"."Country" to "service_role";

grant delete on table "public"."Course" to "anon";

grant insert on table "public"."Course" to "anon";

grant references on table "public"."Course" to "anon";

grant select on table "public"."Course" to "anon";

grant trigger on table "public"."Course" to "anon";

grant truncate on table "public"."Course" to "anon";

grant update on table "public"."Course" to "anon";

grant delete on table "public"."Course" to "authenticated";

grant insert on table "public"."Course" to "authenticated";

grant references on table "public"."Course" to "authenticated";

grant select on table "public"."Course" to "authenticated";

grant trigger on table "public"."Course" to "authenticated";

grant truncate on table "public"."Course" to "authenticated";

grant update on table "public"."Course" to "authenticated";

grant delete on table "public"."Course" to "service_role";

grant insert on table "public"."Course" to "service_role";

grant references on table "public"."Course" to "service_role";

grant select on table "public"."Course" to "service_role";

grant trigger on table "public"."Course" to "service_role";

grant truncate on table "public"."Course" to "service_role";

grant update on table "public"."Course" to "service_role";

grant delete on table "public"."CourseTeacher" to "anon";

grant insert on table "public"."CourseTeacher" to "anon";

grant references on table "public"."CourseTeacher" to "anon";

grant select on table "public"."CourseTeacher" to "anon";

grant trigger on table "public"."CourseTeacher" to "anon";

grant truncate on table "public"."CourseTeacher" to "anon";

grant update on table "public"."CourseTeacher" to "anon";

grant delete on table "public"."CourseTeacher" to "authenticated";

grant insert on table "public"."CourseTeacher" to "authenticated";

grant references on table "public"."CourseTeacher" to "authenticated";

grant select on table "public"."CourseTeacher" to "authenticated";

grant trigger on table "public"."CourseTeacher" to "authenticated";

grant truncate on table "public"."CourseTeacher" to "authenticated";

grant update on table "public"."CourseTeacher" to "authenticated";

grant delete on table "public"."CourseTeacher" to "service_role";

grant insert on table "public"."CourseTeacher" to "service_role";

grant references on table "public"."CourseTeacher" to "service_role";

grant select on table "public"."CourseTeacher" to "service_role";

grant trigger on table "public"."CourseTeacher" to "service_role";

grant truncate on table "public"."CourseTeacher" to "service_role";

grant update on table "public"."CourseTeacher" to "service_role";

grant delete on table "public"."Degree" to "anon";

grant insert on table "public"."Degree" to "anon";

grant references on table "public"."Degree" to "anon";

grant select on table "public"."Degree" to "anon";

grant trigger on table "public"."Degree" to "anon";

grant truncate on table "public"."Degree" to "anon";

grant update on table "public"."Degree" to "anon";

grant delete on table "public"."Degree" to "authenticated";

grant insert on table "public"."Degree" to "authenticated";

grant references on table "public"."Degree" to "authenticated";

grant select on table "public"."Degree" to "authenticated";

grant trigger on table "public"."Degree" to "authenticated";

grant truncate on table "public"."Degree" to "authenticated";

grant update on table "public"."Degree" to "authenticated";

grant delete on table "public"."Degree" to "service_role";

grant insert on table "public"."Degree" to "service_role";

grant references on table "public"."Degree" to "service_role";

grant select on table "public"."Degree" to "service_role";

grant trigger on table "public"."Degree" to "service_role";

grant truncate on table "public"."Degree" to "service_role";

grant update on table "public"."Degree" to "service_role";

grant delete on table "public"."DegreeComent" to "anon";

grant insert on table "public"."DegreeComent" to "anon";

grant references on table "public"."DegreeComent" to "anon";

grant select on table "public"."DegreeComent" to "anon";

grant trigger on table "public"."DegreeComent" to "anon";

grant truncate on table "public"."DegreeComent" to "anon";

grant update on table "public"."DegreeComent" to "anon";

grant delete on table "public"."DegreeComent" to "authenticated";

grant insert on table "public"."DegreeComent" to "authenticated";

grant references on table "public"."DegreeComent" to "authenticated";

grant select on table "public"."DegreeComent" to "authenticated";

grant trigger on table "public"."DegreeComent" to "authenticated";

grant truncate on table "public"."DegreeComent" to "authenticated";

grant update on table "public"."DegreeComent" to "authenticated";

grant delete on table "public"."DegreeComent" to "service_role";

grant insert on table "public"."DegreeComent" to "service_role";

grant references on table "public"."DegreeComent" to "service_role";

grant select on table "public"."DegreeComent" to "service_role";

grant trigger on table "public"."DegreeComent" to "service_role";

grant truncate on table "public"."DegreeComent" to "service_role";

grant update on table "public"."DegreeComent" to "service_role";

grant delete on table "public"."DegreeCourse" to "anon";

grant insert on table "public"."DegreeCourse" to "anon";

grant references on table "public"."DegreeCourse" to "anon";

grant select on table "public"."DegreeCourse" to "anon";

grant trigger on table "public"."DegreeCourse" to "anon";

grant truncate on table "public"."DegreeCourse" to "anon";

grant update on table "public"."DegreeCourse" to "anon";

grant delete on table "public"."DegreeCourse" to "authenticated";

grant insert on table "public"."DegreeCourse" to "authenticated";

grant references on table "public"."DegreeCourse" to "authenticated";

grant select on table "public"."DegreeCourse" to "authenticated";

grant trigger on table "public"."DegreeCourse" to "authenticated";

grant truncate on table "public"."DegreeCourse" to "authenticated";

grant update on table "public"."DegreeCourse" to "authenticated";

grant delete on table "public"."DegreeCourse" to "service_role";

grant insert on table "public"."DegreeCourse" to "service_role";

grant references on table "public"."DegreeCourse" to "service_role";

grant select on table "public"."DegreeCourse" to "service_role";

grant trigger on table "public"."DegreeCourse" to "service_role";

grant truncate on table "public"."DegreeCourse" to "service_role";

grant update on table "public"."DegreeCourse" to "service_role";

grant delete on table "public"."Faculty" to "anon";

grant insert on table "public"."Faculty" to "anon";

grant references on table "public"."Faculty" to "anon";

grant select on table "public"."Faculty" to "anon";

grant trigger on table "public"."Faculty" to "anon";

grant truncate on table "public"."Faculty" to "anon";

grant update on table "public"."Faculty" to "anon";

grant delete on table "public"."Faculty" to "authenticated";

grant insert on table "public"."Faculty" to "authenticated";

grant references on table "public"."Faculty" to "authenticated";

grant select on table "public"."Faculty" to "authenticated";

grant trigger on table "public"."Faculty" to "authenticated";

grant truncate on table "public"."Faculty" to "authenticated";

grant update on table "public"."Faculty" to "authenticated";

grant delete on table "public"."Faculty" to "service_role";

grant insert on table "public"."Faculty" to "service_role";

grant references on table "public"."Faculty" to "service_role";

grant select on table "public"."Faculty" to "service_role";

grant trigger on table "public"."Faculty" to "service_role";

grant truncate on table "public"."Faculty" to "service_role";

grant update on table "public"."Faculty" to "service_role";

grant delete on table "public"."FacultyComment" to "anon";

grant insert on table "public"."FacultyComment" to "anon";

grant references on table "public"."FacultyComment" to "anon";

grant select on table "public"."FacultyComment" to "anon";

grant trigger on table "public"."FacultyComment" to "anon";

grant truncate on table "public"."FacultyComment" to "anon";

grant update on table "public"."FacultyComment" to "anon";

grant delete on table "public"."FacultyComment" to "authenticated";

grant insert on table "public"."FacultyComment" to "authenticated";

grant references on table "public"."FacultyComment" to "authenticated";

grant select on table "public"."FacultyComment" to "authenticated";

grant trigger on table "public"."FacultyComment" to "authenticated";

grant truncate on table "public"."FacultyComment" to "authenticated";

grant update on table "public"."FacultyComment" to "authenticated";

grant delete on table "public"."FacultyComment" to "service_role";

grant insert on table "public"."FacultyComment" to "service_role";

grant references on table "public"."FacultyComment" to "service_role";

grant select on table "public"."FacultyComment" to "service_role";

grant trigger on table "public"."FacultyComment" to "service_role";

grant truncate on table "public"."FacultyComment" to "service_role";

grant update on table "public"."FacultyComment" to "service_role";

grant delete on table "public"."ResourceReports" to "anon";

grant insert on table "public"."ResourceReports" to "anon";

grant references on table "public"."ResourceReports" to "anon";

grant select on table "public"."ResourceReports" to "anon";

grant trigger on table "public"."ResourceReports" to "anon";

grant truncate on table "public"."ResourceReports" to "anon";

grant update on table "public"."ResourceReports" to "anon";

grant delete on table "public"."ResourceReports" to "authenticated";

grant insert on table "public"."ResourceReports" to "authenticated";

grant references on table "public"."ResourceReports" to "authenticated";

grant select on table "public"."ResourceReports" to "authenticated";

grant trigger on table "public"."ResourceReports" to "authenticated";

grant truncate on table "public"."ResourceReports" to "authenticated";

grant update on table "public"."ResourceReports" to "authenticated";

grant delete on table "public"."ResourceReports" to "service_role";

grant insert on table "public"."ResourceReports" to "service_role";

grant references on table "public"."ResourceReports" to "service_role";

grant select on table "public"."ResourceReports" to "service_role";

grant trigger on table "public"."ResourceReports" to "service_role";

grant truncate on table "public"."ResourceReports" to "service_role";

grant update on table "public"."ResourceReports" to "service_role";

grant delete on table "public"."Resources" to "anon";

grant insert on table "public"."Resources" to "anon";

grant references on table "public"."Resources" to "anon";

grant select on table "public"."Resources" to "anon";

grant trigger on table "public"."Resources" to "anon";

grant truncate on table "public"."Resources" to "anon";

grant update on table "public"."Resources" to "anon";

grant delete on table "public"."Resources" to "authenticated";

grant insert on table "public"."Resources" to "authenticated";

grant references on table "public"."Resources" to "authenticated";

grant select on table "public"."Resources" to "authenticated";

grant trigger on table "public"."Resources" to "authenticated";

grant truncate on table "public"."Resources" to "authenticated";

grant update on table "public"."Resources" to "authenticated";

grant delete on table "public"."Resources" to "service_role";

grant insert on table "public"."Resources" to "service_role";

grant references on table "public"."Resources" to "service_role";

grant select on table "public"."Resources" to "service_role";

grant trigger on table "public"."Resources" to "service_role";

grant truncate on table "public"."Resources" to "service_role";

grant update on table "public"."Resources" to "service_role";

grant delete on table "public"."Teacher" to "anon";

grant insert on table "public"."Teacher" to "anon";

grant references on table "public"."Teacher" to "anon";

grant select on table "public"."Teacher" to "anon";

grant trigger on table "public"."Teacher" to "anon";

grant truncate on table "public"."Teacher" to "anon";

grant update on table "public"."Teacher" to "anon";

grant delete on table "public"."Teacher" to "authenticated";

grant insert on table "public"."Teacher" to "authenticated";

grant references on table "public"."Teacher" to "authenticated";

grant select on table "public"."Teacher" to "authenticated";

grant trigger on table "public"."Teacher" to "authenticated";

grant truncate on table "public"."Teacher" to "authenticated";

grant update on table "public"."Teacher" to "authenticated";

grant delete on table "public"."Teacher" to "service_role";

grant insert on table "public"."Teacher" to "service_role";

grant references on table "public"."Teacher" to "service_role";

grant select on table "public"."Teacher" to "service_role";

grant trigger on table "public"."Teacher" to "service_role";

grant truncate on table "public"."Teacher" to "service_role";

grant update on table "public"."Teacher" to "service_role";

grant delete on table "public"."University" to "anon";

grant insert on table "public"."University" to "anon";

grant references on table "public"."University" to "anon";

grant select on table "public"."University" to "anon";

grant trigger on table "public"."University" to "anon";

grant truncate on table "public"."University" to "anon";

grant update on table "public"."University" to "anon";

grant delete on table "public"."University" to "authenticated";

grant insert on table "public"."University" to "authenticated";

grant references on table "public"."University" to "authenticated";

grant select on table "public"."University" to "authenticated";

grant trigger on table "public"."University" to "authenticated";

grant truncate on table "public"."University" to "authenticated";

grant update on table "public"."University" to "authenticated";

grant delete on table "public"."University" to "service_role";

grant insert on table "public"."University" to "service_role";

grant references on table "public"."University" to "service_role";

grant select on table "public"."University" to "service_role";

grant trigger on table "public"."University" to "service_role";

grant truncate on table "public"."University" to "service_role";

grant update on table "public"."University" to "service_role";

grant delete on table "public"."UniversityComment" to "anon";

grant insert on table "public"."UniversityComment" to "anon";

grant references on table "public"."UniversityComment" to "anon";

grant select on table "public"."UniversityComment" to "anon";

grant trigger on table "public"."UniversityComment" to "anon";

grant truncate on table "public"."UniversityComment" to "anon";

grant update on table "public"."UniversityComment" to "anon";

grant delete on table "public"."UniversityComment" to "authenticated";

grant insert on table "public"."UniversityComment" to "authenticated";

grant references on table "public"."UniversityComment" to "authenticated";

grant select on table "public"."UniversityComment" to "authenticated";

grant trigger on table "public"."UniversityComment" to "authenticated";

grant truncate on table "public"."UniversityComment" to "authenticated";

grant update on table "public"."UniversityComment" to "authenticated";

grant delete on table "public"."UniversityComment" to "service_role";

grant insert on table "public"."UniversityComment" to "service_role";

grant references on table "public"."UniversityComment" to "service_role";

grant select on table "public"."UniversityComment" to "service_role";

grant trigger on table "public"."UniversityComment" to "service_role";

grant truncate on table "public"."UniversityComment" to "service_role";

grant update on table "public"."UniversityComment" to "service_role";

grant delete on table "public"."User" to "anon";

grant insert on table "public"."User" to "anon";

grant references on table "public"."User" to "anon";

grant select on table "public"."User" to "anon";

grant trigger on table "public"."User" to "anon";

grant truncate on table "public"."User" to "anon";

grant update on table "public"."User" to "anon";

grant delete on table "public"."User" to "authenticated";

grant insert on table "public"."User" to "authenticated";

grant references on table "public"."User" to "authenticated";

grant select on table "public"."User" to "authenticated";

grant trigger on table "public"."User" to "authenticated";

grant truncate on table "public"."User" to "authenticated";

grant update on table "public"."User" to "authenticated";

grant delete on table "public"."User" to "service_role";

grant insert on table "public"."User" to "service_role";

grant references on table "public"."User" to "service_role";

grant select on table "public"."User" to "service_role";

grant trigger on table "public"."User" to "service_role";

grant truncate on table "public"."User" to "service_role";

grant update on table "public"."User" to "service_role";

grant delete on table "public"."_prisma_migrations" to "anon";

grant insert on table "public"."_prisma_migrations" to "anon";

grant references on table "public"."_prisma_migrations" to "anon";

grant select on table "public"."_prisma_migrations" to "anon";

grant trigger on table "public"."_prisma_migrations" to "anon";

grant truncate on table "public"."_prisma_migrations" to "anon";

grant update on table "public"."_prisma_migrations" to "anon";

grant delete on table "public"."_prisma_migrations" to "authenticated";

grant insert on table "public"."_prisma_migrations" to "authenticated";

grant references on table "public"."_prisma_migrations" to "authenticated";

grant select on table "public"."_prisma_migrations" to "authenticated";

grant trigger on table "public"."_prisma_migrations" to "authenticated";

grant truncate on table "public"."_prisma_migrations" to "authenticated";

grant update on table "public"."_prisma_migrations" to "authenticated";

grant delete on table "public"."_prisma_migrations" to "service_role";

grant insert on table "public"."_prisma_migrations" to "service_role";

grant references on table "public"."_prisma_migrations" to "service_role";

grant select on table "public"."_prisma_migrations" to "service_role";

grant trigger on table "public"."_prisma_migrations" to "service_role";

grant truncate on table "public"."_prisma_migrations" to "service_role";

grant update on table "public"."_prisma_migrations" to "service_role";

CREATE TRIGGER update_resource_reports_trigger AFTER INSERT OR DELETE ON public."ResourceReports" FOR EACH ROW EXECUTE FUNCTION update_resource_reports();


