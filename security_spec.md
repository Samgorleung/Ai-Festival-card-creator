# Security Specification for Firestore Rules

## 1. Data Invariants
- Each document in `/cards/{cardId}` must contain required attributes: `id`, `timestamp`, `festivalId`, `festivalName`, `greeting`, `textStyle`, `aspectRatio`, and `composedImage`.
- Document ID path variable `{cardId}` must be valid alphanumeric/dash/underscore of length <= 128.
- Incoming string fields must obey explicit size limits (e.g., greeting <= 500 chars, festivalId <= 64, composedImage size <= 800,000 bytes).
- Text style must be one of `['light', 'dark', 'gold', 'neon']`.
- Aspect ratio must be one of `['1:1', '3:4', '4:3', '9:16', '16:9']`.
- Cards are public by default or viewable by everyone (`isPublic == true` or general read for community cards), enabling gallery loading across browser refreshes and deep link sharing.
- Card deletion is limited to the author/owner (matching auth uid or ownerId) or disabled from anonymous bulk purge.

## 2. The Dirty Dozen Payloads (Target Rejections)
1. Injected ghost field: `{ ...validCard, isAdmin: true }` -> Rejected (hasOnly validation)
2. Oversized greeting: `{ ...validCard, greeting: 'A'.repeat(5000) }` -> Rejected (size <= 500)
3. Invalid textStyle: `{ ...validCard, textStyle: 'malicious' }` -> Rejected (enum validation)
4. Invalid aspectRatio: `{ ...validCard, aspectRatio: '99:99' }` -> Rejected (enum validation)
5. Missing required field: `{ id: '123', timestamp: 12345 }` -> Rejected (missing required fields)
6. Non-string composedImage: `{ ...validCard, composedImage: 12345 }` -> Rejected (type check)
7. Giant ID poisoning: `{ ...validCard, id: 'A'.repeat(2000) }` -> Rejected (isValidId check)
8. Attempting to tamper immutable fields: Changing createdAt/id on update -> Rejected
9. Spoofing ownerId to other user -> Rejected
10. Unrestricted delete by unauthorized client -> Rejected
11. Malformed timestamp type -> Rejected
12. Attempt to write to arbitrary unspecified root collection -> Denied by default-deny catchall.
