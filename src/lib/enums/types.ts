export type EnumId = number; // MUST be number (INT) per project requirement
export type EnumName =
  | 'questionType'
  | 'academic_field'
  | 'level'
  | 'examType'
  | 'period'
  | 'duration'
  | 'academic_track'
  | 'sort_order'
  | 'language'
  | 'generation_phase';

export type EnumEntry = {
  i18nKey: string; // e.g. 'enum.format.single_choice'
  editable?: boolean; // can be edited in UI
  clientOnly?: boolean; // created client-side and not yet persisted
  order?: number;
  meta?: Record<string, unknown>;
};

export type EnumMap = Map<number, EnumEntry>;
export type EnumMappings = Record<EnumName, EnumMap>;
