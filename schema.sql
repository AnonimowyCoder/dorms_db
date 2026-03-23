--
-- PostgreSQL database dump
--

\restrict 2X0bxRrXIVK9japZsCj1FXineWk9l1mxZe78R17FYVDcK26TXG0sP9diu3sIZO0

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

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
-- Name: parking_lots; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.parking_lots (
    id integer NOT NULL,
    parking_lot_type text,
    placement text
);


ALTER TABLE public.parking_lots OWNER TO postgres;

--
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
-- Name: parking_reservations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.parking_reservations (
    id integer NOT NULL,
    start_date_reserv date,
    end_date_reserv date,
    id_parking_lot integer NOT NULL
);


ALTER TABLE public.parking_reservations OWNER TO postgres;

--
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
-- Name: resident_parking_reservation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.resident_parking_reservation (
    id_resident integer NOT NULL,
    id_parking_reservation integer NOT NULL
);


ALTER TABLE public.resident_parking_reservation OWNER TO postgres;

--
-- Name: resident_room_reservation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.resident_room_reservation (
    id_resident integer NOT NULL,
    id_room_reservation integer NOT NULL
);


ALTER TABLE public.resident_room_reservation OWNER TO postgres;

--
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
-- Name: room_equipment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.room_equipment (
    id_room integer NOT NULL,
    id_equipment integer NOT NULL
);


ALTER TABLE public.room_equipment OWNER TO postgres;

--
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
-- Name: room_reservations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.room_reservations (
    id integer NOT NULL,
    start_date_reserv date NOT NULL,
    end_date_reserv date NOT NULL,
    id_room integer NOT NULL
);


ALTER TABLE public.room_reservations OWNER TO postgres;

--
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
-- Name: equipment equipment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipment
    ADD CONSTRAINT equipment_pkey PRIMARY KEY (id);


--
-- Name: parking_lots parking_lots_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parking_lots
    ADD CONSTRAINT parking_lots_pkey PRIMARY KEY (id);


--
-- Name: parking_payments parking_payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parking_payments
    ADD CONSTRAINT parking_payments_pkey PRIMARY KEY (id);


--
-- Name: parking_reservations parking_reservations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parking_reservations
    ADD CONSTRAINT parking_reservations_pkey PRIMARY KEY (id);


--
-- Name: resident_parking_reservation resident_parking_reservation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resident_parking_reservation
    ADD CONSTRAINT resident_parking_reservation_pkey PRIMARY KEY (id_resident, id_parking_reservation);


--
-- Name: resident_room_reservation resident_room_reservation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resident_room_reservation
    ADD CONSTRAINT resident_room_reservation_pkey PRIMARY KEY (id_resident, id_room_reservation);


--
-- Name: residents residents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.residents
    ADD CONSTRAINT residents_pkey PRIMARY KEY (id);


--
-- Name: room_categories room_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.room_categories
    ADD CONSTRAINT room_categories_pkey PRIMARY KEY (id);


--
-- Name: room_equipment room_equipment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.room_equipment
    ADD CONSTRAINT room_equipment_pkey PRIMARY KEY (id_room, id_equipment);


--
-- Name: room_payments room_payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.room_payments
    ADD CONSTRAINT room_payments_pkey PRIMARY KEY (id);


--
-- Name: room_reservations room_reservations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.room_reservations
    ADD CONSTRAINT room_reservations_pkey PRIMARY KEY (id);


--
-- Name: rooms rooms_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rooms
    ADD CONSTRAINT rooms_pkey PRIMARY KEY (id);


--
-- Name: rooms fk_category; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rooms
    ADD CONSTRAINT fk_category FOREIGN KEY (id_category) REFERENCES public.room_categories(id);


--
-- Name: room_equipment fk_equipment; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.room_equipment
    ADD CONSTRAINT fk_equipment FOREIGN KEY (id_equipment) REFERENCES public.equipment(id);


--
-- Name: parking_reservations fk_parking_lot; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parking_reservations
    ADD CONSTRAINT fk_parking_lot FOREIGN KEY (id_parking_lot) REFERENCES public.parking_lots(id);


--
-- Name: parking_payments fk_parking_reservation; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parking_payments
    ADD CONSTRAINT fk_parking_reservation FOREIGN KEY (id_parking_reservation) REFERENCES public.parking_reservations(id);


--
-- Name: resident_parking_reservation fk_parking_reservation; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resident_parking_reservation
    ADD CONSTRAINT fk_parking_reservation FOREIGN KEY (id_parking_reservation) REFERENCES public.parking_reservations(id);


--
-- Name: resident_parking_reservation fk_resident; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resident_parking_reservation
    ADD CONSTRAINT fk_resident FOREIGN KEY (id_resident) REFERENCES public.residents(id);


--
-- Name: resident_room_reservation fk_resident; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resident_room_reservation
    ADD CONSTRAINT fk_resident FOREIGN KEY (id_resident) REFERENCES public.residents(id);


--
-- Name: room_equipment fk_room; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.room_equipment
    ADD CONSTRAINT fk_room FOREIGN KEY (id_room) REFERENCES public.rooms(id);


--
-- Name: resident_room_reservation fk_room_reservation; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resident_room_reservation
    ADD CONSTRAINT fk_room_reservation FOREIGN KEY (id_room_reservation) REFERENCES public.room_reservations(id);


--
-- Name: room_payments fk_room_reservations; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.room_payments
    ADD CONSTRAINT fk_room_reservations FOREIGN KEY (id_reservation) REFERENCES public.room_reservations(id);


--
-- Name: room_reservations fk_rooms; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.room_reservations
    ADD CONSTRAINT fk_rooms FOREIGN KEY (id_room) REFERENCES public.rooms(id);


--
-- PostgreSQL database dump complete
--

\unrestrict 2X0bxRrXIVK9japZsCj1FXineWk9l1mxZe78R17FYVDcK26TXG0sP9diu3sIZO0

