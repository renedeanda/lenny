import { Question } from './types';

export const questions: Question[] = [
  {
    id: 'q1',
    number: 1,
    text: "Your team can ship a 'good enough' feature tomorrow or a polished version in 2 weeks. What do you do?",
    answers: [
      {
        id: 'a',
        text: "Ship tomorrow, iterate based on feedback",
        icon: "⚡"
      },
      {
        id: 'b',
        text: "Wait 2 weeks, launch something impressive",
        icon: "✨"
      },
      {
        id: 'c',
        text: "Ship a prototype tomorrow, polish over time",
        icon: "⚖️"
      }
    ]
  },
  {
    id: 'q2',
    number: 2,
    text: "Your data says users want feature X. Your gut screams feature Y. What wins?",
    answers: [
      {
        id: 'a',
        text: "Always trust the data",
        icon: "📊"
      },
      {
        id: 'b',
        text: "Trust my intuition, data can mislead",
        icon: "🎯"
      },
      {
        id: 'c',
        text: "Use data to validate intuition",
        icon: "🔍"
      }
    ]
  },
  {
    id: 'q3',
    number: 3,
    text: "Users keep asking for feature Z, but it breaks your long-term vision. You...",
    answers: [
      {
        id: 'a',
        text: "Give users what they want",
        icon: "👥"
      },
      {
        id: 'b',
        text: "Hold the vision, they'll understand later",
        icon: "🎯"
      },
      {
        id: 'c',
        text: "Find a creative compromise",
        icon: "🤝"
      }
    ]
  },
  {
    id: 'q4',
    number: 4,
    text: "You have 3 months. Do you...",
    answers: [
      {
        id: 'a',
        text: "Build 5 small features",
        icon: "🎲"
      },
      {
        id: 'b',
        text: "Perfect 1 flagship feature",
        icon: "💎"
      },
      {
        id: 'c',
        text: "Launch 2-3 solid features",
        icon: "⚖️"
      }
    ]
  },
  {
    id: 'q5',
    number: 5,
    text: "Your team's approach to planning is...",
    answers: [
      {
        id: 'a',
        text: "Detailed roadmaps, OKRs, milestones",
        icon: "📋"
      },
      {
        id: 'b',
        text: "Move fast, figure it out as we go",
        icon: "🌪️"
      },
      {
        id: 'c',
        text: "Light process, heavy execution",
        icon: "⚡"
      }
    ]
  },
  {
    id: 'q6',
    number: 6,
    text: "When making big product decisions, you...",
    answers: [
      {
        id: 'a',
        text: "Decide quickly, then communicate",
        icon: "⚡"
      },
      {
        id: 'b',
        text: "Build consensus across stakeholders",
        icon: "🤝"
      },
      {
        id: 'c',
        text: "Decide with 2-3 key people",
        icon: "👥"
      }
    ]
  },
  {
    id: 'q7',
    number: 7,
    text: "Your product philosophy is...",
    answers: [
      {
        id: 'a',
        text: "Do one thing incredibly well",
        icon: "🎯"
      },
      {
        id: 'b',
        text: "Build a platform with many use cases",
        icon: "🌐"
      },
      {
        id: 'c',
        text: "Start focused, expand strategically",
        icon: "📈"
      }
    ]
  }
];
