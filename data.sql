--
-- PostgreSQL database dump
--

\restrict hXPYqSwN82mvkMRRs1iZ6a63woetVjXQcuOGp1vnuQrqbu1qoV4IW8EHsQQHzgv

-- Dumped from database version 17.9
-- Dumped by pg_dump version 17.9

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
-- Data for Name: utilisateurs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.utilisateurs (id, nom, prenom, email, telephone, mot_de_passe, photo_profil, photo_couverture, type_compte, statut, est_verifie, langue, created_at, updated_at, photo_profil_url, cnib_recto_url, cnib_verso_url, mobile_money_numero, mobile_money_operateur, email_verifie, email_verification_token, email_verification_expires, reset_password_token, reset_password_expires, pays) FROM stdin;
c33c8c68-cc8f-49f6-b1f8-b6c0ce173f04	Kouraogo	Ibrahim	ibrahim@test.com	70000001	$2b$12$BIIul/mtOVKSI5B4MgIM/ejJN0Tq0TFgGrcvQSnMQKZAcMfXRhVee	\N	\N	particulier	actif	f	fr	2026-03-29 16:57:59.35364	2026-03-29 16:57:59.35364	\N	\N	\N	\N	\N	t	\N	\N	\N	\N	BF
79a8ea34-0c86-4c1c-9744-d305d54ae558	KOURAOGO	Ibrahim	ib.kouraogo02@gmail.com	67567184	$2b$12$jrBTk9uXJJq3s.jRXLePPuUjy4L1qOapHxQCd6qrRKJEXjHW3l3TO	\N	https://res.cloudinary.com/ddpgpvjyg/image/upload/v1776968835/maisonplus/couvertures/79a8ea34-0c86-4c1c-9744-d305d54ae558/tzpbwr6m9fhvrdve3bhv.jpg	admin	actif	f	fr	2026-04-01 23:21:37.435912	2026-04-23 23:18:29.284459	https://res.cloudinary.com/ddpgpvjyg/image/upload/v1776967309/maisonplus/profils/79a8ea34-0c86-4c1c-9744-d305d54ae558/lttahd4y1xs44tkulg9o.jpg	https://res.cloudinary.com/ddpgpvjyg/image/upload/v1776726723/maisonplus/kyc/79a8ea34-0c86-4c1c-9744-d305d54ae558/mhtmehtp5x7npyp5zctc.jpg	https://res.cloudinary.com/ddpgpvjyg/image/upload/v1776726726/maisonplus/kyc/79a8ea34-0c86-4c1c-9744-d305d54ae558/ykpsqt2mb316wjzxcliv.jpg	57026641	Orange Money	t	\N	\N	\N	\N	BF
ea7eaa40-c0d7-4bb0-8b72-ab350e065fa1	KABORE	Asseta	Brascolacrime@gmail.com	57026641	$2b$12$xE1PpoNBqC6Haifp8hS3FeCXai91HT/v8ThJ9EDPa5OX5ywfEI9pG	\N	\N	particulier	actif	f	fr	2026-04-03 09:44:33.960531	2026-04-03 09:44:33.960531	\N	\N	\N	\N	\N	t	b4d6ef0b8848df5183ab52fda824187418b84dff29d31021bb5d048bd2100037	2026-04-04 09:44:33.955	\N	\N	BF
5dcd5914-8deb-4637-ad15-34725e0f3163	SAWADOGO	Moussa	moussa06@gmail.com	70734991	$2b$12$SCjezEs8L2wNqfLYvba8IONxZkozj7lQX/llvVTCTa57A4HYFjrku	\N	\N	particulier	actif	f	fr	2026-04-03 10:16:44.898938	2026-04-03 10:16:44.898938	\N	\N	\N	\N	\N	t	c815fc6bd0fdd8f3bfcf5266726f3a052d566295d47dc3081e37328714a00edc	2026-04-04 10:16:44.897	\N	\N	BF
c7be5af7-8945-4611-b761-3eeaf7126634	Brasco	Chekété	Bracolacrime@gmail.com	73499110	$2b$12$qUbLmdqyVO86v6ZSZ2GGveN7KLoyxXXW.KGFqGwBHksUwuegJ7Yu.	\N	https://res.cloudinary.com/ddpgpvjyg/image/upload/v1776981057/maisonplus/couvertures/c7be5af7-8945-4611-b761-3eeaf7126634/sbbq5ud4o3q8xwitxuzw.jpg	particulier	en_attente	f	fr	2026-04-23 18:47:09.786692	2026-04-23 21:50:41.801343	https://res.cloudinary.com/ddpgpvjyg/image/upload/v1776970168/maisonplus/profils/c7be5af7-8945-4611-b761-3eeaf7126634/mwji3aw5woscefq72pdz.jpg	https://res.cloudinary.com/ddpgpvjyg/image/upload/v1776970095/maisonplus/kyc/c7be5af7-8945-4611-b761-3eeaf7126634/iybgqt8jmmmouan1pnfo.jpg	https://res.cloudinary.com/ddpgpvjyg/image/upload/v1776970097/maisonplus/kyc/c7be5af7-8945-4611-b761-3eeaf7126634/hjggkhcsc1nz4ijm9ofc.jpg	67567184	Coris Money	f	f77b6c7fab1dc3f2e5b8901bc1bc3c8d9e50e2a864ee86a351fe99adf1f1726f	2026-04-24 18:47:09.785	\N	\N	BF
\.


--
-- Data for Name: annonces; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.annonces (id, utilisateur_id, titre, description, categorie, type_transaction, prix, devise, superficie, nb_pieces, ville, quartier, adresse_complete, latitude, longitude, disponible_du, disponible_au, statut, est_sponsorisee, nb_vues, nb_interets, created_at, updated_at, periode, sponsorisee_jusqu_au, nb_vues_sponsorisee) FROM stdin;
4c01fefd-793f-496c-b16d-aaad878e0fcb	c33c8c68-cc8f-49f6-b1f8-b6c0ce173f04	Maison 3 chambres — Gounghin	Maison bien entretenue, 3 chambres, salon, douche interne, cour spacieuse. Disponible immédiatement.	maison	location	120000.00	XOF	150.00	3	Ouagadougou	Gounghin	Secteur 7, Gounghin	12.34500000	-1.55000000	\N	\N	publiee	f	6	0	2026-04-02 10:42:22.89333	2026-04-02 10:42:22.89333	mois	\N	0
df5d2f79-bd04-45c9-9a86-cdbfc13ead0b	c33c8c68-cc8f-49f6-b1f8-b6c0ce173f04	Appartement F3 meublé — Cissin	Bel appartement entièrement meublé, 3 pièces, cuisine équipée, parking. Proche des commodités.	maison	location	200000.00	XOF	80.00	3	Ouagadougou	Cissin	Secteur 22, Cissin	\N	\N	\N	\N	publiee	f	0	0	2026-04-01 23:33:10.409762	2026-04-01 23:33:10.409762	mois	\N	0
21df9c52-64f6-4867-bd32-1f569055ad08	c33c8c68-cc8f-49f6-b1f8-b6c0ce173f04	Maison 3 chambres — Gounghin	Maison bien entretenue, 3 chambres, salon, douche interne, cour spacieuse. Disponible immédiatement.	maison	location	120000.00	XOF	150.00	3	Ouagadougou	Gounghin	Secteur 7, Gounghin	12.34500000	-1.55000000	\N	\N	publiee	f	2	0	2026-04-01 23:33:10.421621	2026-04-01 23:33:10.421621	mois	\N	0
85608b1b-2052-4574-b510-5a566ece28f1	c33c8c68-cc8f-49f6-b1f8-b6c0ce173f04	Parcelle 400m² viabilisée — Pissy	Belle parcelle clôturée avec titre foncier, eau et électricité disponibles. Quartier résidentiel calme.	parcelle	vente	15000000.00	XOF	400.00	0	Ouagadougou	Pissy	Secteur 28, Pissy	12.38000000	-1.54000000	\N	\N	publiee	f	0	0	2026-04-02 10:42:22.889478	2026-04-02 10:42:22.889478	mois	\N	0
a2fcb134-9f39-42f5-97cb-03afc7517e40	c33c8c68-cc8f-49f6-b1f8-b6c0ce173f04	Parcelle 400m² viabilisée — Pissy	Belle parcelle clôturée avec titre foncier, eau et électricité disponibles. Quartier résidentiel calme.	parcelle	vente	15000000.00	XOF	400.00	0	Ouagadougou	Pissy	Secteur 28, Pissy	12.38000000	-1.54000000	\N	\N	publiee	f	4	0	2026-04-01 23:33:10.416193	2026-04-01 23:33:10.416193	mois	\N	0
3f5eb568-5bca-4906-81a3-1829d585f26b	c33c8c68-cc8f-49f6-b1f8-b6c0ce173f04	Studio meublé — Zone du Bois	Studio moderne entièrement équipé, idéal étudiant ou célibataire. WiFi inclus, sécurisé 24h/24.	maison	location	75000.00	XOF	35.00	1	Ouagadougou	Zone du Bois	Avenue Kwame Nkrumah	12.37000000	-1.52000000	\N	\N	publiee	f	2	0	2026-04-01 23:33:31.39413	2026-04-01 23:33:31.39413	mois	\N	0
74bd057a-1fdd-4031-a41e-a64627e09e8c	c33c8c68-cc8f-49f6-b1f8-b6c0ce173f04	Villa de standing — Wemtenga	Villa luxueuse avec 5 chambres, 3 salles de bain, piscine, garage 2 voitures. Quartier sécurisé.	maison	vente	95000000.00	XOF	500.00	5	Ouagadougou	Wemtenga	Secteur 12, Wemtenga	12.35690000	-1.53530000	\N	\N	publiee	f	0	0	2026-04-01 23:33:10.426213	2026-04-01 23:33:10.426213	mois	\N	0
a4d9a9cb-dfb4-4cb8-9177-5de048af0cbc	c33c8c68-cc8f-49f6-b1f8-b6c0ce173f04	Villa moderne 4 chambres — Ouaga 2000	Magnifique villa avec piscine, jardin, 4 chambres climatisées, eau et électricité permanentes. Idéale pour famille.	maison	location	350000.00	XOF	320.00	4	Ouagadougou	Ouaga 2000	Secteur 15, Ouaga 2000	12.35690000	-1.53530000	\N	\N	publiee	f	0	0	2026-04-02 10:42:22.787452	2026-04-02 10:42:22.787452	mois	\N	0
b09e71e1-6166-4df1-837f-970e86f52c60	79a8ea34-0c86-4c1c-9744-d305d54ae558	un duplexe spacieux 	joli duplexe	maison	location	450000.00	XOF	450.00	3	BOBO	sikasso	5	12.36000000	-1.51000000	2026-04-22	\N	publiee	f	61	0	2026-04-22 19:18:41.753412	2026-04-24 11:04:23.252024	mois	\N	0
57e2f93d-7336-489f-b0db-b47af2fd3152	c33c8c68-cc8f-49f6-b1f8-b6c0ce173f04	Appartement F3 meublé — Cissin	Bel appartement entièrement meublé, 3 pièces, cuisine équipée, parking. Proche des commodités.	maison	location	200000.00	XOF	80.00	3	Ouagadougou	Cissin	Secteur 22, Cissin	\N	\N	\N	\N	publiee	f	2	0	2026-04-02 10:42:22.883085	2026-04-02 10:42:22.883085	mois	\N	0
e51f3d6d-b4cd-4806-85e2-db8d3c2472b8	c33c8c68-cc8f-49f6-b1f8-b6c0ce173f04	Villa de standing — Wemtenga	Villa luxueuse avec 5 chambres, 3 salles de bain, piscine, garage 2 voitures. Quartier sécurisé.	maison	vente	95000000.00	XOF	500.00	5	Ouagadougou	Wemtenga	Secteur 12, Wemtenga	12.35690000	-1.53530000	\N	\N	publiee	f	0	0	2026-04-02 10:42:22.903526	2026-04-02 10:42:22.903526	mois	\N	0
48c4de0e-ffdc-4a94-a103-3f13d41c549e	c33c8c68-cc8f-49f6-b1f8-b6c0ce173f04	Belle villa à Ouagadougou	Magnifique villa avec jardin, 4 chambres, eau et électricité	maison	location	150000.00	XOF	200.00	4	Ouagadougou	Ouaga 2000	Secteur 15, Ouaga 2000	12.35690000	-1.53530000	2026-04-01	2026-12-31	publiee	f	2	0	2026-03-29 17:58:01.895619	2026-03-29 17:58:01.895619	mois	\N	0
668054af-612d-40ea-b799-81344f29d4f6	c33c8c68-cc8f-49f6-b1f8-b6c0ce173f04	Villa moderne 4 chambres — Ouaga 2000	Magnifique villa avec piscine, jardin, 4 chambres climatisées, eau et électricité permanentes. Idéale pour famille.	maison	location	350000.00	XOF	320.00	4	Ouagadougou	Ouaga 2000	Secteur 15, Ouaga 2000	12.35690000	-1.53530000	\N	\N	publiee	f	2	0	2026-04-01 23:33:10.382799	2026-04-01 23:33:10.382799	mois	\N	0
4f2fd1ed-c82e-4778-bdeb-6d29d4b3637d	c33c8c68-cc8f-49f6-b1f8-b6c0ce173f04	Studio meublé — Zone du Bois	Studio moderne entièrement équipé, idéal étudiant ou célibataire. WiFi inclus, sécurisé 24h/24.	maison	location	75000.00	XOF	35.00	1	Ouagadougou	Zone du Bois	Avenue Kwame Nkrumah	12.37000000	-1.52000000	\N	\N	publiee	f	23	0	2026-04-02 10:42:44.776073	2026-04-02 10:42:44.776073	mois	\N	0
\.


--
-- Data for Name: avis; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.avis (id, annonce_id, auteur_id, destinataire_id, note, commentaire, type, created_at) FROM stdin;
4a1d0bb7-a1e8-43a1-ba40-5a2600aa0d3f	b09e71e1-6166-4df1-837f-970e86f52c60	c7be5af7-8945-4611-b761-3eeaf7126634	79a8ea34-0c86-4c1c-9744-d305d54ae558	2	Professionnel	vendeur	2026-04-24 11:22:55.357839
\.


--
-- Data for Name: disponibilites; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.disponibilites (id, annonce_id, date_debut, date_fin, statut, motif, created_at) FROM stdin;
\.


--
-- Data for Name: documents_annonce; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.documents_annonce (id, annonce_id, nom, type_document, url, taille, created_at) FROM stdin;
\.


--
-- Data for Name: paiements; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.paiements (id, annonce_id, acheteur_id, vendeur_id, montant, devise, methode_paiement, statut, reference_transaction, commission_plateforme, taux_commission, recu_url, created_at, updated_at, zone) FROM stdin;
\.


--
-- Data for Name: litiges; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.litiges (id, paiement_id, plaignant_id, accuse_id, motif, description, statut, decision, admin_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: medias; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.medias (id, annonce_id, type_media, url, public_id, est_principale, ordre, created_at) FROM stdin;
98583583-b36e-4785-97ff-02dd00ac45a0	668054af-612d-40ea-b799-81344f29d4f6	photo	https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800	demo1	t	0	2026-04-01 23:38:26.044044
ffcbb3e6-eaff-45f5-b60b-f4b18b6e1587	df5d2f79-bd04-45c9-9a86-cdbfc13ead0b	photo	https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800	demo2	t	0	2026-04-01 23:38:26.062589
f49e8a01-14ea-48c8-8026-36c6df3e8ef6	a2fcb134-9f39-42f5-97cb-03afc7517e40	photo	https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800	demo3	t	0	2026-04-01 23:38:26.06854
10ae85bc-1501-4576-bfef-047c3bf6951c	21df9c52-64f6-4867-bd32-1f569055ad08	photo	https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800	demo4	t	0	2026-04-01 23:38:26.074456
d1e2ac67-f0e2-4707-a7ae-0ae77ac7e9c7	74bd057a-1fdd-4031-a41e-a64627e09e8c	photo	https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800	demo5	t	0	2026-04-01 23:38:26.078119
0deb848a-69e7-4f94-b0e6-d35475e97df9	3f5eb568-5bca-4906-81a3-1829d585f26b	photo	https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800	demo6	t	0	2026-04-01 23:38:40.691621
d6c51a72-e7ef-426b-a178-4df54412a97e	668054af-612d-40ea-b799-81344f29d4f6	photo	https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800	demo1	t	0	2026-04-02 10:43:13.462567
fd194507-ccb3-4988-a168-5ea1973a1e2c	a4d9a9cb-dfb4-4cb8-9177-5de048af0cbc	photo	https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800	demo1	t	0	2026-04-02 10:43:13.462567
70bb7526-68e7-4882-b54d-d6567a7481f2	df5d2f79-bd04-45c9-9a86-cdbfc13ead0b	photo	https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800	demo2	t	0	2026-04-02 10:43:13.503163
cef20426-8d32-4b38-b77f-f5e45869f732	57e2f93d-7336-489f-b0db-b47af2fd3152	photo	https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800	demo2	t	0	2026-04-02 10:43:13.503163
ab12f45b-0cb5-4c9d-9339-f6594255404b	a2fcb134-9f39-42f5-97cb-03afc7517e40	photo	https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800	demo3	t	0	2026-04-02 10:43:13.510852
9533c70e-c326-489e-8b2e-4e27563a7b82	85608b1b-2052-4574-b510-5a566ece28f1	photo	https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800	demo3	t	0	2026-04-02 10:43:13.510852
c67208f9-b000-4bce-9c74-3ccd321923bd	21df9c52-64f6-4867-bd32-1f569055ad08	photo	https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800	demo4	t	0	2026-04-02 10:43:13.516426
68b4056d-bc04-49c2-9097-163341612ba4	4c01fefd-793f-496c-b16d-aaad878e0fcb	photo	https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800	demo4	t	0	2026-04-02 10:43:13.516426
53b9b3ea-434c-43b8-a543-bb75abbc4ce2	74bd057a-1fdd-4031-a41e-a64627e09e8c	photo	https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800	demo5	t	0	2026-04-02 10:43:13.5197
f90d879f-6a13-4806-bef6-6378cef46a2d	e51f3d6d-b4cd-4806-85e2-db8d3c2472b8	photo	https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800	demo5	t	0	2026-04-02 10:43:13.5197
78e68bdb-7505-4c4a-97c1-d10e534184c0	3f5eb568-5bca-4906-81a3-1829d585f26b	photo	https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800	demo6	t	0	2026-04-02 10:43:28.019677
0bdca7dd-c9a6-47aa-b3eb-a4b092517173	4f2fd1ed-c82e-4778-bdeb-6d29d4b3637d	photo	https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800	demo6	t	0	2026-04-02 10:43:28.019677
ca052c29-e2a0-4393-8d7e-5687792aa187	b09e71e1-6166-4df1-837f-970e86f52c60	photo	https://res.cloudinary.com/ddpgpvjyg/image/upload/v1776885626/maisonplus/annonces/b09e71e1-6166-4df1-837f-970e86f52c60/syzlqlulo7cuh71lg93u.jpg	maisonplus/annonces/b09e71e1-6166-4df1-837f-970e86f52c60/syzlqlulo7cuh71lg93u	t	0	2026-04-22 19:20:11.216592
f96a357a-1c53-4a69-8eb8-61651e7a0984	b09e71e1-6166-4df1-837f-970e86f52c60	photo	https://res.cloudinary.com/ddpgpvjyg/image/upload/v1776885628/maisonplus/annonces/b09e71e1-6166-4df1-837f-970e86f52c60/ug3tg8wjxzyxj0t74ljk.jpg	maisonplus/annonces/b09e71e1-6166-4df1-837f-970e86f52c60/ug3tg8wjxzyxj0t74ljk	f	1	2026-04-22 19:20:13.146658
61ad3091-e122-4116-af62-16d0d73e56d0	b09e71e1-6166-4df1-837f-970e86f52c60	photo	https://res.cloudinary.com/ddpgpvjyg/image/upload/v1776885760/maisonplus/annonces/b09e71e1-6166-4df1-837f-970e86f52c60/u2ffujnncro3ra19gnof.jpg	maisonplus/annonces/b09e71e1-6166-4df1-837f-970e86f52c60/u2ffujnncro3ra19gnof	f	0	2026-04-22 19:22:25.753755
d303730f-e43f-45fc-a8c1-a99f156b60f7	b09e71e1-6166-4df1-837f-970e86f52c60	photo	https://res.cloudinary.com/ddpgpvjyg/image/upload/v1776885762/maisonplus/annonces/b09e71e1-6166-4df1-837f-970e86f52c60/nzkdnc01vqoha3puj6xx.jpg	maisonplus/annonces/b09e71e1-6166-4df1-837f-970e86f52c60/nzkdnc01vqoha3puj6xx	f	1	2026-04-22 19:22:27.756895
4e523211-045f-4e2d-9cad-0c4cc19ac983	b09e71e1-6166-4df1-837f-970e86f52c60	photo	https://res.cloudinary.com/ddpgpvjyg/image/upload/v1776885764/maisonplus/annonces/b09e71e1-6166-4df1-837f-970e86f52c60/h7hq9ycurtg05xortft2.jpg	maisonplus/annonces/b09e71e1-6166-4df1-837f-970e86f52c60/h7hq9ycurtg05xortft2	f	2	2026-04-22 19:22:28.961714
9fdec901-bc5d-4d0b-9e62-02f3f23112de	b09e71e1-6166-4df1-837f-970e86f52c60	video	https://res.cloudinary.com/ddpgpvjyg/video/upload/v1776885767/maisonplus/annonces/b09e71e1-6166-4df1-837f-970e86f52c60/videos/gq8bn2cxz2m2api5vfz4.mp4	maisonplus/annonces/b09e71e1-6166-4df1-837f-970e86f52c60/videos/gq8bn2cxz2m2api5vfz4	f	0	2026-04-22 19:22:32.539906
\.


--
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.messages (id, annonce_id, expediteur_id, destinataire_id, contenu, est_suspect, est_lu, created_at) FROM stdin;
780b6009-07a2-44dd-90b2-41aa8a18d066	4f2fd1ed-c82e-4778-bdeb-6d29d4b3637d	c7be5af7-8945-4611-b761-3eeaf7126634	c33c8c68-cc8f-49f6-b1f8-b6c0ce173f04	Bonsoir	f	f	2026-04-23 18:49:49.97849
c725efcc-3eb0-44cb-b195-2d3f8278b2fb	b09e71e1-6166-4df1-837f-970e86f52c60	c7be5af7-8945-4611-b761-3eeaf7126634	79a8ea34-0c86-4c1c-9744-d305d54ae558	Bonsoir	f	t	2026-04-23 18:52:08.777477
f2193fea-834a-4ec4-855f-420d224b9450	b09e71e1-6166-4df1-837f-970e86f52c60	79a8ea34-0c86-4c1c-9744-d305d54ae558	c7be5af7-8945-4611-b761-3eeaf7126634	Comment allez vous?	f	t	2026-04-23 19:04:50.087643
a5aff36e-eb87-4d02-a33c-cb944b39cc29	b09e71e1-6166-4df1-837f-970e86f52c60	c7be5af7-8945-4611-b761-3eeaf7126634	79a8ea34-0c86-4c1c-9744-d305d54ae558	je vais bien	f	t	2026-04-23 19:32:01.083338
c66e85ad-75cc-4704-9db0-c0ed3c9916af	b09e71e1-6166-4df1-837f-970e86f52c60	79a8ea34-0c86-4c1c-9744-d305d54ae558	c7be5af7-8945-4611-b761-3eeaf7126634	Que puis-je pour vous?	f	t	2026-04-23 21:00:16.067698
a90912a9-d7f2-42c1-9971-2f99608aeb61	b09e71e1-6166-4df1-837f-970e86f52c60	c7be5af7-8945-4611-b761-3eeaf7126634	79a8ea34-0c86-4c1c-9744-d305d54ae558	je suis intéressé	f	t	2026-04-23 21:27:59.136712
f11e0b64-b04e-43aa-a15e-35e4e79f2c70	b09e71e1-6166-4df1-837f-970e86f52c60	c7be5af7-8945-4611-b761-3eeaf7126634	79a8ea34-0c86-4c1c-9744-d305d54ae558	75444670	t	t	2026-04-24 11:40:05.800998
e894aca0-89d5-461e-aae6-f0893538a79f	b09e71e1-6166-4df1-837f-970e86f52c60	c7be5af7-8945-4611-b761-3eeaf7126634	79a8ea34-0c86-4c1c-9744-d305d54ae558	75444670	t	t	2026-04-24 11:40:16.345952
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, utilisateur_id, type, titre, message, lien, est_lu, created_at) FROM stdin;
61071a71-adc6-40ac-b320-acd1a51b23d0	79a8ea34-0c86-4c1c-9744-d305d54ae558	message	Nouveau message	Chekété vous a envoyé un message	/messages?annonce=b09e71e1-6166-4df1-837f-970e86f52c60&destinataire=c7be5af7-8945-4611-b761-3eeaf7126634	t	2026-04-23 21:27:59.148672
\.


--
-- Data for Name: sponsorisations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sponsorisations (id, annonce_id, utilisateur_id, duree_jours, montant, devise, statut, date_debut, date_fin, reference_paiement, created_at) FROM stdin;
\.


--
-- PostgreSQL database dump complete
--

\unrestrict hXPYqSwN82mvkMRRs1iZ6a63woetVjXQcuOGp1vnuQrqbu1qoV4IW8EHsQQHzgv

