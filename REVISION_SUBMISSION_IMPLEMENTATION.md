# Revision Submission Flow Implementation

## Overview
Implemented a complete revision submission workflow allowing authors to submit revised manuscripts after receiving feedback requiring revisions from reviewers.

## Backend Changes

### 1. **Controller: manuscriptController.js**
- **New Function**: `submitRevision()`
  - Accepts POST requests at `/api/manuscripts/:manuscriptId/submit-revision`
  - Validates that the requester is the corresponding author
  - Checks manuscript status is `revisions_required`
  - Uploads revised file to Cloudinary (with local fallback)
  - Increments `currentRound` by 1
  - Sets status back to `under_review`
  - Sets `workflowStatus` to `REVIEW_IN_PROGRESS`
  - Stores revision metadata (round, date, notes, file info)
  - Notifies assigned editors about the revised submission

### 2. **Model: Manuscript.js**
- **New Field**: `revisions` array with structure:
  ```javascript
  revisions: [{
    round: Number,
    submittedDate: Date,
    notes: String,
    file: {
      public_id: String,
      url: String,
      pages: Number,
      size: Number
    }
  }]
  ```

### 3. **Routes: manuscript.js**
- **New Endpoint**: `POST /api/manuscripts/:manuscriptId/submit-revision`
- Middleware chain:
  - `auth` - requires authentication
  - `authorize('author')` - author role required
  - `upload.single('revisionFile')` - file upload
  - `validate` - request validation
  - `handleUploadErrors` - error handling

## Frontend Changes

### 1. **AuthorDashboard.tsx**
- **New Imports**: Added `Upload` icon from lucide-react

- **New State Variables**:
  - `revisionFile` - tracks selected file per manuscript
  - `revisionNotes` - tracks author notes per manuscript
  - `submittingRevision` - tracks submission state per manuscript

- **New Handler**: `handleRevisionSubmit()`
  - Creates FormData with file and notes
  - Calls `manuscriptAPI.submitRevision()`
  - Shows success/error alerts
  - Refreshes manuscript list on success
  - Clears form state after submission

- **New UI Section**: "Submit Your Revised Manuscript"
  - Appears only when `manuscript.status === 'revisions_required'`
  - File upload input (PDF/DOC/DOCX)
  - Notes textarea (optional)
  - Submit button with loading state
  - File name confirmation display

### 2. **API Service: api.ts**
- **New Method**: `manuscriptAPI.submitRevision(manuscriptId, formData)`
  - POST request with multipart/form-data
  - Sends revisionFile and revisionNotes

## Workflow

1. **Author receives feedback**: Manuscript status = `revisions_required`
2. **Author sees revision UI**: "Submit Your Revised Manuscript" section appears in dashboard
3. **Author uploads file and notes**: Selects revised PDF/DOC, adds optional notes
4. **Backend processes revision**:
   - Validates author ownership
   - Uploads new file
   - Increments round (1 → 2, 2 → 3, etc.)
   - Changes status back to `under_review`
   - Stores revision history
5. **Reviewers receive assignment**: For new round with revised manuscript
6. **Review cycle repeats**: Reviewers review revised version

## Key Features

✅ **Round Tracking**: Each revision increments the review round
✅ **File History**: All revision files stored with metadata
✅ **Author Notes**: Authors can explain changes made
✅ **Editor Notification**: Assigned editors notified of revision submission
✅ **Permission Checks**: Only corresponding author can submit revisions
✅ **Status Management**: Proper status transitions (revisions_required → under_review)
✅ **File Upload**: Support for PDF, DOC, DOCX with Cloudinary + local fallback

## Testing

Created `revision.test.js` with integration tests covering:
- ✅ Successful revision submission
- ✅ Round increment verification
- ✅ Revision history tracking
- ✅ Permission validation (non-authors rejected)
- ✅ Status validation (only revisions_required allowed)

## Notes

- Revision submission resets the review cycle for the new round
- Reviewers will be assigned fresh assignments for the new round
- Revision history is maintained for audit trails
- Author can submit multiple rounds of revisions if needed
