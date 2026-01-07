/**
 * User Mock Data Factory
 * Generates realistic user mock data with valid enum-based settings
 * 
 * Design:
 * - 80% of users use default language (Japanese)
 * - 20% of users use other supported languages (for edge case testing)
 * - Language and region combinations are consistent
 * - All required settings fields have non-null values
 */

import { getOrderedEnumIds, getRandomEnumId } from '@/lib/enums/enumHelpers';
import { DEFAULT_ENUM_MAPPINGS } from '@/lib/enums/enumMappings';

// Get available language IDs from enumMappings (0=ja, 1=en, 2=zh, 3=ko, 4=other)
const LANGUAGE_IDS = getOrderedEnumIds('language');
const ACADEMIC_TRACK_IDS = getOrderedEnumIds('academic_track');

/**
 * Timezone mapping for consistent language-region pairs
 * Language ID -> { country, timezone }
 */
const LANGUAGE_REGION_MAP: Record<number, { country: string; timezone: string }> = {
  0: { country: 'Japan', timezone: 'Asia/Tokyo' },          // Japanese
  1: { country: 'United States', timezone: 'America/Los_Angeles' }, // English
  2: { country: 'China', timezone: 'Asia/Shanghai' },        // Chinese
  3: { country: 'South Korea', timezone: 'Asia/Seoul' },     // Korean
  4: { country: 'Other', timezone: 'UTC' },                   // Other
};

interface UserFactoryOptions {
  id?: string;
  username?: string;
  displayName?: string;
  email?: string;
  university?: string;
  faculty?: string;
  department?: string;
  academicField?: number;
  academicSystem?: number;
  language?: number;
  country?: string;
  timezone?: string;
  majorType?: 0 | 1;
  bio?: string;
  role?: 'user' | 'admin';
  status?: 'active' | 'inactive';
}

/**
 * Generates a realistic language ID with weighted distribution:
 * - 80% chance of default language (Japanese, ID=0)
 * - 20% chance of random other language
 */
function generateLanguageId(): number {
  const rand = Math.random();
  if (rand < 0.8) {
    return 0; // Default: Japanese
  }
  // 20% - pick randomly from other languages
  const otherLanguages = LANGUAGE_IDS.filter((id) => id !== 0);
  return otherLanguages[Math.floor(Math.random() * otherLanguages.length)];
}

/**
 * Create a default user mock with all required settings
 */
export function createDefaultUser(overrides?: UserFactoryOptions) {
  // Generate consistent language and region
  const languageId = overrides?.language ?? generateLanguageId();
  const regionInfo = LANGUAGE_REGION_MAP[languageId];
  
  const academicSystemId = overrides?.academicSystem ?? ACADEMIC_TRACK_IDS[0]; // Default to science (0)
  const majorType = overrides?.majorType ?? (academicSystemId === 0 ? 0 : 1); // 0=science, 1=humanities

  const now = new Date().toISOString();

  return {
    id: overrides?.id ?? `u_${Math.random().toString(36).substr(2, 12)}`,
    username: overrides?.username ?? 'default_user',
    displayName: overrides?.displayName ?? 'Default User',
    email: overrides?.email ?? 'user@example.com',
    isEmailVerified: true,
    isVerified: true,
    university: overrides?.university ?? '大学未設定',
    universityId: 1,
    universityName: overrides?.university ?? '大学未設定',
    facultyId: 101,
    faculty: overrides?.faculty ?? '学部未設定',
    facultyName: overrides?.faculty ?? '学部未設定',
    department: overrides?.department ?? '学科未設定',
    majorType,
    academicField: overrides?.academicField ?? (majorType === 0 ? 15 : 3),
    academicSystem: academicSystemId,
    // ✅ ENFORCE: Language is always set to valid enum ID
    language: languageId,
    // ✅ ENFORCE: Country/Region is always consistent with language
    country: overrides?.country ?? regionInfo.country,
    // ✅ ENFORCE: Timezone is always set based on language/region
    timezone: overrides?.timezone ?? regionInfo.timezone,
    bio: overrides?.bio ?? '自己紹介未設定',
    role: overrides?.role ?? 'user',
    status: overrides?.status ?? 'active',
    mintcoinBalance: 2500,
    followerCount: 0,
    blockedCount: 0,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Create multiple users with varied languages for testing
 */
export function createMultilingualUsers(count: number = 5) {
  const users = [];
  
  // First user: Japanese (default)
  users.push(
    createDefaultUser({
      id: 'u_k8P3n9L2mR5qW4xZ',
      username: 'alice_science',
      displayName: 'Alice Smith',
      email: 'alice@tsukuba.ac.jp',
      university: '筑波大学',
      faculty: '理工学群',
      department: '工学システム学類',
      academicField: 15,
      language: 0, // Japanese
      majorType: 0,
      bio: '量子コンピューティングを研究しています。',
    })
  );

  // Second user: Japanese (default)
  users.push(
    createDefaultUser({
      id: 'v_l9Q4o8N3pS6rX5yA',
      username: 'bob_arts',
      displayName: 'Bob Jones',
      email: 'bob@keio.jp',
      university: '慶應義塾大学',
      faculty: '文学部',
      department: '人文社会学科',
      academicField: 3,
      language: 0, // Japanese
      majorType: 1,
      bio: '近代日本文学が好きです。',
    })
  );

  // Additional users with varied languages (for edge case testing)
  for (let i = 2; i < count; i++) {
    // Cycle through languages for variety
    const languageIndex = (i - 2) % (LANGUAGE_IDS.length);
    const languageId = LANGUAGE_IDS[languageIndex];
    
    users.push(
      createDefaultUser({
        id: `u_user${i}`,
        username: `user_${i}`,
        displayName: `User ${i}`,
        email: `user${i}@example.com`,
        language: languageId,
        academicSystem: ACADEMIC_TRACK_IDS[i % ACADEMIC_TRACK_IDS.length],
      })
    );
  }

  return users;
}

/**
 * Create a single mock user (for quick testing)
 */
export function createMockUser(overrides?: UserFactoryOptions) {
  return createDefaultUser(overrides);
}

/**
 * Update user with new settings, preserving consistency
 */
export function updateUserSettings(
  user: ReturnType<typeof createDefaultUser>,
  updates: Partial<UserFactoryOptions>
) {
  // If language is being updated, sync region and timezone
  if (updates.language !== undefined) {
    const regionInfo = LANGUAGE_REGION_MAP[updates.language];
    return {
      ...user,
      ...updates,
      country: updates.country ?? regionInfo.country,
      timezone: updates.timezone ?? regionInfo.timezone,
    };
  }

  return { ...user, ...updates };
}

/**
 * Validate that a user has all required settings
 * Returns any missing or invalid fields
 */
export function validateUserSettings(user: any): string[] {
  const errors: string[] = [];

  if (user.language === undefined || user.language === null) {
    errors.push('language: must be set to a valid language ID');
  } else if (!LANGUAGE_IDS.includes(user.language)) {
    errors.push(`language: ${user.language} is not a valid language ID`);
  }

  if (user.country === undefined || user.country === null) {
    errors.push('country: must be set');
  }

  if (user.timezone === undefined || user.timezone === null) {
    errors.push('timezone: must be set');
  }

  if (user.academicSystem !== undefined && user.academicSystem !== null) {
    if (!ACADEMIC_TRACK_IDS.includes(user.academicSystem)) {
      errors.push(
        `academicSystem: ${user.academicSystem} is not a valid academic track ID`
      );
    }
  }

  return errors;
}
