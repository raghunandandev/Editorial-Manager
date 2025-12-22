# Journals & Books Feature - Quick Reference

## Files Modified

### Backend (2 files)
1. **backend/controllers/manuscriptController.js**
   - Added: `getAcceptedManuscripts()` function
   - Filters manuscripts by status (accepted, published, selected)
   - Supports search parameter

2. **backend/routes/manuscript.js**
   - Added: Public route `GET /api/manuscripts/accepted`
   - No middleware requirements
   - Supports query parameter: `?search=keyword`

### Frontend (3 files)
1. **frontend/src/components/NavBar.tsx**
   - Added: "Journals & Books" tab to navigation
   - Links to `/journals-and-books`
   - No breaking changes to existing logic

2. **frontend/src/pages/JournalsAndBooks.tsx** (NEW FILE)
   - Public page component
   - Fetches and displays accepted manuscripts
   - Includes search and download functionality
   - Responsive design with error/loading states

3. **frontend/src/App.tsx**
   - Added: Import for JournalsAndBooks component
   - Added: Public route to `/journals-and-books`

## API Endpoint

```
GET /api/manuscripts/accepted
No authentication required
Query parameters:
  - search: (optional) Filter by manuscript title (case-insensitive)

Response:
{
  success: true,
  data: {
    manuscripts: [...],
    count: number
  }
}
```

## Component Props & State

No props required - JournalsAndBooks is a standalone page component.

Internal state:
- `manuscripts`: Full list from API
- `filteredManuscripts`: Search results
- `searchQuery`: Current search text
- `loading`: Fetch in progress
- `error`: Error message
- `downloadingId`: Which manuscript is being downloaded

## Styling

Uses existing Tailwind utilities:
- `brand-blue` for primary color
- Responsive grid/flex layouts
- Standard button styles
- Card-based design

Icons from lucide-react:
- `Search`: Search icon
- `Download`: Download button
- `Loader2`: Loading spinner
- `AlertCircle`: Error indicator

## Key Features

1. **Client-side Search**: Instant filtering as user types
2. **Server-side Search Option**: API supports search parameter for future optimization
3. **Responsive Design**: Works on all screen sizes
4. **Loading States**: User feedback while fetching
5. **Error Handling**: Graceful fallback if API fails
6. **Download Integration**: Uses existing download infrastructure

## Testing Commands

```bash
# Start backend
cd backend && node server.js

# Test public API endpoint
curl http://localhost:3000/api/manuscripts/accepted

# Test search
curl "http://localhost:3000/api/manuscripts/accepted?search=manuscript"

# Verify auth still required on other endpoints
curl http://localhost:3000/api/manuscripts/my-manuscripts
```

## Future Enhancements

- Add pagination support
- Filter by domain/category
- Sort options
- Detailed manuscript view modal
- Download analytics
- Bookmark functionality
- Export features

## Common Issues & Solutions

**Issue**: No manuscripts showing
- Check database has manuscripts with status "accepted"
- Verify API endpoint is working: `curl http://localhost:3000/api/manuscripts/accepted`

**Issue**: Download not working
- Ensure Cloudinary credentials are configured
- Check manuscript has valid `manuscriptFile` field

**Issue**: Page not found
- Verify route is added to App.tsx
- Check component import is correct
- Clear browser cache and reload

**Issue**: Search not working
- Ensure API is returning data
- Check browser console for errors
- Verify search query matches manuscript titles
