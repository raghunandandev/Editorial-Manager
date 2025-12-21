import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layout Components
import Header from "./components/Header";
import JournalBanner from "./components/JournalBanner";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import FeedbackButton from "./components/FeedbackButton";

// Home Page Sections
import AboutJournal from "./components/AboutJournal";
import PublishingOptions from "./components/PublishingOptions";
import Timeline from "./components/Timeline";
import EditorInChief from "./components/EditorInChief";
import ArticlesSection from "./components/ArticlesSection";
import MoreFromIoT from "./components/MoreFromIoT";
import CallsForPapers from "./components/CallsForPapers";
import OpenCalls from "./components/OpenCalls";
import SpecialIssues from "./components/SpecialIssues";

// Pages
import AimsAndScope from "./components/AimsAndScope";
import GuideForAuthors from "./pages/publish/guide_for_authors";
import AllIssues from "./pages/all_issues/AllIssues";
import LatestIssue from "./pages/latest_issue/LatestIssue";
//import SubmitArticle from "./pages/submit_article/submit_article";
import PoliciesAndGuidelines from "./pages/publish/policies_and_guidelines";
import CallForAuthorsList, { CallForAuthorsDetail } from "./pages/publish/call_for_authors";
import SignUp from "./pages/sign_pages/signUp";
import LogIn from "./pages/sign_pages/logIn";
import RoleSelection from "./pages/selection/roleSelection";
import ProtectedRoute from "./components/protectedRoute";
import AuthorDashboard from "./DashBoards/AuthorDashboard";
import ReviewerDashboard from "./DashBoards/ReviewerDashboard";
import EditorDashboard from "./DashBoards/EditorDashboard";
import AdminDashboard from "./DashBoards/AdminDashboard";
import SubmitManuscript from "./pages/manuscripts/SubmitManuscript";
import MyManuscripts from "./pages/manuscripts/MyManuscripts";
import ViewManuscript from "./pages/manuscripts/ViewManuscripts";

// Home Page as a separate component for cleaner structure
const HomePage = () => {
  return (
    <>
      {/* AboutJournal and PublishingOptions side-by-side */}
      <div className="mb-10 flex flex-col gap-8 lg:flex-row">
        <div className="w-full lg:w-3/4">
          <AboutJournal />
        </div>
        <div className="w-full lg:w-1/4">
          <PublishingOptions />
        </div>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Main Content */}
        <div className="flex w-full flex-col gap-10 lg:w-3/4">
          <Timeline />
          <EditorInChief />
          <ArticlesSection />
          <MoreFromIoT />
          <CallsForPapers />
          <OpenCalls />
          <SpecialIssues />
        </div>

        {/* Sidebar */}
        <Sidebar />
      </div>

      {/* Fixed Feedback Button */}
      <FeedbackButton />
    </>
  );
};

function App() {
  return (
    <Router>
      <div className="flex min-h-screen flex-col bg-light-gray font-inter">
        {/* Persistent Layout */}
        <Header />
        <JournalBanner />
        <NavBar />

        {/* Page Content */}
        <main className="mt-8 w-full flex-grow">
          <Routes>
            {/* Home Page */}
            <Route path="/" element={<HomePage />} />

            {/* Other Pages */}
            <Route path="/aims-and-scope" element={<AimsAndScope />} />
            <Route path="/all-issues" element={<AllIssues />} />
            <Route path="/latest-issue" element={<LatestIssue />} />
            <Route path="/publish/guide-for-authors" element={<GuideForAuthors />} />
            {/* <Route path="/submit-article" element={<SubmitArticle />} /> */}
            <Route path="/policies-and-guidelines" element={<PoliciesAndGuidelines />} />
            <Route path="/guide_for_authors" element={<GuideForAuthors />} />
            <Route path="/publish/call-for-authors" element={<CallForAuthorsList />} />
            <Route path="/publish/call-for-authors/:id" element={<CallForAuthorsDetail />} />

            {/* Auth Pages */}
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<LogIn />} />

            {/* Protected Routes */}
            <Route 
              path="/role-selection" 
              element={
                <ProtectedRoute>
                  <RoleSelection />
                </ProtectedRoute>
              } 
            />

            {/* Role-specific Dashboard Routes (Add your actual components later) */}
            
            
            <Route path="/author-dashboard" element={<ProtectedRoute><AuthorDashboard></AuthorDashboard></ProtectedRoute>} />
            <Route path="/reviewer-dashboard" element={<ProtectedRoute><ReviewerDashboard></ReviewerDashboard></ProtectedRoute>} />
            <Route path="/editor-dashboard" element={<ProtectedRoute><EditorDashboard></EditorDashboard></ProtectedRoute>} />
            <Route 
              path="/admin-dashboard" 
              element={
                <ProtectedRoute roles={['editorInChief']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />


            <Route path="/submit-manuscript" element={<ProtectedRoute><SubmitManuscript></SubmitManuscript></ProtectedRoute>}></Route>
            <Route path="/my-manuscripts" element={<ProtectedRoute><MyManuscripts></MyManuscripts></ProtectedRoute>}></Route>
            <Route path="/manuscript/:id" element={<ProtectedRoute><ViewManuscript></ViewManuscript></ProtectedRoute>}></Route>


            
          </Routes>


          


        </main>

        {/* Persistent Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;