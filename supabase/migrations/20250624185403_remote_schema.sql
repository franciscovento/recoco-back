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

CREATE TRIGGER update_resource_reports_trigger AFTER INSERT OR DELETE ON public."ResourceReports" FOR EACH ROW EXECUTE FUNCTION update_resource_reports();


