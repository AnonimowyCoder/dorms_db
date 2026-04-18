--
-- PostgreSQL database dump
--

\restrict r1E0SbSA4Tgq1kR4HVayiyg2DpSxxiCWJ9QuD2j6QnLPYd3sVqhSt6yMMyhC7wC

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

-- Started on 2026-04-13 15:12:13

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 219 (class 1259 OID 32769)
-- Name: equipment; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.equipment (
    id integer NOT NULL,
    equipment_name text NOT NULL,
    description text,
    count integer NOT NULL
);


--
-- TOC entry 220 (class 1259 OID 32776)
-- Name: equipment_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.equipment ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.equipment_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 221 (class 1259 OID 32777)
-- Name: parking_lots; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.parking_lots (
    id integer NOT NULL,
    parking_lot_type text,
    placement text
);


--
-- TOC entry 222 (class 1259 OID 32783)
-- Name: parking_lots_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.parking_lots ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.parking_lots_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 223 (class 1259 OID 32784)
-- Name: parking_payments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.parking_payments (
    id integer NOT NULL,
    amount real NOT NULL,
    payment_due_date date NOT NULL,
    id_parking_reservation integer NOT NULL,
    amount_payed real NOT NULL
);


--
-- TOC entry 224 (class 1259 OID 32791)
-- Name: parking_payments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.parking_payments ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.parking_payments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 225 (class 1259 OID 32792)
-- Name: parking_reservations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.parking_reservations (
    id integer NOT NULL,
    start_date_reserv date,
    end_date_reserv date,
    id_parking_lot integer NOT NULL,
    id_resident integer
);


--
-- TOC entry 226 (class 1259 OID 32797)
-- Name: parking_reservations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.parking_reservations ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.parking_reservations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 227 (class 1259 OID 32798)
-- Name: residents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.residents (
    id integer NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    department text
);


--
-- TOC entry 228 (class 1259 OID 32806)
-- Name: residents_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.residents ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.residents_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 229 (class 1259 OID 32807)
-- Name: room_categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.room_categories (
    id integer NOT NULL,
    monthly_rent real NOT NULL,
    if_kitchen boolean,
    category_name text
);


--
-- TOC entry 230 (class 1259 OID 32814)
-- Name: room_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.room_categories ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.room_categories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 231 (class 1259 OID 32815)
-- Name: room_equipment; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.room_equipment (
    id_room integer NOT NULL,
    id_equipment integer NOT NULL,
    count integer NOT NULL CHECK (count > 0)
);


--
-- TOC entry 232 (class 1259 OID 32820)
-- Name: room_payments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.room_payments (
    id integer NOT NULL,
    id_reservation integer NOT NULL,
    amount real NOT NULL,
    payment_due_date date NOT NULL,
    amount_payed real NOT NULL
);


--
-- TOC entry 233 (class 1259 OID 32825)
-- Name: room_payments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.room_payments ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.room_payments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 234 (class 1259 OID 32826)
-- Name: room_reservations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.room_reservations (
    id integer NOT NULL,
    start_date_reserv date NOT NULL,
    end_date_reserv date NOT NULL,
    id_room integer NOT NULL,
    id_resident integer
);


--
-- TOC entry 235 (class 1259 OID 32833)
-- Name: room_reservations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.room_reservations ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.room_reservations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 236 (class 1259 OID 32834)
-- Name: rooms; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.rooms (
    id integer NOT NULL,
    room_number integer NOT NULL,
    floor_number integer NOT NULL,
    num_of_beds integer NOT NULL,
    id_category integer NOT NULL
);


--
-- TOC entry 237 (class 1259 OID 32842)
-- Name: rooms_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.rooms ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.rooms_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 238 (class 1259 OID 32843)
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email text NOT NULL,
    password_hash text NOT NULL,
    role text NOT NULL
);


--
-- TOC entry 239 (class 1259 OID 32852)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5044 (class 0 OID 0)
-- Dependencies: 239
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4858 (class 2604 OID 32853)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 4860 (class 2606 OID 32855)
-- Name: equipment equipment_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.equipment
    ADD CONSTRAINT equipment_pkey PRIMARY KEY (id);


--
-- TOC entry 4862 (class 2606 OID 32857)
-- Name: parking_lots parking_lots_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.parking_lots
    ADD CONSTRAINT parking_lots_pkey PRIMARY KEY (id);


--
-- TOC entry 4864 (class 2606 OID 32859)
-- Name: parking_payments parking_payments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.parking_payments
    ADD CONSTRAINT parking_payments_pkey PRIMARY KEY (id);


--
-- TOC entry 4866 (class 2606 OID 32861)
-- Name: parking_reservations parking_reservations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.parking_reservations
    ADD CONSTRAINT parking_reservations_pkey PRIMARY KEY (id);


--
-- TOC entry 4868 (class 2606 OID 32863)
-- Name: residents residents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.residents
    ADD CONSTRAINT residents_pkey PRIMARY KEY (id);


--
-- TOC entry 4870 (class 2606 OID 32865)
-- Name: room_categories room_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.room_categories
    ADD CONSTRAINT room_categories_pkey PRIMARY KEY (id);


--
-- TOC entry 4872 (class 2606 OID 32867)
-- Name: room_equipment room_equipment_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.room_equipment
    ADD CONSTRAINT room_equipment_pkey PRIMARY KEY (id_room, id_equipment);


--
-- TOC entry 4874 (class 2606 OID 32869)
-- Name: room_payments room_payments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.room_payments
    ADD CONSTRAINT room_payments_pkey PRIMARY KEY (id);


--
-- TOC entry 4876 (class 2606 OID 32871)
-- Name: room_reservations room_reservations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.room_reservations
    ADD CONSTRAINT room_reservations_pkey PRIMARY KEY (id);


--
-- TOC entry 4878 (class 2606 OID 32873)
-- Name: rooms rooms_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rooms
    ADD CONSTRAINT rooms_pkey PRIMARY KEY (id);


--
-- TOC entry 4880 (class 2606 OID 32875)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4882 (class 2606 OID 32877)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4891 (class 2606 OID 32878)
-- Name: rooms fk_category; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rooms
    ADD CONSTRAINT fk_category FOREIGN KEY (id_category) REFERENCES public.room_categories(id);


--
-- TOC entry 4886 (class 2606 OID 32883)
-- Name: room_equipment fk_equipment; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.room_equipment
    ADD CONSTRAINT fk_equipment FOREIGN KEY (id_equipment) REFERENCES public.equipment(id);


--
-- TOC entry 4884 (class 2606 OID 32888)
-- Name: parking_reservations fk_parking_lot; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.parking_reservations
    ADD CONSTRAINT fk_parking_lot FOREIGN KEY (id_parking_lot) REFERENCES public.parking_lots(id);


--
-- TOC entry 4883 (class 2606 OID 32893)
-- Name: parking_payments fk_parking_reservation; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.parking_payments
    ADD CONSTRAINT fk_parking_reservation FOREIGN KEY (id_parking_reservation) REFERENCES public.parking_reservations(id);


--
-- TOC entry 4889 (class 2606 OID 32898)
-- Name: room_reservations fk_resident; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.room_reservations
    ADD CONSTRAINT fk_resident FOREIGN KEY (id_resident) REFERENCES public.residents(id) ON DELETE CASCADE;


--
-- TOC entry 4885 (class 2606 OID 32903)
-- Name: parking_reservations fk_resident_parking_reserv; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.parking_reservations
    ADD CONSTRAINT fk_resident_parking_reserv FOREIGN KEY (id_resident) REFERENCES public.residents(id) ON DELETE CASCADE;


--
-- TOC entry 4887 (class 2606 OID 32908)
-- Name: room_equipment fk_room; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.room_equipment
    ADD CONSTRAINT fk_room FOREIGN KEY (id_room) REFERENCES public.rooms(id);


--
-- TOC entry 4888 (class 2606 OID 32913)
-- Name: room_payments fk_room_reservations; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.room_payments
    ADD CONSTRAINT fk_room_reservations FOREIGN KEY (id_reservation) REFERENCES public.room_reservations(id);


--
-- TOC entry 4890 (class 2606 OID 32918)
-- Name: room_reservations fk_rooms; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.room_reservations
    ADD CONSTRAINT fk_rooms FOREIGN KEY (id_room) REFERENCES public.rooms(id);


-- Completed on 2026-04-13 15:12:13

--
-- PostgreSQL database dump complete
--

\unrestrict r1E0SbSA4Tgq1kR4HVayiyg2DpSxxiCWJ9QuD2j6QnLPYd3sVqhSt6yMMyhC7wC

