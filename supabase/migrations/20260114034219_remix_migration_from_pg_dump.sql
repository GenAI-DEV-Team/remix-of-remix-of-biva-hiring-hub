CREATE EXTENSION IF NOT EXISTS "pg_graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "plpgsql";
CREATE EXTENSION IF NOT EXISTS "supabase_vault";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";
BEGIN;

--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public'
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


SET default_table_access_method = heap;

--
-- Name: departments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.departments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    description text,
    is_active boolean DEFAULT true NOT NULL,
    display_order integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: job_postings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.job_postings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    slug text NOT NULL,
    title text NOT NULL,
    company text NOT NULL,
    salary text,
    work_type text,
    reports_to text,
    email text,
    phone text,
    linkedin text,
    sections jsonb DEFAULT '[]'::jsonb NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    department_id uuid,
    channels jsonb DEFAULT '{"zalo": {"phone": "", "enabled": false, "priority": 2}, "gmail": {"enabled": true, "priority": 1}, "facebook": {"url": "", "enabled": false, "priority": 3}, "linkedin": {"enabled": false, "priority": 4}, "google_form": {"enabled": false, "priority": 5, "sheet_url": ""}}'::jsonb NOT NULL
);


--
-- Name: departments departments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_pkey PRIMARY KEY (id);


--
-- Name: departments departments_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_slug_key UNIQUE (slug);


--
-- Name: job_postings job_postings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_postings
    ADD CONSTRAINT job_postings_pkey PRIMARY KEY (id);


--
-- Name: job_postings job_postings_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_postings
    ADD CONSTRAINT job_postings_slug_key UNIQUE (slug);


--
-- Name: departments update_departments_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON public.departments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: job_postings update_job_postings_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_job_postings_updated_at BEFORE UPDATE ON public.job_postings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: job_postings job_postings_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_postings
    ADD CONSTRAINT job_postings_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id) ON DELETE SET NULL;


--
-- Name: departments Anyone can view active departments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view active departments" ON public.departments FOR SELECT USING ((is_active = true));


--
-- Name: job_postings Anyone can view active job postings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view active job postings" ON public.job_postings FOR SELECT USING ((is_active = true));


--
-- Name: departments Authenticated users can delete departments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can delete departments" ON public.departments FOR DELETE TO authenticated USING (true);


--
-- Name: job_postings Authenticated users can delete job postings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can delete job postings" ON public.job_postings FOR DELETE TO authenticated USING (true);


--
-- Name: departments Authenticated users can insert departments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can insert departments" ON public.departments FOR INSERT TO authenticated WITH CHECK (true);


--
-- Name: job_postings Authenticated users can insert job postings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can insert job postings" ON public.job_postings FOR INSERT TO authenticated WITH CHECK (true);


--
-- Name: departments Authenticated users can update departments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can update departments" ON public.departments FOR UPDATE TO authenticated USING (true);


--
-- Name: job_postings Authenticated users can update job postings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can update job postings" ON public.job_postings FOR UPDATE TO authenticated USING (true);


--
-- Name: departments; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

--
-- Name: job_postings; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--




COMMIT;