// Add this debugging code to ReviewerDashboard.tsx around line 163
// In the handleViewManuscript function, right after setViewingManuscript:

const handleViewManuscript = async (assignment: ReviewAssignment) => {
  try {
    const res = await reviewerAPI.getManuscriptForReview(assignment.manuscript._id);
    if (res.success) {
      console.log('Full manuscript data received:', res.data.manuscript);
      console.log('Revision history:', res.data.manuscript.revisionHistory);
      console.log('Is revised:', res.data.manuscript.isRevised);
      console.log('Current round:', res.data.manuscript.currentRound);
      setViewingManuscript(res.data.manuscript);
      setShowReviewForm(false);
    } else {
      setMessage({ type: 'error', text: res.message || 'Failed to load manuscript' });
    }
  } catch (error: any) {
    setMessage({ type: 'error', text: error.response?.data?.message || error.message || 'Failed to load manuscript' });
  }
};
