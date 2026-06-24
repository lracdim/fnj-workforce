export interface BlogPost {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  content: string[];
  img: string;
  date: string;
  readTime: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'signs-time-to-hire-staffing-partner',
    category: 'Hiring Strategy',
    title: "5 Signs It's Time to Hire a Staffing Partner",
    excerpt: "If your team is stretched thin and open roles keep piling up, here's how to know it's time.",
    img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
    date: 'March 2025',
    readTime: '5 min read',
    content: [
      "Hiring internally feels manageable — until it doesn't. Most businesses don't realize they need staffing help until they're already behind on critical roles.",
      "Sign one: your open positions are taking longer than 30 days to fill. Sign two: your team is doing recruiting on top of their actual jobs, and both are suffering. Sign three: you're settling for 'good enough' candidates because you're out of time, not options.",
      "Sign four: turnover keeps creeping up because rushed hires rarely stick. Sign five: you have no real pipeline — every opening starts from zero.",
      "A staffing partner doesn't replace your hiring process. It extends it — giving you access to vetted candidates, faster timelines, and one less thing pulling your team's attention away from the work that actually grows your business.",
    ],
  },
  {
    slug: 'retain-top-talent-competitive-market',
    category: 'Retention',
    title: 'How to Retain Top Talent in a Competitive Market',
    excerpt: "Great hires are only half the equation — here's what keeps them.",
    img: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1200&q=80',
    date: 'February 2025',
    readTime: '4 min read',
    content: [
      "Finding great talent is hard. Keeping it is harder. In a market where employees have options, retention isn't about ping-pong tables — it's about respect, clarity, and growth.",
      "Start with onboarding. Employees decide whether they'll stay long-term within their first 90 days. A rushed, unclear onboarding sends the wrong signal from day one.",
      "Next, communicate clearly and often. Ambiguity about expectations, performance, or growth paths is one of the top reasons good employees quietly start job hunting.",
      "Finally, invest in development. Even small, consistent opportunities to grow — a new responsibility, a skills workshop, a mentorship conversation — tell people you're building something with them, not just employing them.",
    ],
  },
  {
    slug: 'true-cost-of-a-bad-hire',
    category: 'Hiring Strategy',
    title: 'The True Cost of a Bad Hire',
    excerpt: "It's more than a wasted paycheck — here's the full picture.",
    img: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80',
    date: 'January 2025',
    readTime: '6 min read',
    content: [
      "A bad hire costs more than a salary. Studies consistently show the real cost — recruiting time, onboarding investment, lost productivity, team disruption, and eventual replacement — can run 1.5 to 3 times the role's annual salary.",
      "But the harder costs are harder to measure: the manager hours spent managing the mismatch, the team morale hit when a struggling hire affects everyone's workload, and the opportunity cost of the role staying effectively unfilled while someone underperforms in it.",
      "Most bad hires aren't bad people — they're bad fits. Rushed timelines, unclear role definitions, and shallow screening processes are the real culprits behind most mismatched placements.",
      "The fix isn't hiring slower — it's hiring smarter. Structured screening, clear role expectations, and a process built to evaluate fit (not just resumes) is what separates a quick hire from a right hire.",
    ],
  },
];