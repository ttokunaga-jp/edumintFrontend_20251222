# Quick Reference: User Factory

## Import & Use

```typescript
import { 
  createDefaultUser, 
  createMultilingualUsers,
  createMockUser,
  updateUserSettings,
  validateUserSettings
} from '@/mocks/data';
```

## Common Patterns

### Generate Current Session User
```typescript
const currentUser = createMockUser();
// Returns: Complete user with all required fields
```

### Generate Test User with Language Override
```typescript
const englishUser = createDefaultUser({ language: 1 });
// Automatically sets: country="United States", timezone="America/Los_Angeles"
```

### Generate Multiple Users for Multilingual Testing
```typescript
const [japaneseUser, englishUser, chineseUser] = createMultilingualUsers(3);
// ~2-3 users will be Japanese (80% distribution)
// Others will be from languages 1-4
```

### Update User Language and Sync Region
```typescript
let user = createDefaultUser();
user = updateUserSettings(user, { language: 2 });
// Now: language=2 (Chinese), country="China", timezone="Asia/Shanghai"
```

### Validate User Settings Before Using
```typescript
const user = createDefaultUser();
const errors = validateUserSettings(user);
if (errors.length > 0) {
  console.error('Invalid user:', errors);
}
```

## Available Languages

| ID | Name | Language | Country | Timezone |
|----|------|----------|---------|----------|
| 0 | Japanese | 日本語 | Japan | Asia/Tokyo |
| 1 | English | English | United States | America/Los_Angeles |
| 2 | Chinese | 中文 | China | Asia/Shanghai |
| 3 | Korean | 한국어 | South Korea | Asia/Seoul |
| 4 | Other | Other | Other | UTC |

## Field Mapping

```typescript
interface User {
  id: string;                    // Auto-generated
  username: string;              // Auto-generated
  email: string;                 // Auto-generated
  language: number;              // 0-4 (numeric ID)
  country: string;               // Synced with language
  timezone: string;              // IANA timezone, synced with language
  academicSystem: number;        // 0 (science) or 1 (humanities)
  majorType: number;             // 0 or 1, synced with academicSystem
  faculty: string;               // Department name
  school: string;                // University name
  currentAcademicYear: number;   // Current year
  createdAt: string;             // ISO timestamp
  updatedAt: string;             // ISO timestamp
}
```

## Default Behavior

- **Language Distribution**: 80% Japanese, 20% random (1-4)
- **Country**: Always populated, matches language
- **Timezone**: Always populated, matches country
- **Academic System**: Randomly 0 or 1
- **Faculty**: Generated from academic system
- **School**: Generated or overridable

## Testing Patterns

### Component Rendering with Varied Languages
```typescript
describe('MyPage Profile', () => {
  const languages = [0, 1, 2, 3];
  languages.forEach(lang => {
    it(`should render correctly for language ${lang}`, () => {
      const user = createDefaultUser({ language: lang });
      render(<MyPageProfile user={user} />);
      // Assert correct rendering
    });
  });
});
```

### Edge Case: All Languages
```typescript
const users = createMultilingualUsers(10);
// Tests with actual distribution:
// ~8 Japanese, 2 varied languages
```

## Mock Data File Location

**Static Mock Data**: `/src/mocks/mockData/user.json`
- Contains pre-generated users (Alice, Bob, Charlie)
- Used by handlers and authentication

**Factory Module**: `/src/mocks/factories/userFactory.ts`
- Contains generation logic
- Exported from `/src/mocks/data/index.ts`

## Common Issues & Solutions

### Issue: User language is null/undefined
**Solution**: Use factory instead of static mock
```typescript
// ❌ Avoid
const user = {
  language: undefined,
  country: null
};

// ✅ Use
const user = createDefaultUser();
```

### Issue: Country doesn't match language
**Solution**: Use updateUserSettings to maintain consistency
```typescript
// ❌ Avoid
user.language = 2;
user.country = "Japan"; // Wrong!

// ✅ Use
user = updateUserSettings(user, { language: 2 });
// Automatically sets country="China", timezone="Asia/Shanghai"
```

### Issue: Timezone not recognized
**Solution**: Verify IANA timezone format
```typescript
// All timezones follow IANA format
// Valid: "Asia/Tokyo", "America/Los_Angeles"
// Invalid: "JST", "UTC+9"

const user = createDefaultUser({ language: 0 });
console.log(user.timezone); // "Asia/Tokyo" ✓
```

## Performance Notes

- Factory functions are synchronous (no async calls)
- LANGUAGE_REGION_MAP is a simple object lookup (O(1))
- Suitable for test setup and component initialization
- Minimal impact on build size (~4.4 kB gzipped)

## Next Steps

1. **Validate in MyPage**: Open browser and check language dropdown
2. **Add to Tests**: Use factory in component/integration tests
3. **Extend as Needed**: Add more languages/regions to LANGUAGE_REGION_MAP
