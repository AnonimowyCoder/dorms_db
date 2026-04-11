--
-- PostgreSQL database dump
--

\restrict GNNh8TW9i3rgki0Y97xpkYOhI1TQoTNCWfunr8IHAQnZhvRUeooAeJNrA2hCdic

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

-- Started on 2026-04-09 18:47:54

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
-- TOC entry 219 (class 1259 OID 16389)
-- Name: equipment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.equipment (
    id integer NOT NULL,
    equipment_name text NOT NULL,
    description text,
    id_signed_on_sticker integer
);


ALTER TABLE public.equipment OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16396)
-- Name: equipment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
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
-- TOC entry 221 (class 1259 OID 16397)
-- Name: parking_lots; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.parking_lots (
    id integer NOT NULL,
    parking_lot_type text,
    placement text
);


ALTER TABLE public.parking_lots OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16403)
-- Name: parking_lots_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
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
-- TOC entry 223 (class 1259 OID 16404)
-- Name: parking_payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.parking_payments (
    id integer NOT NULL,
    amount real,
    payment_due_date date,
    status text,
    id_parking_reservation integer NOT NULL
);


ALTER TABLE public.parking_payments OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16411)
-- Name: parking_payments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
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
-- TOC entry 225 (class 1259 OID 16412)
-- Name: parking_reservations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.parking_reservations (
    id integer NOT NULL,
    start_date_reserv date,
    end_date_reserv date,
    id_parking_lot integer NOT NULL,
    id_resident integer
);


ALTER TABLE public.parking_reservations OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 16417)
-- Name: parking_reservations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
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
-- TOC entry 227 (class 1259 OID 16428)
-- Name: residents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.residents (
    id integer NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    department text
);


ALTER TABLE public.residents OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 16436)
-- Name: residents_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
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
-- TOC entry 229 (class 1259 OID 16437)
-- Name: room_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.room_categories (
    id integer NOT NULL,
    monthly_rent real NOT NULL,
    if_kitchen boolean,
    category_name text
);


ALTER TABLE public.room_categories OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 16444)
-- Name: room_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
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
-- TOC entry 231 (class 1259 OID 16445)
-- Name: room_equipment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.room_equipment (
    id_room integer NOT NULL,
    id_equipment integer NOT NULL
);


ALTER TABLE public.room_equipment OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 16450)
-- Name: room_payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.room_payments (
    id integer NOT NULL,
    id_reservation integer NOT NULL,
    amount real,
    payment_due_date date
);


ALTER TABLE public.room_payments OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 16455)
-- Name: room_payments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
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
-- TOC entry 234 (class 1259 OID 16456)
-- Name: room_reservations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.room_reservations (
    id integer NOT NULL,
    start_date_reserv date NOT NULL,
    end_date_reserv date NOT NULL,
    id_room integer NOT NULL,
    id_resident integer
);


ALTER TABLE public.room_reservations OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 16463)
-- Name: room_reservations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
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
-- TOC entry 236 (class 1259 OID 16464)
-- Name: rooms; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rooms (
    id integer NOT NULL,
    room_number integer NOT NULL,
    floor_number integer NOT NULL,
    num_of_beds integer NOT NULL,
    id_category integer NOT NULL
);


ALTER TABLE public.rooms OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 16472)
-- Name: rooms_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
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
-- TOC entry 239 (class 1259 OID 16578)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email text NOT NULL,
    password_hash text NOT NULL,
    role text NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 16577)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 5065 (class 0 OID 0)
-- Dependencies: 238
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4858 (class 2604 OID 16581)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 5039 (class 0 OID 16389)
-- Dependencies: 219
-- Data for Name: equipment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.equipment (id, equipment_name, description, id_signed_on_sticker) FROM stdin;
\.


--
-- TOC entry 5041 (class 0 OID 16397)
-- Dependencies: 221
-- Data for Name: parking_lots; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.parking_lots (id, parking_lot_type, placement) FROM stdin;
\.


--
-- TOC entry 5043 (class 0 OID 16404)
-- Dependencies: 223
-- Data for Name: parking_payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.parking_payments (id, amount, payment_due_date, status, id_parking_reservation) FROM stdin;
\.


--
-- TOC entry 5045 (class 0 OID 16412)
-- Dependencies: 225
-- Data for Name: parking_reservations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.parking_reservations (id, start_date_reserv, end_date_reserv, id_parking_lot, id_resident) FROM stdin;
\.


--
-- TOC entry 5047 (class 0 OID 16428)
-- Dependencies: 227
-- Data for Name: residents; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.residents (id, first_name, last_name, department) FROM stdin;
\.


--
-- TOC entry 5049 (class 0 OID 16437)
-- Dependencies: 229
-- Data for Name: room_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.room_categories (id, monthly_rent, if_kitchen, category_name) FROM stdin;
\.


--
-- TOC entry 5051 (class 0 OID 16445)
-- Dependencies: 231
-- Data for Name: room_equipment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.room_equipment (id_room, id_equipment) FROM stdin;
\.


--
-- TOC entry 5052 (class 0 OID 16450)
-- Dependencies: 232
-- Data for Name: room_payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.room_payments (id, id_reservation, amount, payment_due_date) FROM stdin;
\.


--
-- TOC entry 5054 (class 0 OID 16456)
-- Dependencies: 234
-- Data for Name: room_reservations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.room_reservations (id, start_date_reserv, end_date_reserv, id_room, id_resident) FROM stdin;
\.


--
-- TOC entry 5056 (class 0 OID 16464)
-- Dependencies: 236
-- Data for Name: rooms; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rooms (id, room_number, floor_number, num_of_beds, id_category) FROM stdin;
\.


--
-- TOC entry 5059 (class 0 OID 16578)
-- Dependencies: 239
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password_hash, role) FROM stdin;
\.


--
-- TOC entry 5066 (class 0 OID 0)
-- Dependencies: 220
-- Name: equipment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.equipment_id_seq', 1, false);


--
-- TOC entry 5067 (class 0 OID 0)
-- Dependencies: 222
-- Name: parking_lots_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.parking_lots_id_seq', 1, false);


--
-- TOC entry 5068 (class 0 OID 0)
-- Dependencies: 224
-- Name: parking_payments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.parking_payments_id_seq', 1, false);


--
-- TOC entry 5069 (class 0 OID 0)
-- Dependencies: 226
-- Name: parking_reservations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.parking_reservations_id_seq', 1, false);


--
-- TOC entry 5070 (class 0 OID 0)
-- Dependencies: 228
-- Name: residents_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.residents_id_seq', 1, false);


--
-- TOC entry 5071 (class 0 OID 0)
-- Dependencies: 230
-- Name: room_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.room_categories_id_seq', 1, false);


--
-- TOC entry 5072 (class 0 OID 0)
-- Dependencies: 233
-- Name: room_payments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.room_payments_id_seq', 1, false);


--
-- TOC entry 5073 (class 0 OID 0)
-- Dependencies: 235
-- Name: room_reservations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.room_reservations_id_seq', 1, false);


--
-- TOC entry 5074 (class 0 OID 0)
-- Dependencies: 237
-- Name: rooms_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rooms_id_seq', 1, false);


--
-- TOC entry 5075 (class 0 OID 0)
-- Dependencies: 238
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 1, false);


--
-- TOC entry 4860 (class 2606 OID 16474)
-- Name: equipment equipment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipment
    ADD CONSTRAINT equipment_pkey PRIMARY KEY (id);


--
-- TOC entry 4862 (class 2606 OID 16476)
-- Name: parking_lots parking_lots_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parking_lots
    ADD CONSTRAINT parking_lots_pkey PRIMARY KEY (id);


--
-- TOC entry 4864 (class 2606 OID 16478)
-- Name: parking_payments parking_payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parking_payments
    ADD CONSTRAINT parking_payments_pkey PRIMARY KEY (id);


--
-- TOC entry 4866 (class 2606 OID 16480)
-- Name: parking_reservations parking_reservations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parking_reservations
    ADD CONSTRAINT parking_reservations_pkey PRIMARY KEY (id);


--
-- TOC entry 4868 (class 2606 OID 16486)
-- Name: residents residents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.residents
    ADD CONSTRAINT residents_pkey PRIMARY KEY (id);


--
-- TOC entry 4870 (class 2606 OID 16488)
-- Name: room_categories room_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.room_categories
    ADD CONSTRAINT room_categories_pkey PRIMARY KEY (id);


--
-- TOC entry 4872 (class 2606 OID 16490)
-- Name: room_equipment room_equipment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.room_equipment
    ADD CONSTRAINT room_equipment_pkey PRIMARY KEY (id_room, id_equipment);


--
-- TOC entry 4874 (class 2606 OID 16492)
-- Name: room_payments room_payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.room_payments
    ADD CONSTRAINT room_payments_pkey PRIMARY KEY (id);


--
-- TOC entry 4876 (class 2606 OID 16494)
-- Name: room_reservations room_reservations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.room_reservations
    ADD CONSTRAINT room_reservations_pkey PRIMARY KEY (id);


--
-- TOC entry 4878 (class 2606 OID 16496)
-- Name: rooms rooms_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rooms
    ADD CONSTRAINT rooms_pkey PRIMARY KEY (id);


--
-- TOC entry 4880 (class 2606 OID 16591)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4882 (class 2606 OID 16589)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4891 (class 2606 OID 16497)
-- Name: rooms fk_category; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rooms
    ADD CONSTRAINT fk_category FOREIGN KEY (id_category) REFERENCES public.room_categories(id);


--
-- TOC entry 4886 (class 2606 OID 16502)
-- Name: room_equipment fk_equipment; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.room_equipment
    ADD CONSTRAINT fk_equipment FOREIGN KEY (id_equipment) REFERENCES public.equipment(id);


--
-- TOC entry 4884 (class 2606 OID 16507)
-- Name: parking_reservations fk_parking_lot; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parking_reservations
    ADD CONSTRAINT fk_parking_lot FOREIGN KEY (id_parking_lot) REFERENCES public.parking_lots(id);


--
-- TOC entry 4883 (class 2606 OID 16512)
-- Name: parking_payments fk_parking_reservation; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parking_payments
    ADD CONSTRAINT fk_parking_reservation FOREIGN KEY (id_parking_reservation) REFERENCES public.parking_reservations(id);


--
-- TOC entry 4889 (class 2606 OID 16552)
-- Name: room_reservations fk_resident; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.room_reservations
    ADD CONSTRAINT fk_resident FOREIGN KEY (id_resident) REFERENCES public.residents(id) ON DELETE CASCADE;


--
-- TOC entry 4885 (class 2606 OID 16557)
-- Name: parking_reservations fk_resident_parking_reserv; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parking_reservations
    ADD CONSTRAINT fk_resident_parking_reserv FOREIGN KEY (id_resident) REFERENCES public.residents(id) ON DELETE CASCADE;


--
-- TOC entry 4887 (class 2606 OID 16532)
-- Name: room_equipment fk_room; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.room_equipment
    ADD CONSTRAINT fk_room FOREIGN KEY (id_room) REFERENCES public.rooms(id);


--
-- TOC entry 4888 (class 2606 OID 16542)
-- Name: room_payments fk_room_reservations; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.room_payments
    ADD CONSTRAINT fk_room_reservations FOREIGN KEY (id_reservation) REFERENCES public.room_reservations(id);


--
-- TOC entry 4890 (class 2606 OID 16547)
-- Name: room_reservations fk_rooms; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.room_reservations
    ADD CONSTRAINT fk_rooms FOREIGN KEY (id_room) REFERENCES public.rooms(id);


-- Completed on 2026-04-09 18:47:54

--
-- PostgreSQL database dump complete
--

\unrestrict GNNh8TW9i3rgki0Y97xpkYOhI1TQoTNCWfunr8IHAQnZhvRUeooAeJNrA2hCdic

