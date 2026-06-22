import axios from 'axios';

// =============================================================================
// URL da API - Usa URL relativa em produção para evitar Mixed Content (HTTPS/HTTP)
// O Next.js rewrites em next.config.js faz o proxy: /api/* → http://backend:8000/api/*
// =============================================================================
const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api/v1';

// =============================================================================
// MEDIA URL RESOLVER
// Resolve a URL base para arquivos de mídia (/media/...)
//
// Casos:
//   1. NEXT_PUBLIC_SITE_URL definida (prod Docker)  → usa ela
//      Ex: NEXT_PUBLIC_SITE_URL=https://virtu.com.br  ⇒  https://virtu.com.br/media/...
//      O rewrite do Next.js (/media/* → backend:8000/media/*) resolve internamente.
//
//   2. NEXT_PUBLIC_API_URL é absoluta (dev local)  → extrai origem
//      Ex: NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api/v1  ⇒  http://127.0.0.1:8000
//
//   3. Fallback: string vazia (URL relativa) — só funciona em browser
// =============================================================================
function getMediaBaseUrl(): string {
  // Em prod no Docker: NEXT_PUBLIC_SITE_URL deve ser https://brio-staging-web.com.br
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
  }
  // Em dev local: extrai origem do NEXT_PUBLIC_API_URL
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
  if (apiUrl && !apiUrl.startsWith('/')) {
    try { return new URL(apiUrl).origin; } catch {}
  }
  // Fallback hardcoded para staging (garante que nunca retorna string vazia em prod)
  return 'https://brio-staging-web.com.br';
}

const MEDIA_BASE_URL = getMediaBaseUrl();

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper: converte URLs de media relativas para absolutas quando necessário
function fixMediaUrls(obj: any): any {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(fixMediaUrls);

  const newObj: any = {};
  for (const [key, value] of Object.entries(obj)) {
    if (key === 'url' && typeof value === 'string') {
      if (value.startsWith('/media/')) {
        // URL relativa de mídia — prefixar com a origem correta
        // Em prod (Docker): '' — o Next.js proxy serve /media/* via rewrite
        // Em dev local: 'http://127.0.0.1:8000'
        newObj[key] = `${MEDIA_BASE_URL}${value}`;
      } else if (value.startsWith('http') && value.includes('/media/')) {
        // URL absoluta já presente (ex: staging) — mantém como está
        newObj[key] = value;
      } else {
        newObj[key] = value;
      }
    } else {
      newObj[key] = fixMediaUrls(value);
    }
  }
  return newObj;
}

api.interceptors.response.use((response) => {
  response.data = fixMediaUrls(response.data);
  return response;
});

// =============================================================================
// TYPES
// =============================================================================

export interface Cidade {
  id: number;
  nome: string;
  estado: string;
}

export interface Status {
  id: number;
  nome: string;
  slug: string;
  cor_badge: string;
}

export interface Imagem {
  url: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface Parceiro {
  id: number;
  nome: string;
  logo: Imagem | null;
  site: string;
}

export interface Diferencial {
  id: number;
  nome: string;
  descricao: string;
  icone: Imagem | null;
  categoria: string;
}

export interface Depoimento {
  id: number;
  nome: string;
  cargo: string;
  foto: Imagem | null;
  texto: string;
  avaliacao: number;
}

export interface Planta {
  id: number;
  nome: string;
  dormitorios: number | null;
  metragem: number | null;
  imagem: Imagem | null;
  descricao: string;
  caracteristicas: string[];
}

export interface GaleriaImagem {
  id: number;
  imagem: Imagem | null;
  thumb: Imagem | null;
  descricao: string;
}

export interface AndamentoObra {
  id: number;
  titulo: string;
  percentual: number;
}

export interface FotoObra {
  id: number;
  imagem: Imagem | null;
  data_captura: string | null;
  descricao: string;
}

export interface EmpreendimentoCard {
  id: number;
  title: string;
  slug: string;
  url: string;
  status: Status | null;
  cidade: Cidade | null;
  descricao_curta: string;
  preco_a_partir: string | null;
  metragem_a_partir: string | null;
  dormitorios: string;
  caracteristicas_resumo: string;
  imagem_principal: Imagem | null;
  data_entrega: string | null;
  destaque: boolean;
}

export interface EmpreendimentoDetalhe extends EmpreendimentoCard {
  parceiros: Parceiro[];
  diferenciais: Diferencial[];
  subtitulo: string;
  descricao: string;
  localizacao: string;
  imagem_hero: Imagem | null;
  logo: Imagem | null;
  video_url: string;
  video_thumbnail: Imagem | null;
  galeria_imagens: GaleriaImagem[];
  plantas: Planta[];
  andamentos_obra: AndamentoObra[];
  fotos_obra: FotoObra[];
  endereco: string;
  bairro: string;
  latitude: string | null;
  longitude: string | null;
}

export interface EtapaJornada {
  numero: string;
  titulo: string;
  descricao: string;
  icone: Imagem | null;
}

export interface HeroBanner {
  imagem: Imagem | null;
  titulo: string;
  subtitulo: string;
}

export interface SeloQualidade {
  nome: string;
  imagem: Imagem | null;
}

export interface HomeData {
  hero_titulo: string;
  hero_imagem: Imagem | null;
  secao_futuro_titulo: string;
  secao_futuro_texto: string;
  secao_futuro_imagem: Imagem | null;
  banner_institucional_imagem: Imagem | null;
  banner_institucional_texto: string;
  secao_jornada_titulo: string;
  etapas_jornada: EtapaJornada[];
  empreendimento_destaque: EmpreendimentoCard | null;
  banner_destaque_texto: string;
  secao_depoimentos_titulo: string;
  cta_titulo: string;
  cta_botao_texto: string;
  video_url: string;
  video_thumbnail: Imagem | null;
  depoimentos: Depoimento[];
  hero_banners: HeroBanner[];
}

export interface SobreNosData {
  hero_titulo: string;
  hero_imagem: Imagem | null;
  historia_titulo: string;
  historia_texto: string;
  video_titulo: string;
  video_url: string;
  video_thumbnail: Imagem | null;
  missao_titulo: string;
  missao_texto: string;
  visao_titulo: string;
  visao_texto: string;
  valores_titulo: string;
  valores_texto: string;
  politica_titulo: string;
  politica_texto: string;
  cta_titulo: string;
  cta_subtitulo: string;
  cta_botao_texto: string;
  cta_imagem: Imagem | null;
  missao_icone: Imagem | null;
  visao_icone: Imagem | null;
  valores_icone: Imagem | null;
  mvv_background: Imagem | null;
  selos_qualidade: SeloQualidade[];
}

export interface ConfiguracaoSite {
  email: string;
  telefone: string;
  whatsapp: string;
  endereco: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  youtube: string;
  copyright_texto: string;
  banner_cta_imagem: Imagem | null;
  banner_cta_wrapper_imagem: Imagem | null;
  banner_logo_parceiro: Imagem | null;
  banner_logo_virtu: Imagem | null;
}

export interface TrackingConfig {
  gtm_ativo: boolean;
  gtm_container_id: string;
  rdstation_ativo: boolean;
  rdstation_public_token: string;
  meta_pixel_ativo: boolean;
  meta_pixel_id: string;
  ga4_ativo: boolean;
  ga4_measurement_id: string;
}

export interface LeadData {
  nome: string;
  email: string;
  telefone: string;
  mensagem?: string;
  origem?: string;
  empreendimento?: number;
  pagina_origem?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

// =============================================================================
// API FUNCTIONS
// =============================================================================

export interface EmpreendimentosIndexConfig {
  hero_titulo: string;
  hero_subtitulo: string;
  hero_imagem: Imagem | null;
  form_titulo: string;
  secao_projetos_titulo: string;
  banner_label: string;
  banner_texto: string;
  banner_logo_parceiro: Imagem | null;
  banner_logo_virtu: Imagem | null;
}

export async function getEmpreendimentosConfig(): Promise<EmpreendimentosIndexConfig> {
  const { data } = await api.get('/empreendimentos-config/');
  return data;
}

export async function getHome(): Promise<HomeData> {
  const { data } = await api.get('/home/');
  return data;
}

export async function getEmpreendimentos(params?: {
  cidade?: number;
  status?: string;
  destaque?: boolean;
}): Promise<EmpreendimentoCard[]> {
  const { data } = await api.get('/empreendimentos/', { params });
  return data.results || data;
}

export async function getEmpreendimento(slug: string): Promise<EmpreendimentoDetalhe> {
  const { data } = await api.get(`/empreendimentos/${slug}/`);
  return data;
}

export async function getEmpreendimentosDestaques(): Promise<EmpreendimentoCard[]> {
  const { data } = await api.get('/empreendimentos/destaques/');
  return data;
}

export async function getCidades(): Promise<Cidade[]> {
  const { data } = await api.get('/cidades/');
  return data.results || data;
}

export async function getDepoimentos(destaque?: boolean): Promise<Depoimento[]> {
  const { data } = await api.get('/depoimentos/', {
    params: destaque ? { destaque: 'true' } : undefined,
  });
  return data.results || data;
}

export async function getSobreNos(): Promise<SobreNosData> {
  const { data } = await api.get('/sobre-nos/');
  return data;
}

export async function getConfiguracoes(): Promise<ConfiguracaoSite> {
  const { data } = await api.get('/configuracoes/');
  return data;
}

export async function getTracking(): Promise<TrackingConfig> {
  const { data } = await api.get('/tracking/');
  return data;
}

export async function createLead(lead: LeadData): Promise<{ message: string; id: number }> {
  const { data } = await api.post('/leads/', lead);
  return data;
}

export async function createNewsletter(email: string): Promise<{ message: string }> {
  const { data } = await api.post('/newsletter/', { email });
  return data;
}

export default api;
