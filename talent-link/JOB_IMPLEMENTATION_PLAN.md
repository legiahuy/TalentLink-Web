# Job Feature - Implementation Plan

## ✅ Clarified Points

1. **Duplicate feature**: Không có
2. **Post Types**: 
   - `post_type` (job_offer, gig, availability) là backend field
   - Tab filter nên theo "looking for" roles (`type` field: producer, singer, venue)
   - **Action**: Cần update tab filter trên `/jobs` page
3. **Review actions**: `accept` = approve để start message, không cần final accept
4. **Prevent duplicate**: Check ở frontend bằng `getMySubmissions` + filter
5. **Edit page**: 
   - **Proposal**: Route riêng `/jobs/[id]/edit` (consistent với `/jobs/post`)
   - **Fields không nên edit**: 
     - `id`, `created_at`, `published_at` (nếu đã published)
     - Stats: `total_submissions`, `applications_count`, `views_count`
     - `creator_id`, `creator_role` (không thể thay đổi owner)

---

## 📋 Implementation Priority

### Phase 1: Core Missing Features (Critical)

#### 1. `/jobs/[id]/applications` - View Submissions (Job Owner)
**Route**: `/jobs/[id]/applications` hoặc `/jobs/[id]?tab=applications`

**Features**:
- List all submissions với pagination
- Filter by status: All, Pending Review, Under Review, Accepted, Rejected, Skipped, Withdrawn
- Sort: Newest, Oldest, Name
- Bulk actions: Approve/Reject/Skip multiple
- Individual submission card với:
  - Applicant name, avatar, profile link
  - Submission date
  - Status badge
  - Cover letter preview
  - Quick actions (View Details, Approve, Reject, Skip)
- Submission detail modal/page:
  - Full applicant info
  - Cover letter
  - Demo files (play/view)
  - Portfolio links
  - Review notes
  - Timeline/history
  - Actions: Approve, Reject, Skip, Start Review
  - Link to create message (sau khi approve)

**API**: `getJobSubmissions`, `reviewSubmission`, `bulkReviewAction`, `getSubmissionById`, `getSubmissionTimeline`

---

#### 2. `/jobs/my-applications` - My Applications (Applicant)
**Route**: `/jobs/my-applications`

**Features**:
- List all user's submissions với pagination
- Filter by status: All, Pending, Under Review, Accepted, Rejected
- Filter by job status: All, Active, Closed
- Each card shows:
  - Job title, company/creator name
  - Submission date
  - Status badge với color coding
  - Link to job detail
  - Link to view submission details
- Empty state khi chưa apply job nào
- Stats summary: Total, Pending, Accepted, Rejected

**API**: `getMySubmissions`, `getSubmissionById`

---

#### 3. Prevent Duplicate Application
**Location**: `/jobs/[id]` page

**Features**:
- Check `getMySubmissions` khi load job detail
- Filter submissions by current job_id
- Nếu đã apply:
  - Hide/Disable "Apply Now" button
  - Show status badge: "Applied - [Status]"
  - Show link to view application details
- Nếu chưa apply:
  - Show "Apply Now" button như bình thường

**Implementation**:
```typescript
// In JobDetailPage
const [hasApplied, setHasApplied] = useState(false)
const [applicationStatus, setApplicationStatus] = useState<string | null>(null)

useEffect(() => {
  const checkApplication = async () => {
    try {
      const mySubmissions = await jobService.getMySubmissions()
      const myApplication = mySubmissions.submissions?.find(
        (sub) => sub.job?.id === jobId
      )
      if (myApplication) {
        setHasApplied(true)
        setApplicationStatus(myApplication.status)
      }
    } catch (error) {
      // Handle error
    }
  }
  if (jobId) checkApplication()
}, [jobId])
```

---

### Phase 2: Job Management

#### 4. `/jobs/[id]/edit` - Edit Job Post
**Route**: `/jobs/[id]/edit`

**Features**:
- Reuse form từ `/jobs/post` page
- Pre-fill với existing job data
- Warning banner nếu job có applications: "This job has X applications. Editing may affect existing applications."
- Fields không cho edit (readonly hoặc hidden):
  - `id`, `created_at`, `published_at`
  - Stats fields
  - `creator_id`, `creator_role`
- Allow edit:
  - Title, description, brief_description
  - Post type, role type
  - Location, budget, payment
  - Requirements, benefits
  - Deadlines
  - Status (draft ↔ published)
- Actions:
  - Save changes
  - Cancel (back to job detail)
  - Close job (separate action)
  - Delete job (with confirmation)

**API**: `getJobById`, `updateJob`, `closeJob`, `publishJob`

---

#### 5. Submission Detail View
**Location**: Modal hoặc separate page

**Features**:
- Full submission information
- Applicant profile card với link
- Cover letter (full text)
- Demo files: play audio/video, download, view images
- Portfolio links (clickable)
- Review notes (nếu có)
- Timeline/history của status changes
- Actions (for job owner):
  - Approve → move to approved tab, enable message
  - Reject → move to rejected
  - Skip → keep in pending
  - Start Review → move to under_review
- Review notes input field

**API**: `getSubmissionById`, `getSubmissionTimeline`, `reviewSubmission`

---

## 🔧 Technical Implementation Details

### File Structure
```
/jobs/
  [id]/
    page.tsx (existing - job detail)
    applications/
      page.tsx (NEW - view submissions)
    edit/
      page.tsx (NEW - edit job)
  my-applications/
    page.tsx (NEW - my applications)
  post/
    page.tsx (existing - create job)
  my-posts/
    page.tsx (existing - my job posts)
  page.tsx (existing - job listing)
```

### Components to Create
1. `SubmissionCard.tsx` - Card component for submission list
2. `SubmissionDetailModal.tsx` - Modal for viewing submission details
3. `SubmissionStatusBadge.tsx` - Status badge component
4. `ReviewActionButtons.tsx` - Approve/Reject/Skip buttons
5. `ApplicationStatusBadge.tsx` - Badge for "Applied" status

### Update Existing
1. `/jobs/page.tsx` - Update tabs to filter by `type` field (looking for roles)
2. `/jobs/[id]/page.tsx` - Add duplicate application check
3. `/jobs/my-posts/page.tsx` - Fix "View applicants" link

---

## 🎨 UI/UX Considerations

### Status Colors
- **Pending Review**: Yellow/Orange
- **Under Review**: Blue
- **Accepted**: Green
- **Rejected**: Red
- **Skipped**: Gray
- **Withdrawn**: Gray

### Empty States
- No submissions yet
- No applications yet
- No jobs found

### Loading States
- Skeleton loaders for lists
- Loading spinners for actions

### Error Handling
- Toast notifications for errors
- Retry buttons
- Graceful degradation

---

## 📝 Next Steps

1. ✅ Clarify requirements (DONE)
2. ⏳ Update job listing tabs (filter by `type` field)
3. ⏳ Implement `/jobs/[id]/applications` page
4. ⏳ Implement `/jobs/my-applications` page
5. ⏳ Add duplicate application check
6. ⏳ Implement `/jobs/[id]/edit` page
7. ⏳ Create submission detail view
8. ⏳ Testing & refinement

---

## ❓ Final Clarifications Needed

1. **Tab Filter**: 
   - Update tabs trên `/jobs` page để filter theo `type` field (producer, singer, venue)?
   - Hoặc filter theo `creator_role`?
   - Labels: "Looking for Producer", "Looking for Singer", "Looking for Venue"?

2. **Edit Page Fields**:
   - Confirm fields không cho edit đã đúng chưa?
   - Có cần disable edit khi job đã closed không?

3. **Submission Status**:
   - Sau khi approve, status là "accepted" hay "approved"?
   - Backend trả về status values nào?

---

Ready to start implementation! 🚀

