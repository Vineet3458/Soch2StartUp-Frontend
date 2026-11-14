/**
 * Role-Based Sidebar Configuration - FOUNDERVERSE Cosmic Identity
 * Provides modular, scalable menu configurations with category sections:
 * - entrepreneur
 * - admin
 * - superadmin
 * - mentor
 * - industry_expert / evaluator
 * - moderator
 */

export const SIDEBAR_CONFIGS = {
  // 1. Entrepreneur (Startup Founder)
  entrepreneur: {
    roleCard: {
      title: "Entrepreneur",
      subtitle: "Startup Founder",
      icon: "rocket",
    },
    notificationCount: 3,
    sections: [
      {
        title: "STARTUP MANAGEMENT",
        items: [
          {
            id: "my-ideas",
            label: "My Ideas",
            icon: "lightbulb",
            isGroup: true,
            defaultExpanded: true,
            children: [
              { id: "all-ideas", label: "All Ideas", path: "/dashboard?tab=all" },
              { id: "drafts", label: "Drafts", path: "/dashboard?tab=drafts" },
              { id: "submitted", label: "Submitted", path: "/dashboard?tab=submitted" },
              { id: "validated", label: "Validated", path: "/dashboard?tab=validated" },
            ],
          },
          {
            id: "validation-reports",
            label: "Validation Reports",
            icon: "chart-bar",
            path: "/dashboard?view=reports",
          },
          {
            id: "market-insights",
            label: "Market Insights",
            icon: "layers",
            path: "/dashboard?view=market",
          },
          {
            id: "competitor-analysis",
            label: "Competitor Analysis",
            icon: "users-group",
            path: "/dashboard?view=competitors",
          },
        ],
      },
      {
        title: "GROWTH & STRATEGY",
        items: [
          {
            id: "swot-analysis",
            label: "SWOT Analysis",
            icon: "file-text",
            path: "/dashboard?view=swot",
          },
          {
            id: "business-plan",
            label: "Business Plan",
            icon: "book-open",
            path: "/dashboard?view=plan",
          },
          {
            id: "mvp-roadmap",
            label: "MVP Roadmap",
            icon: "flag",
            path: "/dashboard?view=roadmap",
          },
          {
            id: "saved-resources",
            label: "Saved Resources",
            icon: "bookmark",
            path: "/dashboard?view=saved",
          },
        ],
      },
    ],
  },

  // 2. Admin (Platform Operations) - Matches UI Screenshots Exactly
  admin: {
    roleCard: {
      title: "Admin",
      subtitle: "Platform Operations",
      icon: "shield",
    },
    notificationCount: 7,
    sections: [
      {
        title: "USER & ACCESS",
        items: [
          {
            id: "users-management",
            label: "Users Management",
            icon: "users-management",
            isGroup: true,
            defaultExpanded: true,
            children: [
              { id: "all-users", label: "All Users", path: "/admin?tab=users" },
              { id: "pending-verification", label: "Pending Verification", path: "/admin?tab=pending" },
              { id: "role-management", label: "Role Management", path: "/admin?tab=roles" },
              { id: "blocked-users", label: "Blocked Users", path: "/admin?tab=blocked" },
            ],
          },
        ],
      },
      {
        title: "STARTUP MANAGEMENT",
        items: [
          {
            id: "startup-ideas",
            label: "Startup Ideas",
            icon: "lightbulb",
            isGroup: true,
            defaultExpanded: false,
            children: [
              { id: "all-ideas", label: "All Ideas", path: "/admin?tab=ideas" },
              { id: "pending-review", label: "Pending Review", path: "/admin?tab=review" },
              { id: "approved-ideas", label: "Approved Ideas", path: "/admin?tab=approved" },
              { id: "rejected-ideas", label: "Rejected Ideas", path: "/admin?tab=rejected" },
            ],
          },
          {
            id: "validation-reports",
            label: "Validation Reports",
            icon: "chart-bar",
            path: "/admin?tab=reports",
          },
          {
            id: "mentors-experts",
            label: "Mentors & Experts",
            icon: "graduation",
            path: "/admin?tab=mentors",
          },
        ],
      },
      {
        title: "OPERATIONS",
        items: [
          {
            id: "requests-approvals",
            label: "Requests & Approvals",
            icon: "check-circle",
            badge: 12,
            path: "/admin?tab=requests",
          },
          {
            id: "content-management",
            label: "Content Management",
            icon: "layers",
            isGroup: true,
            defaultExpanded: false,
            children: [
              { id: "guidelines", label: "Guidelines & Rules", path: "/admin?tab=guidelines" },
              { id: "announcements", label: "Announcements", path: "/admin?tab=announcements" },
            ],
          },
        ],
      },
      {
        title: "INSIGHTS",
        items: [
          {
            id: "analytics-insights",
            label: "Analytics & Insights",
            icon: "pie-chart",
            path: "/admin?tab=analytics",
          },
        ],
      },
    ],
  },

  // 3. Superadmin (Full Platform Control) - 100% Matches UI Screenshots
  superadmin: {
    roleCard: {
      title: "Superadmin",
      subtitle: "SUPERADMIN CONSOLE",
      icon: "crown",
    },
    notificationCount: 12,
    sections: [
      {
        title: "CONTROL CENTER",
        items: [
          {
            id: "system-overview",
            label: "System Overview",
            icon: "activity",
            path: "/admin?tab=overview",
          },
          {
            id: "platform-settings",
            label: "Platform Settings",
            icon: "settings",
            path: "/admin?tab=settings",
          },
          {
            id: "feature-management",
            label: "Feature Management",
            icon: "layers",
            path: "/admin?tab=features",
          },
        ],
      },
      {
        title: "SECURITY & GOVERNANCE",
        items: [
          {
            id: "system-logs",
            label: "System Logs",
            icon: "file-text",
            path: "/admin?tab=logs",
          },
          {
            id: "audit-activity",
            label: "Audit & Activity",
            icon: "shield",
            path: "/admin?tab=audit",
          },
          {
            id: "roles-permissions",
            label: "Roles & Permissions",
            icon: "key",
            path: "/admin?tab=roles-permissions",
          },
        ],
      },
      {
        title: "STARTUP INTELLIGENCE",
        items: [
          {
            id: "idea-categories",
            label: "Idea Categories",
            icon: "lightbulb",
            path: "/admin?tab=categories",
          },
          {
            id: "validation-engine",
            label: "Validation Engine",
            icon: "check-circle",
            path: "/admin?tab=engine",
          },
          {
            id: "scoring-configuration",
            label: "Scoring Configuration",
            icon: "chart-bar",
            path: "/admin?tab=scoring",
          },
        ],
      },
      {
        title: "PLATFORM SERVICES",
        items: [
          {
            id: "integrations",
            label: "Integrations",
            icon: "plug",
            path: "/admin?tab=integrations",
          },
          {
            id: "analytics-reports",
            label: "Analytics & Reports",
            icon: "pie-chart",
            path: "/admin?tab=reports",
          },
        ],
      },
    ],
  },

  // 4. Mentor (Guide & Support)
  mentor: {
    roleCard: {
      title: "Mentor",
      subtitle: "Guide & Support",
      icon: "graduation",
    },
    notificationCount: 4,
    sections: [
      {
        title: "ADVISORY & STARTUPS",
        items: [
          {
            id: "assigned-startups",
            label: "Assigned Startups",
            icon: "rocket",
            isGroup: true,
            defaultExpanded: true,
            children: [
              { id: "my-assignments", label: "My Assignments", path: "/dashboard?tab=assignments" },
              { id: "in-progress", label: "In Progress", path: "/dashboard?tab=in-progress" },
              { id: "completed", label: "Completed", path: "/dashboard?tab=completed" },
              { id: "archived", label: "Archived", path: "/dashboard?tab=archived" },
            ],
          },
          {
            id: "mentor-sessions",
            label: "Mentor Sessions",
            icon: "calendar",
            path: "/dashboard?tab=schedule",
          },
        ],
      },
      {
        title: "GUIDANCE & FEEDBACK",
        items: [
          {
            id: "guidance-feedback",
            label: "Guidance & Feedback",
            icon: "message-circle",
            isGroup: true,
            defaultExpanded: false,
            children: [
              { id: "provide-guidance", label: "Provide Guidance", path: "/dashboard?tab=guidance" },
              { id: "my-feedback", label: "My Feedback", path: "/dashboard?tab=my-feedback" },
            ],
          },
          {
            id: "resources",
            label: "Resources & Playbooks",
            icon: "book-open",
            path: "/dashboard?view=saved",
          },
        ],
      },
    ],
  },

  // 5. Evaluator / Industry Expert (Assess & Rate Ideas)
  industry_expert: {
    roleCard: {
      title: "Evaluator",
      subtitle: "Assess & Rate Ideas",
      icon: "medal",
    },
    notificationCount: 5,
    sections: [
      {
        title: "EVALUATION QUEUE",
        items: [
          {
            id: "evaluation-tasks",
            label: "Evaluation Tasks",
            icon: "clipboard-list",
            isGroup: true,
            defaultExpanded: true,
            children: [
              { id: "assigned-evaluations", label: "Assigned Evaluations", path: "/dashboard?tab=eval-assigned" },
              { id: "pending-reviews", label: "Pending Reviews", path: "/dashboard?tab=eval-pending" },
              { id: "completed-reviews", label: "Completed Reviews", path: "/dashboard?tab=eval-completed" },
              { id: "re-evaluations", label: "Re-Evaluations", path: "/dashboard?tab=eval-re" },
            ],
          },
          {
            id: "idea-evaluation",
            label: "Idea Evaluation",
            icon: "lightbulb",
            path: "/dashboard?tab=eval-form",
          },
        ],
      },
      {
        title: "SCORING & CALIBRATION",
        items: [
          {
            id: "scorecards",
            label: "Scorecards",
            icon: "scale",
            path: "/dashboard?tab=scorecards",
          },
          {
            id: "calibration-disputes",
            label: "Calibration & Disputes",
            icon: "gavel",
            path: "/dashboard?tab=disputes",
          },
          {
            id: "evaluation-reports",
            label: "Evaluation Reports",
            icon: "file-text",
            path: "/dashboard?tab=eval-reports",
          },
          {
            id: "quality-insights",
            label: "Quality Insights",
            icon: "trending-up",
            path: "/dashboard?tab=quality",
          },
        ],
      },
    ],
  },

  // 6. Moderator (Community & Safety)
  moderator: {
    roleCard: {
      title: "Moderator",
      subtitle: "Community & Safety",
      icon: "moderator",
    },
    notificationCount: 2,
    sections: [
      {
        title: "MODERATION QUEUE",
        items: [
          {
            id: "moderation-tasks",
            label: "Moderation Queue",
            icon: "clipboard-list",
            isGroup: true,
            defaultExpanded: true,
            children: [
              { id: "flagged-ideas", label: "Flagged Ideas", path: "/dashboard?tab=mod-ideas" },
              { id: "reported-feedback", label: "Reported Feedback", path: "/dashboard?tab=mod-feedback" },
              { id: "user-reports", label: "User Reports", path: "/dashboard?tab=mod-users" },
            ],
          },
        ],
      },
      {
        title: "STANDARDS & COMPLIANCE",
        items: [
          {
            id: "community-guidelines",
            label: "Community Guidelines",
            icon: "book-open",
            path: "/dashboard?tab=mod-guidelines",
          },
          {
            id: "content-audits",
            label: "Content Audits",
            icon: "shield",
            path: "/dashboard?tab=mod-audits",
          },
          {
            id: "activity-logs",
            label: "Activity Logs",
            icon: "file-text",
            path: "/dashboard?tab=mod-logs",
          },
        ],
      },
    ],
  },
};

// Backward compatibility: also export .menu array
Object.keys(SIDEBAR_CONFIGS).forEach((k) => {
  const cfg = SIDEBAR_CONFIGS[k];
  if (cfg.sections && !cfg.menu) {
    cfg.menu = cfg.sections.flatMap((s) => s.items);
  }
});

SIDEBAR_CONFIGS.evaluator = SIDEBAR_CONFIGS.industry_expert;

export function getSidebarConfig(role) {
  const normalized = (role || "").toLowerCase().trim();
  return SIDEBAR_CONFIGS[normalized] || SIDEBAR_CONFIGS.entrepreneur;
}

export const ALL_ROLES = [
  { key: "entrepreneur", label: "Entrepreneur", subtitle: "Startup Founder" },
  { key: "admin", label: "Admin", subtitle: "Platform Operations" },
  { key: "superadmin", label: "Superadmin", subtitle: "Full Platform Control" },
  { key: "mentor", label: "Mentor", subtitle: "Guide & Support" },
  { key: "industry_expert", label: "Evaluator / Expert", subtitle: "Assess & Rate Ideas" },
  { key: "moderator", label: "Moderator", subtitle: "Community & Safety" },
];
