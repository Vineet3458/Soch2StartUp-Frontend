// Single source of truth for navigation AND routes. A sidebar entry can never point to a page that
// does not exist, and a role can never open a page that is not listed for it.
import { lazy } from "react";
import { Activity, Award, BarChart3, BookOpen, Bookmark, Calendar, ClipboardCheck, ClipboardList, Cpu, Eye, FileBarChart, FileText, Flag, GraduationCap, History, Inbox, KeyRound, LayoutDashboard, Library, Lightbulb, LineChart, MessageSquare, Plug, Scale, ScrollText, Settings, ShieldAlert, ShieldCheck, SlidersHorizontal, Star, Swords, Tags, ToggleRight, TrendingUp, Users, Rocket, Gauge, Sparkles } from "lucide-react";

const V = {
  Overview: lazy(() => import("./Overview.jsx")),
  Ideas: lazy(() => import("./IdeasView.jsx")),
  IdeaDetail: lazy(() => import("./IdeaDetail.jsx")),
  Validate: lazy(() => import("./ValidateIdea.jsx")),
  Reports: lazy(() => import("./ReportsView.jsx")),
  Insights: lazy(() => import("./InsightViews.jsx")),
  Growth: lazy(() => import("./GrowthViews.jsx")),
  Compare: lazy(() => import("./Compare.jsx")),
  Resources: lazy(() => import("./ResourcesView.jsx")),
  Account: lazy(() => import("./AccountViews.jsx")),
  Users: lazy(() => import("./UsersView.jsx")),
  Requests: lazy(() => import("./RequestsView.jsx")),
  Analytics: lazy(() => import("./AnalyticsView.jsx")),
  Config: lazy(() => import("./ConfigViews.jsx")),
  Logs: lazy(() => import("./LogsView.jsx")),
  Mentor: lazy(() => import("./MentorViews.jsx")),
  Expert: lazy(() => import("./ExpertViews.jsx")),
  Moderation: lazy(() => import("./ModerationViews.jsx")),
};

const ALL = ["entrepreneur", "mentor", "industry_expert", "admin", "superadmin", "moderator"];
const ADM = ["admin", "superadmin"];

// path → { C: component, roles, props?, feature?, perm? }.  `props` are passed to the component.
export const ROUTES = [
  { path: "ideas/:id", C: V.IdeaDetail, roles: ALL },
  { path: "ideas", C: V.Ideas, roles: ["entrepreneur", ...ADM] },
  { path: "validate", C: V.Validate, roles: ["entrepreneur"] },
  { path: "reports", C: V.Reports, roles: ["entrepreneur", ...ADM] },
  { path: "market", C: V.Insights, props: { page: "market" }, roles: ["entrepreneur"] },
  { path: "competitors", C: V.Insights, props: { page: "competitors" }, roles: ["entrepreneur"] },
  { path: "swot", C: V.Insights, props: { page: "swot" }, roles: ["entrepreneur"] },
  { path: "plan", C: V.Growth, props: { page: "plan" }, roles: ["entrepreneur"] },
  { path: "roadmap", C: V.Growth, props: { page: "roadmap" }, roles: ["entrepreneur"] },
  { path: "compare", C: V.Compare, roles: ["entrepreneur", ...ADM], feature: "compareIdeas" },
  { path: "resources", C: V.Resources, roles: ALL, feature: "resourceHub" },
  { path: "notifications", C: V.Account, props: { page: "notifications" }, roles: ALL },
  { path: "profile", C: V.Account, props: { page: "profile" }, roles: ALL },
  { path: "account", C: V.Account, props: { page: "settings" }, roles: ALL },
  { path: "users", C: V.Users, props: { preset: "all" }, roles: ADM, perm: "users.view" },
  { path: "pending", C: V.Users, props: { preset: "pending" }, roles: ADM, perm: "users.view" },
  { path: "roles", C: V.Users, props: { preset: "roles" }, roles: ADM, perm: "users.view" },
  { path: "blocked", C: V.Users, props: { preset: "blocked" }, roles: ADM, perm: "users.view" },
  { path: "mentors", C: V.Users, props: { preset: "mentors" }, roles: ADM, perm: "users.view" },
  { path: "requests", C: V.Requests, roles: ADM },
  { path: "analytics", C: V.Analytics, roles: ADM, perm: "analytics.view" },
  { path: "platform", C: V.Config, props: { page: "platform" }, roles: ["superadmin"] },
  { path: "features", C: V.Config, props: { page: "features" }, roles: ["superadmin"] },
  { path: "permissions", C: V.Config, props: { page: "permissions" }, roles: ["superadmin"] },
  { path: "categories", C: V.Config, props: { page: "categories" }, roles: ["superadmin"] },
  { path: "engine", C: V.Config, props: { page: "engine" }, roles: ["superadmin"] },
  { path: "scoring", C: V.Config, props: { page: "scoring" }, roles: ["superadmin"] },
  { path: "integrations", C: V.Config, props: { page: "integrations" }, roles: ["superadmin"] },
  { path: "logs", C: V.Logs, props: { kind: "system" }, roles: ["superadmin"] },
  { path: "audit", C: V.Logs, props: { kind: "audit" }, roles: [...ADM, "moderator"], perm: "logs.view" },
  { path: "assignments", C: V.Mentor, props: { page: "assignments" }, roles: ["mentor"] },
  { path: "sessions", C: V.Mentor, props: { page: "sessions" }, roles: ["mentor", "entrepreneur", ...ADM], feature: "sessions" },
  { path: "guidance", C: V.Mentor, props: { page: "guidance" }, roles: ["mentor"] },
  { path: "my-feedback", C: V.Mentor, props: { page: "feedback" }, roles: ["mentor"] },
  { path: "evaluations", C: V.Expert, props: { page: "queue" }, roles: ["industry_expert"], feature: "evaluations" },
  { path: "evaluate", C: V.Expert, props: { page: "evaluate" }, roles: ["industry_expert"], feature: "evaluations" },
  { path: "scorecards", C: V.Expert, props: { page: "scorecards" }, roles: ["industry_expert"] },
  { path: "disputes", C: V.Expert, props: { page: "disputes" }, roles: ["industry_expert"] },
  { path: "eval-reports", C: V.Expert, props: { page: "reports" }, roles: ["industry_expert"] },
  { path: "quality", C: V.Expert, props: { page: "quality" }, roles: ["industry_expert"] },
  { path: "mod-ideas", C: V.Moderation, props: { page: "idea" }, roles: ["moderator", ...ADM], feature: "moderation", perm: "reports.moderate" },
  { path: "mod-feedback", C: V.Moderation, props: { page: "feedback" }, roles: ["moderator", ...ADM], feature: "moderation", perm: "reports.moderate" },
  { path: "mod-users", C: V.Moderation, props: { page: "user" }, roles: ["moderator", ...ADM], feature: "moderation", perm: "reports.moderate" },
  { path: "mod-audits", C: V.Moderation, props: { page: "audits" }, roles: ["moderator"], perm: "reports.moderate" },
];
export const Overview = V.Overview;

/* ── Navigation per role ── item: { label, icon, to, badge?, feature?, perm?, children?: [{label,to}] } ── */
const NAV = {
  entrepreneur: {
    card: { title: "Entrepreneur", sub: "Startup Founder", icon: Rocket },
    sections: [
      { title: "STARTUP MANAGEMENT", items: [
        { label: "Overview", icon: LayoutDashboard, to: "/app" },
        { label: "My Ideas", icon: Lightbulb, to: "/app/ideas", badge: "changes", children: [
          { label: "All Ideas", to: "/app/ideas" }, { label: "Drafts", to: "/app/ideas?f=drafts" }, { label: "Submitted", to: "/app/ideas?f=submitted" }, { label: "Validated", to: "/app/ideas?f=validated" }] },
        { label: "Validate New Idea", icon: Sparkles, to: "/app/validate" },
        { label: "Validation Reports", icon: FileBarChart, to: "/app/reports" },
        { label: "Market Insights", icon: TrendingUp, to: "/app/market" },
        { label: "Competitor Analysis", icon: Swords, to: "/app/competitors" },
        { label: "Mentoring Sessions", icon: Calendar, to: "/app/sessions", feature: "sessions" } ] },
      { title: "GROWTH & STRATEGY", items: [
        { label: "SWOT Analysis", icon: ClipboardList, to: "/app/swot" },
        { label: "Business Plan", icon: BookOpen, to: "/app/plan" },
        { label: "MVP Roadmap", icon: Flag, to: "/app/roadmap" },
        { label: "Compare Ideas", icon: Scale, to: "/app/compare", feature: "compareIdeas" },
        { label: "Saved Resources", icon: Bookmark, to: "/app/resources?saved=1", feature: "resourceHub" } ] },
    ] },
  admin: {
    card: { title: "Admin", sub: "Platform Operations", icon: ShieldCheck },
    sections: [
      { title: "INSIGHTS", items: [{ label: "Analytics & Insights", icon: BarChart3, to: "/app", perm: "analytics.view" }] },
      { title: "USER & ACCESS", items: [
        { label: "Users Management", icon: Users, to: "/app/users", perm: "users.view", badge: "pending", children: [
          { label: "All Users", to: "/app/users" }, { label: "Pending Verification", to: "/app/pending" }, { label: "Role Management", to: "/app/roles" }, { label: "Blocked Users", to: "/app/blocked" }] } ] },
      { title: "STARTUP MANAGEMENT", items: [
        { label: "Startup Ideas", icon: Lightbulb, to: "/app/ideas", badge: "review", children: [
          { label: "All Ideas", to: "/app/ideas" }, { label: "Pending Review", to: "/app/ideas?s=review" }, { label: "Approved Ideas", to: "/app/ideas?s=approved" }, { label: "Rejected Ideas", to: "/app/ideas?s=rejected" }] },
        { label: "Validation Reports", icon: FileBarChart, to: "/app/reports" },
        { label: "Mentors & Experts", icon: GraduationCap, to: "/app/mentors", perm: "users.view" } ] },
      { title: "OPERATIONS", items: [
        { label: "Requests & Approvals", icon: Inbox, to: "/app/requests", badge: "requests" },
        { label: "Mentor Sessions", icon: Calendar, to: "/app/sessions", feature: "sessions" },
        { label: "Content Management", icon: FileText, to: "/app/resources?kind=guideline", perm: "resources.manage", feature: "resourceHub", children: [
          { label: "Guidelines & Rules", to: "/app/resources?kind=guideline" }, { label: "Announcements", to: "/app/resources?kind=announcement" }, { label: "Templates & Playbooks", to: "/app/resources?kind=template" }] },
        { label: "Moderation Queue", icon: ShieldAlert, to: "/app/mod-ideas", badge: "reports", perm: "reports.moderate", feature: "moderation" },
        { label: "Audit & Activity", icon: History, to: "/app/audit", perm: "logs.view" } ] },
    ] },
  superadmin: {
    card: { title: "Superadmin", sub: "Platform Owner", icon: ShieldCheck },
    sections: [
      { title: "CONTROL CENTER", items: [
        { label: "System Overview", icon: Activity, to: "/app" }, { label: "Platform Settings", icon: Settings, to: "/app/platform" }, { label: "Feature Management", icon: ToggleRight, to: "/app/features" }] },
      { title: "SECURITY & GOVERNANCE", items: [
        { label: "System Logs", icon: ScrollText, to: "/app/logs" }, { label: "Audit & Activity", icon: History, to: "/app/audit" }, { label: "Roles & Permissions", icon: KeyRound, to: "/app/permissions" }] },
      { title: "STARTUP INTELLIGENCE", items: [
        { label: "Idea Categories", icon: Tags, to: "/app/categories" }, { label: "Validation Engine", icon: Cpu, to: "/app/engine" }, { label: "Scoring Configuration", icon: SlidersHorizontal, to: "/app/scoring" }] },
      { title: "PLATFORM SERVICES", items: [
        { label: "Integrations", icon: Plug, to: "/app/integrations" }, { label: "Analytics & Reports", icon: LineChart, to: "/app/analytics" }] },
      { title: "ADMINISTRATION", items: [
        { label: "Users Management", icon: Users, to: "/app/users", badge: "pending", children: [
          { label: "All Users", to: "/app/users" }, { label: "Pending Verification", to: "/app/pending" }, { label: "Role Management", to: "/app/roles" }, { label: "Blocked Users", to: "/app/blocked" }] },
        { label: "Startup Ideas", icon: Lightbulb, to: "/app/ideas", badge: "review", children: [
          { label: "All Ideas", to: "/app/ideas" }, { label: "Pending Review", to: "/app/ideas?s=review" }, { label: "Approved", to: "/app/ideas?s=approved" }, { label: "Rejected", to: "/app/ideas?s=rejected" }] },
        { label: "Mentors & Experts", icon: GraduationCap, to: "/app/mentors" }, { label: "Requests & Approvals", icon: Inbox, to: "/app/requests", badge: "requests" },
        { label: "Moderation Queue", icon: ShieldAlert, to: "/app/mod-ideas", badge: "reports", feature: "moderation" },
        { label: "Content Management", icon: FileText, to: "/app/resources?kind=guideline", feature: "resourceHub", children: [
          { label: "Guidelines & Rules", to: "/app/resources?kind=guideline" }, { label: "Announcements", to: "/app/resources?kind=announcement" }, { label: "Templates & Playbooks", to: "/app/resources?kind=template" }] }] },
    ] },
  mentor: {
    card: { title: "Mentor", sub: "Guide & Support", icon: GraduationCap },
    sections: [
      { title: "ADVISORY & STARTUPS", items: [
        { label: "Overview", icon: LayoutDashboard, to: "/app" },
        { label: "Assigned Startups", icon: Lightbulb, to: "/app/assignments", badge: "assignments", children: [
          { label: "My Assignments", to: "/app/assignments" }, { label: "In Progress", to: "/app/assignments?f=progress" }, { label: "Completed", to: "/app/assignments?f=completed" }, { label: "Archived", to: "/app/assignments?f=archived" }] },
        { label: "Mentor Sessions", icon: Calendar, to: "/app/sessions", feature: "sessions" }] },
      { title: "GUIDANCE & FEEDBACK", items: [
        { label: "Provide Guidance", icon: MessageSquare, to: "/app/guidance" }, { label: "My Feedback", icon: Star, to: "/app/my-feedback" },
        { label: "Resources & Playbooks", icon: Library, to: "/app/resources?kind=playbook", feature: "resourceHub" }] },
    ] },
  industry_expert: {
    card: { title: "Evaluator", sub: "Industry Expert", icon: Award },
    sections: [
      { title: "EVALUATION QUEUE", items: [
        { label: "Overview", icon: LayoutDashboard, to: "/app" },
        { label: "Evaluation Tasks", icon: ClipboardCheck, to: "/app/evaluations", badge: "evaluations", feature: "evaluations", children: [
          { label: "Assigned Evaluations", to: "/app/evaluations" }, { label: "Pending Reviews", to: "/app/evaluations?f=pending" }, { label: "Completed Reviews", to: "/app/evaluations?f=completed" }, { label: "Re-Evaluations", to: "/app/evaluations?f=re" }] },
        { label: "Idea Evaluation", icon: Star, to: "/app/evaluate", feature: "evaluations" }] },
      { title: "SCORING & CALIBRATION", items: [
        { label: "Scorecards", icon: Gauge, to: "/app/scorecards" }, { label: "Calibration & Disputes", icon: Scale, to: "/app/disputes", badge: "disputes" },
        { label: "Evaluation Reports", icon: FileBarChart, to: "/app/eval-reports" }, { label: "Quality Insights", icon: LineChart, to: "/app/quality" },
        { label: "Rubrics & Playbooks", icon: Library, to: "/app/resources?kind=playbook", feature: "resourceHub" }] },
    ] },
  moderator: {
    card: { title: "Moderator", sub: "Community Safety", icon: ShieldAlert },
    sections: [
      { title: "MODERATION QUEUE", items: [
        { label: "Overview", icon: LayoutDashboard, to: "/app" },
        { label: "Moderation Queue", icon: ShieldAlert, to: "/app/mod-ideas", badge: "reports", feature: "moderation", perm: "reports.moderate", children: [
          { label: "Flagged Ideas", to: "/app/mod-ideas" }, { label: "Reported Feedback", to: "/app/mod-feedback" }, { label: "User Reports", to: "/app/mod-users" }] }] },
      { title: "STANDARDS & COMPLIANCE", items: [
        { label: "Community Guidelines", icon: BookOpen, to: "/app/resources?kind=guideline", feature: "resourceHub" },
        { label: "Content Audits", icon: Eye, to: "/app/mod-audits", perm: "reports.moderate" }, { label: "Activity Logs", icon: History, to: "/app/audit", perm: "logs.view" }] },
    ] },
};
export const navFor = (role) => NAV[role] || NAV.entrepreneur;

