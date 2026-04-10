import re

with open('generate_data.js', 'r', encoding='utf-8') as f:
    text = f.read()

# We will just append before `// Memory (RAM)`
deployment_tools = [
"""  { id: 455, title: 'Vercel', subtitle: 'Frontend Cloud & Next.js creator', category: 'TOOLS', isNew: true, features: { Type: 'Deployment', Subscription: 'Freemium' },
    specifications: { Type: 'Platform as a Service', Platform: 'Web', Support: 'Global Edge Network', License: 'Proprietary Service', Description: 'Vercel is the platform for frontend developers, providing the speed and reliability innovators need to create at the moment of inspiration.', PrimaryUseCase: 'Zero-configuration deployment for frontend frameworks and serverless functions.', Ecosystem: 'Next.js, React, Edge Functions', FreeTier: 'Hobby (Free forever for non-commercial)', ProTier: '$20/mo per user (1TB Bandwidth)', EnterpriseTier: 'Custom pricing (Enhanced Security, SLA)' },
    scores: { Reliability: 99, Speed: 100, EaseOfUse: 98 },
    prices: { official: { price: 'Freemium', link: 'https://vercel.com/' } }
  },
  { id: 456, title: 'Netlify', subtitle: 'Connect everything. Build anywhere.', category: 'TOOLS', isNew: false, features: { Type: 'Deployment', Subscription: 'Freemium' },
    specifications: { Type: 'Platform as a Service', Platform: 'Web', Support: 'Jamstack', License: 'Proprietary Service', Description: 'A unified platform that automates your code to create high-performant, easily maintainable sites and web apps.', PrimaryUseCase: 'Jamstack applications with automated edge deployments.', Ecosystem: 'Gatsby, Nuxt, Edge CDN', FreeTier: 'Starter (100GB Bandwidth, 300 build mins)', ProTier: '$19/mo per user (1TB Bandwidth)', EnterpriseTier: 'Custom pricing (99.99% Uptime SLA)' },
    scores: { Reliability: 98, Speed: 97, EaseOfUse: 99 },
    prices: { official: { price: 'Freemium', link: 'https://www.netlify.com/' } }
  },
  { id: 457, title: 'Render', subtitle: 'Unified Cloud to build and run all your apps', category: 'TOOLS', isNew: true, features: { Type: 'Deployment', Subscription: 'Freemium' },
    specifications: { Type: 'Cloud Platform', Platform: 'Web / Backend', Support: 'Docker, Node, Python', License: 'Proprietary Service', Description: 'Render is a unified cloud to build and run all your apps and websites with free TLS certificates, a global CDN, DDoS protection, private networks, and auto deploys from Git.', PrimaryUseCase: 'Deploying full-stack applications, databases, and cron jobs effortlessly.', Ecosystem: 'PostgreSQL, Redis, Web Services', FreeTier: 'Individual (Static Sites, Free Web Services spin down)', ProTier: 'Team $19/mo (Scale memory/CPU as needed)', EnterpriseTier: 'Organization (SSO, Role-based access)' },
    scores: { Versatility: 95, Usability: 96, Value: 98 },
    prices: { official: { price: 'Freemium', link: 'https://render.com/' } }
  },
  { id: 458, title: 'Heroku', subtitle: 'Cloud application platform', category: 'TOOLS', isNew: false, features: { Type: 'Deployment', Subscription: 'Paid' },
    specifications: { Type: 'Platform as a Service', Platform: 'Backend', Support: 'Polyglot', License: 'Proprietary Service', Description: 'A platform as a service (PaaS) that enables developers to build, run, and operate applications entirely in the cloud.', PrimaryUseCase: 'Simple container-based application hosting (Dynos).', Ecosystem: 'Salesforce, Node, Ruby, Postgres', FreeTier: 'No longer available. Starts at Eco ($5)', ProTier: 'Standard Dynos ($25-$50/mo)', EnterpriseTier: 'Private Spaces (Network isolation, compliance)' },
    scores: { Ecosystem: 99, Reliability: 95, Pricing: 70 },
    prices: { official: { price: 'Paid Plans', link: 'https://www.heroku.com/' } }
  },
  { id: 459, title: 'AWS Amplify', subtitle: 'Build extensible, full-stack web and mobile apps', category: 'TOOLS', isNew: false, features: { Type: 'Deployment', Subscription: 'Pay-as-you-go' },
    specifications: { Type: 'Cloud Platform', Platform: 'Web / Mobile', Support: 'AWS Cloud', License: 'Proprietary Service', Description: 'A set of purpose-built tools and features that lets frontend web and mobile developers quickly and easily build full-stack applications on AWS.', PrimaryUseCase: 'Seamless integration of frontend code with AWS backend services (Auth, Storage, APIs).', Ecosystem: 'AWS ecosystem, React Native, Vue', FreeTier: 'Free tier limits for 12 months (1000 build mins, 15GB bandwidth)', ProTier: 'Pay-as-you-go ($0.01/build min, $0.15/GB)', EnterpriseTier: 'Part of AWS compliance, massive scale' },
    scores: { Scalability: 100, Features: 96, Complexity: 85 },
    prices: { official: { price: 'Pay-as-you-go', link: 'https://aws.amazon.com/amplify/' } }
  }"""
]

# We want to string replace `// Memory (RAM)` with the deployment tools and `// Memory (RAM)`
new_text = text.replace('  // Memory (RAM)', deployment_tools[0] + ',\n\n  // Memory (RAM)')

with open('generate_data.js', 'w', encoding='utf-8') as f:
    f.write(new_text)

print(f"Added deployment tools successfully.")
