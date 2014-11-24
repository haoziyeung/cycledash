--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

SET search_path = public, pg_catalog;

--
-- Data for Name: data_annotations; Type: TABLE DATA; Schema: public; Owner: danvk
--

COPY data_annotations (dataset_name, annotation, type, contig, "position:start", "position:end") FROM stdin;
\.


--
-- Data for Name: vcfs; Type: TABLE DATA; Schema: public; Owner: danvk
--

COPY vcfs (id, created_at, caller_name, dataset_name, tumor_bam_uri, normal_bam_uri, validation_vcf, notes, uri, vcf_header, extant_columns, "precision", recall, f1score) FROM stdin;
1	2014-11-24 14:40:31.091183	test	test	\N	\N	f	\N	/tests/js/data/snv.vcf	##fileformat=VCFv4.1\n##source=VarScan2\n##INFO=<ID=DP,Number=1,Type=Integer,Description="Total depth of quality bases">\n##INFO=<ID=SOMATIC,Number=0,Type=Flag,Description="Indicates if record is a somatic mutation">\n##INFO=<ID=SS,Number=1,Type=String,Description="Somatic status of variant (0=Reference,1=Germline,2=Somatic,3=LOH, or 5=Unknown)">\n##INFO=<ID=SSC,Number=1,Type=String,Description="Somatic score in Phred scale (0-255) derived from somatic p-value">\n##INFO=<ID=GPV,Number=1,Type=Float,Description="Fisher's Exact Test P-value of tumor+normal versus no variant for Germline calls">\n##INFO=<ID=SPV,Number=1,Type=Float,Description="Fisher's Exact Test P-value of tumor versus normal for Somatic/LOH calls">\n##FILTER=<ID=str10,Description="Less than 10% or more than 90% of variant supporting reads on one strand">\n##FILTER=<ID=indelError,Description="Likely artifact due to indel reads at this position">\n##FORMAT=<ID=GT,Number=1,Type=String,Description="Genotype">\n##FORMAT=<ID=GQ,Number=1,Type=Integer,Description="Genotype Quality">\n##FORMAT=<ID=DP,Number=1,Type=Integer,Description="Read Depth">\n##FORMAT=<ID=RD,Number=1,Type=Integer,Description="Depth of reference-supporting bases (reads1)">\n##FORMAT=<ID=AD,Number=1,Type=Integer,Description="Depth of variant-supporting bases (reads2)">\n##FORMAT=<ID=FREQ,Number=1,Type=String,Description="Variant allele frequency">\n##FORMAT=<ID=DP4,Number=1,Type=String,Description="Strand read counts: ref/fwd, ref/rev, var/fwd, var/rev">\n#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO\tFORMAT\tNORMAL\tTUMOR	["sample:GT", "sample:RD", "sample:FREQ", "info:SSC", "sample:DP", "sample:DP4", "info:DP", "info:SS", "info:GPV", "sample:AD", "info:SPV"]	\N	\N	\N
\.


--
-- Data for Name: genotypes; Type: TABLE DATA; Schema: public; Owner: danvk
--

COPY genotypes (vcf_id, sample_name, contig, "position", id, reference, alternates, filters, quality, "info:AA", "info:AC", "info:AF", "info:AN", "info:BQ", "info:CIGAR", "info:DB", "info:DP", "info:H2", "info:H3", "info:MQ", "info:MQ0", "info:NS", "info:SB", "info:SOMATIC", "info:VALIDATED", "info:1000G", "info:IMPRECISE", "info:NOVEL", "info:END", "info:SVTYPE", "info:SVLEN", "info:CIPOS", "info:CIEND", "info:MEINFO", "info:METRANS", "info:DGVID", "info:DBVARID", "info:DBRIP", "info:MATEID", "info:PARID", "info:EVENT", "info:CILEN", "info:DPADJ", "info:CN", "info:CNADJ", "info:CICN", "info:CICNADJ", "sample:GT", "sample:DP", "sample:FT", "sample:GL", "sample:GLE", "sample:PL", "sample:GP", "sample:GQ", "sample:HQ", "sample:PS", "sample:PQ", "sample:EC", "sample:MQ", "sample:CN", "sample:CNQ", "sample:CNL", "sample:NQ", "sample:HAP", "sample:AHAP", "info:STR", "info:CIPOS95", "info:EVTYPE", "info:PSUP", "info:PRIN", "info:SRSUP", "info:SUP", "sample:PE", "sample:SR", "sample:SUP", "info:QSS", "info:QSS_NT", "info:SGT", "info:TQSS", "info:TQSS_NT", "sample:FDP", "sample:SDP", "sample:SUBDP", "sample:AU", "sample:CU", "sample:GU", "sample:TU", "info:SS", "info:SSC", "info:GPV", "info:SPV", "sample:RD", "sample:AD", "sample:FREQ", "sample:DP4", "sample:IGT", "sample:BCOUNT", "sample:JGQ", "sample:VAQ", "sample:AMQ", "info:NDP", "info:NAC", "info:DDP", "info:DAC", "sample:FA", "info:ABQ", "info:AMQ", "info:AGQ", "sample:ABQ", "sample:AGQ", "info:VAF", "info:DPR") FROM stdin;
1	NORMAL	20	61795	\N	G	T	\N	\N	\N	\N	\N	\N	\N	\N	\N	81	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0/1	44	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	2	4.6768e-16	0.54057	22	22	50%	16,6,9,13	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
1	TUMOR	20	61795	\N	G	T	\N	\N	\N	\N	\N	\N	\N	\N	\N	81	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0/1	37	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	2	4.6768e-16	0.54057	18	19	51.35%	10,8,10,9	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
1	NORMAL	20	62731	\N	C	A	\N	\N	\N	\N	\N	\N	\N	\N	\N	68	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0/1	32	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	1	1.4855e-11	0.75053	17	15	46.88%	9,8,9,6	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
1	TUMOR	20	62731	\N	C	A	\N	\N	\N	\N	\N	\N	\N	\N	\N	68	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0/1	36	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	1	1.4855e-11	0.75053	21	15	41.67%	8,13,8,7	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
1	NORMAL	20	63799	\N	C	T	\N	\N	\N	\N	\N	\N	\N	\N	\N	72	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0/1	39	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	7	3.6893e-16	0.18005	19	19	50%	8,11,11,8	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
1	TUMOR	20	63799	\N	C	T	\N	\N	\N	\N	\N	\N	\N	\N	\N	72	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0/1	33	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	7	3.6893e-16	0.18005	12	21	63.64%	5,7,8,13	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
1	NORMAL	20	65288	\N	G	T	\N	\N	\N	\N	\N	\N	\N	\N	\N	35	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0/1	21	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	0	7.8434e-05	0.82705	13	8	38.1%	4,9,0,8	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
1	TUMOR	20	65288	\N	G	T	\N	\N	\N	\N	\N	\N	\N	\N	\N	35	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0/1	14	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	0	7.8434e-05	0.82705	10	4	28.57%	2,8,0,4	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
1	NORMAL	20	65900	\N	G	A	\N	\N	\N	\N	\N	\N	\N	\N	\N	53	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1/1	26	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	0	1.5943e-31	1.0	0	26	100%	0,0,12,14	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
1	TUMOR	20	65900	\N	G	A	\N	\N	\N	\N	\N	\N	\N	\N	\N	53	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1/1	27	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	0	1.5943e-31	1.0	0	27	100%	0,0,15,12	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
1	NORMAL	20	66370	\N	G	A	\N	\N	\N	\N	\N	\N	\N	\N	\N	66	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1/1	32	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	0	2.6498e-39	1.0	0	32	100%	0,0,11,21	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
1	TUMOR	20	66370	\N	G	A	\N	\N	\N	\N	\N	\N	\N	\N	\N	66	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1/1	34	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	0	2.6498e-39	1.0	0	34	100%	0,0,15,19	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
1	NORMAL	20	68749	\N	T	C	\N	\N	\N	\N	\N	\N	\N	\N	\N	64	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1/1	23	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	0	4.1752e-38	1.0	0	23	100%	0,0,7,16	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
1	TUMOR	20	68749	\N	T	C	\N	\N	\N	\N	\N	\N	\N	\N	\N	64	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1/1	41	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	0	4.1752e-38	1.0	0	41	100%	0,0,21,20	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
1	NORMAL	20	69094	\N	G	A	\N	\N	\N	\N	\N	\N	\N	\N	\N	25	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0/1	12	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	8	4.2836e-05	0.15657	8	4	33.33%	5,3,4,0	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
1	TUMOR	20	69094	\N	G	A	\N	\N	\N	\N	\N	\N	\N	\N	\N	25	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0/1	13	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	8	4.2836e-05	0.15657	5	8	61.54%	3,2,6,2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
1	NORMAL	20	69408	\N	C	T	\N	\N	\N	\N	\N	\N	\N	\N	\N	53	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0/1	27	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	0	8.7266e-12	0.98064	9	18	66.67%	5,4,9,9	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
1	TUMOR	20	69408	\N	C	T	\N	\N	\N	\N	\N	\N	\N	\N	\N	53	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0/1	26	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	0	8.7266e-12	0.98064	15	11	42.31%	6,9,4,7	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
1	NORMAL	20	75254	\N	C	A	\N	\N	\N	\N	\N	\N	\N	\N	\N	74	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0/1	34	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	9	7.9203e-12	0.11567	22	11	33.33%	13,9,5,6	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
1	TUMOR	20	75254	\N	C	A	\N	\N	\N	\N	\N	\N	\N	\N	\N	74	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0/1	40	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	9	7.9203e-12	0.11567	20	20	50%	5,15,14,6	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
\.


--
-- Data for Name: vcf_annotations; Type: TABLE DATA; Schema: public; Owner: danvk
--

COPY vcf_annotations (vcf_id, annotation, type, contig, "position:start", "position:end") FROM stdin;
\.


--
-- Name: vcfs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: danvk
--

SELECT pg_catalog.setval('vcfs_id_seq', 1, true);


--
-- PostgreSQL database dump complete
--
