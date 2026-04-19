-- ENUM 타입 6종 생성
CREATE TYPE public.event_type_enum AS ENUM ('one_time', 'recurring');
CREATE TYPE public.event_status_enum AS ENUM ('draft', 'open', 'closed', 'cancelled');
CREATE TYPE public.approval_type_enum AS ENUM ('auto', 'manual');
CREATE TYPE public.member_status_enum AS ENUM ('confirmed', 'waiting', 'rejected');
CREATE TYPE public.split_type_enum AS ENUM ('equal', 'individual', 'ratio');
