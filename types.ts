export interface Consumption {
  id: string;
  month: number; // 1-12
  year: number;
  value: number;
  analysis?: string;
}

export interface Indicator {
  id: string;
  name: string;
  unit: string;
  target: number;
  consumptions: Consumption[];
}

export type DocumentStatus = 'Aprovado' | 'Em Elaboração' | 'Em Aprovação' | 'Obsoleto';

export interface Attachment {
  name: string;
  type: string;
  content: string; // base64
}

export interface Document {
  id: string;
  code: string;
  name: string;
  revision: number;
  status: DocumentStatus;
  approvalDate: string; // ISO string format
  nextRevisionDate: string; // ISO string format
  attachment?: Attachment;
}

export type Page = 'indicadores' | 'documentos';