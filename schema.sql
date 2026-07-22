-- Enable UUID extension if not active
create extension if not exists "uuid-ossp";

-- 1. PRODUCTS table
create table public.products (
    id uuid primary key default gen_random_uuid(),
    product_name text not null,
    option_name text, -- e.g., '[스무스]' or null
    shape_type text not null check (shape_type in ('삼각스콘', '미니큐브', '스틱스콘', '기타')),
    oven_number integer, -- e.g., 1, 2, 4, 7, 8, 11
    pcs_per_pan integer not null default 8, -- Yield per pan
    is_service boolean not null default false,
    cream_per_pan integer not null default 0, -- ml of cream per pan
    aliases text, -- EasyAdmin style Excel matching keywords (comma separated)
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
    unique(product_name, option_name)
);

-- Enable RLS
alter table public.products enable row level security;

-- Simple public read access policy
create policy "Allow public read access" on public.products
    for select using (true);

-- Allow authenticated edits
create policy "Allow auth admin modifications" on public.products
    for all using (auth.role() = 'authenticated');

-- 2. PRODUCTION ORDERS table
create table public.production_orders (
    id uuid primary key default gen_random_uuid(),
    order_date date not null default current_date,
    product_id uuid not null references public.products(id) on delete cascade,
    order_qty integer not null default 0 check (order_qty >= 0),
    extra_pan_qty numeric(4,1) not null default 0.0, -- Manual adjust (+1, -0.5 pans)
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.production_orders enable row level security;

create policy "Allow public read access for orders" on public.production_orders
    for select using (true);

create policy "Allow public write access for orders" on public.production_orders
    for all using (true); -- Public upload capability

-- Initial Data Seed (EasyAdmin Aliases Mapped)
insert into public.products (product_name, option_name, shape_type, oven_number, pcs_per_pan, cream_per_pan, is_service, aliases) values
('말차초코칩스콘', null, '삼각스콘', 1, 8, 170, false, '말차초코칩스콘, -말차초코칩스콘, ---말차초코칩스콘'),
('츄러스콘', null, '삼각스콘', 2, 8, 174, false, '츄러스콘, -츄러스콘, -통밀츄러스콘, ---츄러스콘, ---통밀츄러스콘'),
('츄러스콘', '[미니큐브]', '미니큐브', 4, 2, 0, false, '-----[하프팩]통밀츄러미니큐브, 츄러스콘[미니큐브]'),
('츄러스콘', '[스틱스콘]', '스틱스콘', 4, 9, 0, false, '----[세트]통밀츄러스틱 3팩, 츄러스콘[스틱스콘]'),
('데이츠치아씨드스콘', null, '삼각스콘', 11, 8, 160, false, '데이츠치아씨드스콘, -데이츠치아씨드스콘, ---데이츠치아씨드스콘'),
('데이츠치아씨드스콘', '[미니큐브]', '미니큐브', 4, 2, 0, false, '-----[하프팩]데치미니큐브, 데이츠치아씨드스콘[미니큐브]'),
('데이츠치아씨드스콘', '[스틱스콘]', '스틱스콘', 4, 9, 0, false, '----[세트]데치스틱 3팩, 데이츠치아씨드스콘[스틱스콘]'),
('바닐라피칸스콘', null, '삼각스콘', 4, 8, 170, false, '바닐라피칸스콘, -바닐라피칸스콘, ---바닐라피칸스콘'),
('바닐라피칸스콘', '[미니큐브]', '미니큐브', 4, 2, 0, false, '-----[하프팩]바닐라피칸미니큐브, 바닐라피칸스콘[미니큐브]'),
('바닐라피칸스콘', '[스틱스콘]', '스틱스콘', 4, 9, 0, false, '----[세트]바닐라피칸스틱 3팩, 바닐라피칸스콘[스틱스콘]'),
('버터밀크비스킷스콘', null, '삼각스콘', 7, 8, 130, false, '버터밀크비스킷스콘, -버터밀크비스킷스콘, ---버터밀크비스킷스콘'),
('버터밀크비스킷스콘', '[미니큐브]', '미니큐브', 8, 2, 0, false, '-----[하프팩]버터밀크비스킷미니큐브, 버터밀크비스킷스콘[미니큐브]'),
('버터밀크비스킷스콘', '[스틱스콘]', '스틱스콘', 8, 9, 0, false, '----[세트]버터밀크비스킷스틱 3팩, 버터밀크비스킷스콘[스틱스콘]'),
('데솔오트밀바', null, '삼각스콘', 1, 10, 160, false, '데솔오트밀바, -데솔오트밀바, ---데솔오트밀바'),
('데솔오트밀바', '[미니큐브]', '미니큐브', 4, 2, 0, false, '-----[하프팩]데솔오바미니큐브, 데솔오트밀바[미니큐브]'),
('카카오스콘', null, '삼각스콘', 1, 8, 180, false, '카카오스콘, -카카오스콘, ---카카오스콘'),
('카카오스콘', '[미니큐브]', '미니큐브', 2, 2, 0, false, '-----[하프팩]카카오미니큐브, 카카오스콘[미니큐브]'),
('카카오스콘', '[스틱스콘]', '스틱스콘', 2, 9, 0, false, '----[세트]카카오스틱 3팩, 카카오스콘[스틱스콘]'),
('OXO스콘', null, '삼각스콘', 5, 8, 150, false, 'OXO스콘, -OXO스콘, ---OXO스콘'),
('OXO스콘', '[미니큐브]', '미니큐브', 8, 2, 0, false, '-----[하프팩]OXO미니큐브, OXO스콘[미니큐브]'),
('OXO스콘', '[스틱스콘]', '스틱스콘', 8, 9, 0, false, '----[세트]OXO스틱 3팩, OXO스콘[스틱스콘]'),
('순수오트스콘', null, '삼각스콘', 5, 8, 140, false, '순수오트스콘, -순수오트스콘, ---순수오트스콘'),
('순수오트스콘', '[미니큐브]', '미니큐브', 8, 2, 0, false, '-----[하프팩]순수오트미니큐브, 순수오트스콘[미니큐브]'),
('귀리초코칩스콘', null, '삼각스콘', 1, 8, 180, false, '귀리초코칩스콘, -귀리초코칩스콘, ---귀리초코칩스콘'),
('귀리초코칩스콘', '[미니큐브]', '미니큐브', 4, 2, 0, false, '-----[하프팩]귀초칩미니큐브, 귀리초코칩스콘[미니큐브]'),
('딥카카오트스콘', null, '삼각스콘', 7, 8, 130, false, '딥카카오트스콘, -딥카카오트스콘, ---딥카카오트스콘'),
('딥카카오트스콘', '[미니큐브]', '미니큐브', 7, 2, 0, false, '-----[하프팩]딥카카오트미니큐브, 딥카카오트스콘[미니큐브]'),
('더티너티밤스콘', null, '삼각스콘', 7, 8, 110, false, '더티너티밤스콘, -더티너티밤스콘, ---더티너티밤스콘'),
('더티너티밤스콘', '[미니큐브]', '미니큐브', 8, 2, 0, false, '-----[하프팩]더티너티밤미니큐브, 더티너티밤스콘[미니큐브]'),
('더티너티밤스콘', '[스틱스콘]', '스틱스콘', 8, 9, 0, false, '----[세트]더티너티밤스틱 3팩, 더티너티밤스콘[스틱스콘]'),
('말차오트초코칩스콘', null, '삼각스콘', 7, 8, 125, false, '말차오트초코칩스콘, -말차오트초코칩스콘, ---말차오트초코칩스콘'),
('말차오트초코칩스콘', '[미니큐브]', '미니큐브', 8, 2, 0, false, '-----[하프팩]말차오트초코칩미니큐브, 말차오트초코칩스콘[미니큐브]'),
('배리초코칩스콘', null, '삼각스콘', 7, 8, 140, false, '배리초코칩스콘, -배리초코칩스콘, ---배리초코칩스콘'),
('배리초코칩스콘', '[미니큐브]', '미니큐브', 8, 2, 0, false, '-----[하프팩]배리초코칩미니큐브, 배리초코칩스콘[미니큐브]'),
('[미니쉐이크]쑥인절미', null, '미니큐브', 2, 4, 190, false, '-----[미니쉐이크]쑥인절미, [미니쉐이크]쑥인절미'),
('[미니쉐이크]카카오파베', null, '미니큐브', 2, 4, 180, false, '-----[미니쉐이크]카카오파베, [미니쉐이크]카카오파베'),
('서비스스콘', null, '기타', null, 1, 0, true, '서비스스콘');
