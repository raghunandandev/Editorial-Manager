const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
const User = require('../../models/User');
const Manuscript = require('../../models/Manuscript');
const Review = require('../../models/Review');
const fs = require('fs');
const path = require('path');

describe('Revision Submission Flow', () => {
  let authorToken;
  let editorToken;
  let authorId;
  let manuscriptId;
  let testFilePath;

  beforeAll(async () => {
    // Create test file
    testFilePath = path.join(__dirname, '../../uploads/test-revision.pdf');
    fs.writeFileSync(testFilePath, Buffer.from('test revision content'));
  });

  afterAll(async () => {
    // Cleanup
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
    }
  });

  it('should allow author to submit revision for revisions_required manuscript', async () => {
    // 1. Create author user
    const author = await User.create({
      firstName: 'Test',
      lastName: 'Author',
      email: 'author-revision@test.com',
      password: 'password123',
      roles: { author: true }
    });
    authorId = author._id;

    // 2. Create a manuscript
    const manuscript = await Manuscript.create({
      title: 'Test Revision Manuscript',
      abstract: 'Abstract',
      domain: 'Computer Science',
      correspondingAuthor: authorId,
      authors: [{ user: authorId, isCorresponding: true, order: 1 }],
      status: 'revisions_required', // Set to revisions_required
      currentRound: 1,
      manuscriptFile: {
        public_id: 'test_id',
        url: '/uploads/original.pdf',
        size: 100
      }
    });
    manuscriptId = manuscript._id;

    // 3. Create review with revision recommendation
    await Review.create({
      manuscript: manuscriptId,
      reviewer: new mongoose.Types.ObjectId(),
      round: 1,
      scores: { originality: 4, methodology: 4, contribution: 4, clarity: 4, references: 4 },
      overallScore: 4,
      commentsToAuthor: 'Please revise and resubmit',
      recommendation: 'minor_revisions',
      status: 'submitted',
      submittedDate: new Date()
    });

    // 4. Login as author
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'author-revision@test.com',
        password: 'password123'
      });

    authorToken = loginRes.body.data.token;

    // 5. Submit revision
    const revisionRes = await request(app)
      .post(`/api/manuscripts/${manuscriptId}/submit-revision`)
      .set('Authorization', `Bearer ${authorToken}`)
      .field('revisionNotes', 'I have addressed all reviewer comments')
      .attach('revisionFile', testFilePath);

    expect(revisionRes.status).toBe(200);
    expect(revisionRes.body.success).toBe(true);
    expect(revisionRes.body.data.newRound).toBe(2);

    // 6. Verify manuscript was updated
    const updatedManuscript = await Manuscript.findById(manuscriptId);
    expect(updatedManuscript.status).toBe('under_review');
    expect(updatedManuscript.currentRound).toBe(2);
    expect(updatedManuscript.revisions.length).toBe(1);
    expect(updatedManuscript.revisions[0].round).toBe(2);
  });

  it('should reject revision submission if status is not revisions_required', async () => {
    const author = await User.create({
      firstName: 'Test2',
      lastName: 'Author2',
      email: 'author2-revision@test.com',
      password: 'password123',
      roles: { author: true }
    });

    const manuscript = await Manuscript.create({
      title: 'Test Manuscript Non-Revision',
      abstract: 'Abstract',
      domain: 'Computer Science',
      correspondingAuthor: author._id,
      authors: [{ user: author._id, isCorresponding: true, order: 1 }],
      status: 'under_review', // NOT revisions_required
      currentRound: 1,
      manuscriptFile: {
        public_id: 'test_id',
        url: '/uploads/original.pdf',
        size: 100
      }
    });

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'author2-revision@test.com',
        password: 'password123'
      });

    const token = loginRes.body.data.token;

    const revisionRes = await request(app)
      .post(`/api/manuscripts/${manuscript._id}/submit-revision`)
      .set('Authorization', `Bearer ${token}`)
      .field('revisionNotes', 'Test notes')
      .attach('revisionFile', testFilePath);

    expect(revisionRes.status).toBe(400);
    expect(revisionRes.body.success).toBe(false);
    expect(revisionRes.body.message).toContain('does not require revisions');
  });
});
