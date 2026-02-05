import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import JournalBanner from "./components/JournalBanner";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import FeedbackButton from "./components/FeedbackButton";

import AboutJournal from "./components/AboutJournal";
import PublishingOptions from "./components/PublishingOptions";
import Timeline from "./components/Timeline";
import EditorInChief from "./components/EditorInChief";
import ArticlesSection from "./components/ArticlesSection";
import MoreFromIoT from "./components/MoreFromIoT";
import CallsForPapers from "./components/CallsForPapers";
import OpenCalls from "./components/OpenCalls";
import SpecialIssues from "./components/SpecialIssues";

import AimsAndScope from "./components/AimsAndScope";
import GuideForAuthors from "./pages/publish/guide_for_authors";
import AllIssues from "./pages/all_issues/AllIssues";
import LatestIssue from "./pages/latest_issue/LatestIssue";
import PoliciesAndGuidelines from "./pages/publish/policies_and_guidelines";
import CallForAuthorsList, { CallForAuthorsDetail } from "./pages/publish/call_for_authors";
import SignUp from "./pages/sign_pages/signUp";
import LogIn from "./pages/sign_pages/logIn";
import GoogleCallback from "./pages/sign_pages/googleCallback";
import OrcidCallback from "./pages/sign_pages/orcidCallback";
import RoleSelection from "./pages/selection/roleSelection";
import ProtectedRoute from "./components/protectedRoute";
import AuthorDashboard from "./DashBoards/AuthorDashboard";
import ReviewerDashboard from "./DashBoards/ReviewerDashboard";
import EditorDashboard from "./DashBoards/EditorDashboard";
import AdminDashboard from "./DashBoards/AdminDashboard";
import SubmitManuscript from "./pages/manuscripts/SubmitManuscript";
import MyManuscripts from "./pages/manuscripts/MyManuscripts";
import ViewManuscript from "./pages/manuscripts/ViewManuscripts";
import JournalsAndBooks from "./pages/JournalsAndBooks";
import HelpPage from "./pages/help/Help";
import QueryHistory from "./pages/help/QueryHistory";

import ArticlesInPress from "./pages/articles/ArticlesInPress";
import SpecialIssuesPage from "./pages/articles/SpecialIssues";
import LinkedDatasets from "./pages/articles/LinkedDatasets";
import SetUpAlerts from "./pages/articles/SetUpAlerts";
import RSS from "./pages/articles/RSS";

import EditorialBoard from "./pages/about/EditorialBoard";
import EditorDetailPage from "./pages/about/EditorDetailPage";
import JournalInsights from "./pages/about/JournalInsights";
import News from "./pages/about/News";
import EditorsChoice from "./pages/about/EditorsChoice";
import Awards from "./pages/about/Awards";

import OpenAccess from "./pages/publish/OpenAccess";
import CompareJournals from "./pages/publish/CompareJournals";
import LanguageEditing from "./pages/publish/LanguageEditing";

const HomePage = () => {
  return (
    <>
      <div className="mb-10 flex flex-col gap-8 lg:flex-row">
        <div className="w-full lg:w-3/4">
          <AboutJournal />
        </div>
        <div className="w-full lg:w-1/4">
          <PublishingOptions />
        </div>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="flex w-full flex-col gap-10 lg:w-3/4">
          <Timeline />
          <EditorInChief />
          <ArticlesSection />
          <MoreFromIoT />
          <CallsForPapers />
          <OpenCalls />
          <SpecialIssues />
        </div>

        <Sidebar />
      </div>

      <FeedbackButton />
    </>
  );
};

function App() {
  return (
    <Router>
      <div className="flex min-h-screen flex-col bg-light-gray font-inter">
        <Header />
        <JournalBanner />
        <NavBar />

        <main className="mt-8 w-full flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />

            <Route path="/aims-and-scope" element={<AimsAndScope />} />
            <Route path="/all-issues" element={<AllIssues />} />
            <Route path="/latest-issue" element={<LatestIssue />} />
            <Route path="/publish/guide-for-authors" element={<GuideForAuthors />} />
            <Route path="/policies-and-guidelines" element={<PoliciesAndGuidelines />} />
            <Route path="/guide_for_authors" element={<GuideForAuthors />} />
            <Route path="/publish/call-for-authors" element={<CallForAuthorsList />} />
            <Route path="/publish/call-for-authors/:id" element={<CallForAuthorsDetail />} />

            <Route path="/articles-in-press" element={<ArticlesInPress />} />
            <Route path="/special-issues" element={<SpecialIssuesPage />} />
            <Route path="/linked-datasets" element={<LinkedDatasets />} />
            <Route path="/set-up-alerts" element={<SetUpAlerts />} />
            <Route path="/rss" element={<RSS />} />

            <Route path="/journals-and-books" element={<JournalsAndBooks />} />

            <Route path="/editorial-board" element={<EditorialBoard />} />
            <Route path="/editor/:id" element={<EditorDetailPage />} />
            <Route path="/journal-insights" element={<JournalInsights />} />
            <Route path="/news" element={<News />} />
            <Route path="/editors-choice" element={<EditorsChoice />} />
            <Route path="/awards" element={<Awards />} />

            <Route path="/open-access" element={<OpenAccess />} />
            <Route path="/compare-journals" element={<CompareJournals />} />
            <Route path="/language-editing" element={<LanguageEditing />} />

            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<LogIn />} />
            <Route path="/auth/google/callback" element={<GoogleCallback />} />
            <Route path="/auth/orcid/callback" element={<OrcidCallback />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/my-queries" element={<ProtectedRoute><QueryHistory /></ProtectedRoute>} />

            <Route 
              path="/role-selection" 
              element={
                <ProtectedRoute>
                  <RoleSelection />
                </ProtectedRoute>
              } 
            />

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

        <Footer />
      </div>
    </Router>
  );
}

export default App;