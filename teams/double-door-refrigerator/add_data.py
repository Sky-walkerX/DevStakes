import re

with open('generate_data.js', 'r', encoding='utf-8') as f:
    text = f.read()

new_tools = [
"""  { id: 409, title: 'Git', subtitle: 'Distributed version control system', category: 'TOOLS', isNew: false, features: { Type: 'VCS', License: 'GPL-2.0' },
    specifications: { Type: 'Version Control', Platform: 'Cross-platform', Language: 'C', Support: 'Git', License: 'Open Source (GPL-2.0)' },
    scores: { Reliability: 100, Speed: 98, EaseOfUse: 85 },
    prices: { amazon: { price: 'Free', link: 'https://git-scm.com/' }, flipkart: { price: 'Free', link: 'https://git-scm.com/' }, official: { price: 'Free', link: 'https://git-scm.com/' } }
  },
  { id: 410, title: 'Apache Subversion (SVN)', subtitle: 'Centralized version control', category: 'TOOLS', isNew: false, features: { Type: 'VCS', License: 'Apache-2.0' },
    specifications: { Type: 'Version Control', Platform: 'Cross-platform', Language: 'C', Support: 'SVN', License: 'Open Source (Apache-2.0)' },
    scores: { Reliability: 95, Speed: 80, EaseOfUse: 90 },
    prices: { amazon: { price: 'Free', link: 'https://subversion.apache.org/' }, flipkart: { price: 'Free', link: 'https://subversion.apache.org/' }, official: { price: 'Free', link: 'https://subversion.apache.org/' } }
  },
  { id: 411, title: 'Mercurial', subtitle: 'Distributed version control', category: 'TOOLS', isNew: false, features: { Type: 'VCS', License: 'GPL-2.0' },
    specifications: { Type: 'Version Control', Platform: 'Cross-platform', Language: 'Python', Support: 'Mercurial', License: 'Open Source (GPL-2.0)' },
    scores: { Reliability: 98, Speed: 90, EaseOfUse: 92 },
    prices: { amazon: { price: 'Free', link: 'https://www.mercurial-scm.org/' }, flipkart: { price: 'Free', link: 'https://www.mercurial-scm.org/' }, official: { price: 'Free', link: 'https://www.mercurial-scm.org/' } }
  },
  { id: 412, title: 'VSCodium', subtitle: 'Telemetry-free VS Code binary', category: 'TOOLS', isNew: false, features: { Type: 'IDE', License: 'MIT' },
    specifications: { Type: 'Code Editor', Platform: 'Cross-platform', Engine: 'Electron', Support: 'Multiple', License: 'Open Source (MIT)' },
    scores: { Extensibility: 98, Performance: 90, Privacy: 100 },
    prices: { amazon: { price: 'Free', link: 'https://vscodium.com/' }, flipkart: { price: 'Free', link: 'https://vscodium.com/' }, official: { price: 'Free', link: 'https://vscodium.com/' } }
  },
  { id: 413, title: 'Eclipse IDE', subtitle: 'Extensible development platform', category: 'TOOLS', isNew: false, features: { Type: 'IDE', License: 'EPL-2.0' },
    specifications: { Type: 'IDE', Platform: 'Cross-platform', Language: 'Java', Support: 'Multiple', License: 'Open Source (EPL-2.0)' },
    scores: { Extensibility: 95, Performance: 80, Maturity: 99 },
    prices: { amazon: { price: 'Free', link: 'https://www.eclipse.org/' }, flipkart: { price: 'Free', link: 'https://www.eclipse.org/' }, official: { price: 'Free', link: 'https://www.eclipse.org/' } }
  },
  { id: 414, title: 'IntelliJ IDEA Community', subtitle: 'Capable Java IDE', category: 'TOOLS', isNew: false, features: { Type: 'IDE', License: 'Apache-2.0' },
    specifications: { Type: 'IDE', Platform: 'Cross-platform', Language: 'Java', Support: 'Java, Kotlin', License: 'Open Source (Apache-2.0)' },
    scores: { Features: 96, Performance: 88, EaseOfUse: 92 },
    prices: { amazon: { price: 'Free', link: 'https://www.jetbrains.com/idea/' }, flipkart: { price: 'Free', link: 'https://www.jetbrains.com/idea/' }, official: { price: 'Free', link: 'https://www.jetbrains.com/idea/' } }
  },
  { id: 415, title: 'Apache Maven', subtitle: 'Software comprehension tool', category: 'TOOLS', isNew: false, features: { Type: 'Build Tool', License: 'Apache-2.0' },
    specifications: { Type: 'Build Tool', Platform: 'Cross-platform', Language: 'Java', Support: 'POM based', License: 'Open Source (Apache-2.0)' },
    scores: { Reliability: 99, Features: 90, Ecosystem: 98 },
    prices: { amazon: { price: 'Free', link: 'https://maven.apache.org/' }, flipkart: { price: 'Free', link: 'https://maven.apache.org/' }, official: { price: 'Free', link: 'https://maven.apache.org/' } }
  },
  { id: 416, title: 'Gradle', subtitle: 'Accelerates developer productivity', category: 'TOOLS', isNew: false, features: { Type: 'Build Tool', License: 'Apache-2.0' },
    specifications: { Type: 'Build Tool', Platform: 'Cross-platform', Language: 'Java/Kotlin', Support: 'DSL', License: 'Open Source (Apache-2.0)' },
    scores: { Performance: 95, Flexibility: 98, Ecosystem: 92 },
    prices: { amazon: { price: 'Free', link: 'https://gradle.org/' }, flipkart: { price: 'Free', link: 'https://gradle.org/' }, official: { price: 'Free', link: 'https://gradle.org/' } }
  },
  { id: 417, title: 'Apache Ant', subtitle: 'Java based build tool', category: 'TOOLS', isNew: false, features: { Type: 'Build Tool', License: 'Apache-2.0' },
    specifications: { Type: 'Build Tool', Platform: 'Cross-platform', Language: 'Java', Support: 'XML based', License: 'Open Source (Apache-2.0)' },
    scores: { Dependability: 99, Speed: 90, Flexibility: 85 },
    prices: { amazon: { price: 'Free', link: 'https://ant.apache.org/' }, flipkart: { price: 'Free', link: 'https://ant.apache.org/' }, official: { price: 'Free', link: 'https://ant.apache.org/' } }
  },
  { id: 418, title: 'Jenkins', subtitle: 'Leading open source automation server', category: 'TOOLS', isNew: false, features: { Type: 'CI/CD', License: 'MIT' },
    specifications: { Type: 'CI/CD Server', Platform: 'Cross-platform', Language: 'Java', Plugins: '1800+', License: 'Open Source (MIT)' },
    scores: { Extensibility: 100, Ecosystem: 99, EaseOfSetup: 80 },
    prices: { amazon: { price: 'Free', link: 'https://www.jenkins.io/' }, flipkart: { price: 'Free', link: 'https://www.jenkins.io/' }, official: { price: 'Free', link: 'https://www.jenkins.io/' } }
  },
  { id: 419, title: 'GitLab CI/CD', subtitle: 'Integrated CI/CD platform', category: 'TOOLS', isNew: false, features: { Type: 'CI/CD', License: 'MIT' },
    specifications: { Type: 'CI/CD', Platform: 'Cross-platform', Integrated: 'GitLab', Runners: 'Go based', License: 'Open Source (MIT)' },
    scores: { Integration: 99, Features: 95, EaseOfUse: 92 },
    prices: { amazon: { price: 'Free', link: 'https://about.gitlab.com/' }, flipkart: { price: 'Free', link: 'https://about.gitlab.com/' }, official: { price: 'Free', link: 'https://docs.gitlab.com/ee/ci/' } }
  },
  { id: 420, title: 'Tekton', subtitle: 'Cloud-native CI/CD framework', category: 'TOOLS', isNew: false, features: { Type: 'CI/CD', License: 'Apache-2.0' },
    specifications: { Type: 'CI/CD', Platform: 'Kubernetes', Language: 'Go', Ecosystem: 'CD Foundation', License: 'Open Source (Apache-2.0)' },
    scores: { Flexibility: 95, Scalability: 98, Ecosystem: 88 },
    prices: { amazon: { price: 'Free', link: 'https://tekton.dev/' }, flipkart: { price: 'Free', link: 'https://tekton.dev/' }, official: { price: 'Free', link: 'https://tekton.dev/' } }
  },
  { id: 421, title: 'Docker Engine', subtitle: 'Industry standard container runtime', category: 'TOOLS', isNew: false, features: { Type: 'Containerization', License: 'Apache-2.0' },
    specifications: { Type: 'Container Runtime', Platform: 'Linux/Mac/Win', Core: 'containerd', Interface: 'CLI', License: 'Open Source (Apache-2.0)' },
    scores: { Ecosystem: 100, Usability: 95, Reliability: 99 },
    prices: { amazon: { price: 'Free', link: 'https://www.docker.com/' }, flipkart: { price: 'Free', link: 'https://www.docker.com/' }, official: { price: 'Free', link: 'https://github.com/docker/engine' } }
  },
  { id: 422, title: 'Podman', subtitle: 'Daemonless container engine', category: 'TOOLS', isNew: true, features: { Type: 'Containerization', License: 'Apache-2.0' },
    specifications: { Type: 'Container Runtime', Platform: 'Linux/Mac/Win', Architecture: 'Daemonless', Rootless: 'Yes', License: 'Open Source (Apache-2.0)' },
    scores: { Security: 98, Compatibility: 96, Architecture: 95 },
    prices: { amazon: { price: 'Free', link: 'https://podman.io/' }, flipkart: { price: 'Free', link: 'https://podman.io/' }, official: { price: 'Free', link: 'https://podman.io/' } }
  },
  { id: 423, title: 'containerd', subtitle: 'Standard container runtime', category: 'TOOLS', isNew: false, features: { Type: 'Containerization', License: 'Apache-2.0' },
    specifications: { Type: 'Container Runtime', Platform: 'Linux/Win', Ecosystem: 'CNCF', Focus: 'Simplicity', License: 'Open Source (Apache-2.0)' },
    scores: { Performance: 99, Reliability: 99, Ecosystem: 96 },
    prices: { amazon: { price: 'Free', link: 'https://containerd.io/' }, flipkart: { price: 'Free', link: 'https://containerd.io/' }, official: { price: 'Free', link: 'https://containerd.io/' } }
  },
  { id: 424, title: 'Kubernetes', subtitle: 'Container orchestration system', category: 'TOOLS', isNew: false, features: { Type: 'Orchestration', License: 'Apache-2.0' },
    specifications: { Type: 'Orchestration', Platform: 'Linux', Ecosystem: 'CNCF', Scaling: 'Automated', License: 'Open Source (Apache-2.0)' },
    scores: { Scalability: 100, Ecosystem: 100, Complexity: 85 },
    prices: { amazon: { price: 'Free', link: 'https://kubernetes.io/' }, flipkart: { price: 'Free', link: 'https://kubernetes.io/' }, official: { price: 'Free', link: 'https://kubernetes.io/' } }
  },
  { id: 425, title: 'Docker Swarm', subtitle: 'Native clustering for Docker', category: 'TOOLS', isNew: false, features: { Type: 'Orchestration', License: 'Apache-2.0' },
    specifications: { Type: 'Orchestration', Platform: 'Cross-platform', Integration: 'Docker CLI', Setup: 'Simple', License: 'Open Source (Apache-2.0)' },
    scores: { Usability: 96, Simplicity: 98, Scalability: 88 },
    prices: { amazon: { price: 'Free', link: 'https://docs.docker.com/engine/swarm/' }, flipkart: { price: 'Free', link: 'https://docs.docker.com/engine/swarm/' }, official: { price: 'Free', link: 'https://docs.docker.com/engine/swarm/' } }
  },
  { id: 426, title: 'Nomad', subtitle: 'Simple/flexible workload orchestrator', category: 'TOOLS', isNew: false, features: { Type: 'Orchestration', License: 'BUSL/MPL' },
    specifications: { Type: 'Orchestration', Platform: 'Cross-platform', Vendor: 'HashiCorp', Workloads: 'Containers, VMs, Binaries', License: 'Open Source/BUSL' },
    scores: { Flexibility: 97, Simplicity: 94, Performance: 95 },
    prices: { amazon: { price: 'Free', link: 'https://www.nomadproject.io/' }, flipkart: { price: 'Free', link: 'https://www.nomadproject.io/' }, official: { price: 'Free', link: 'https://www.nomadproject.io/' } }
  },
  { id: 427, title: 'Ansible', subtitle: 'Simple IT automation', category: 'TOOLS', isNew: false, features: { Type: 'Config Mgmt', License: 'GPL-3.0' },
    specifications: { Type: 'Automation', Platform: 'Cross-platform', Language: 'Python/YAML', Architecture: 'Agentless', License: 'Open Source (GPL-3.0)' },
    scores: { Usability: 98, Adoption: 99, Extensibility: 96 },
    prices: { amazon: { price: 'Free', link: 'https://www.ansible.com/' }, flipkart: { price: 'Free', link: 'https://www.ansible.com/' }, official: { price: 'Free', link: 'https://www.ansible.com/' } }
  },
  { id: 428, title: 'Puppet', subtitle: 'Infrastructure delivery tooling', category: 'TOOLS', isNew: false, features: { Type: 'Config Mgmt', License: 'Apache-2.0' },
    specifications: { Type: 'Automation', Platform: 'Cross-platform', Language: 'Ruby/DSL', Architecture: 'Agent-based', License: 'Open Source (Apache-2.0)' },
    scores: { Scalability: 97, Reliability: 95, Usability: 85 },
    prices: { amazon: { price: 'Free', link: 'https://puppet.com/' }, flipkart: { price: 'Free', link: 'https://puppet.com/' }, official: { price: 'Free', link: 'https://puppet.com/' } }
  },
  { id: 429, title: 'Chef', subtitle: 'Infrastructure as code', category: 'TOOLS', isNew: false, features: { Type: 'Config Mgmt', License: 'Apache-2.0' },
    specifications: { Type: 'Automation', Platform: 'Cross-platform', Language: 'Ruby', Architecture: 'Agent-based', License: 'Open Source (Apache-2.0)' },
    scores: { Flexibility: 95, Extensibility: 96, Usability: 82 },
    prices: { amazon: { price: 'Free', link: 'https://www.chef.io/' }, flipkart: { price: 'Free', link: 'https://www.chef.io/' }, official: { price: 'Free', link: 'https://www.chef.io/' } }
  },
  { id: 430, title: 'Redmine', subtitle: 'Flexible project management web app', category: 'TOOLS', isNew: false, features: { Type: 'Project Mgmt', License: 'GPL-2.0' },
    specifications: { Type: 'Issue Tracker', Platform: 'Web', Language: 'Ruby on Rails', Plugins: 'Extensive', License: 'Open Source (GPL-2.0)' },
    scores: { Features: 94, Flexibility: 95, ModernUI: 70 },
    prices: { amazon: { price: 'Free', link: 'https://www.redmine.org/' }, flipkart: { price: 'Free', link: 'https://www.redmine.org/' }, official: { price: 'Free', link: 'https://www.redmine.org/' } }
  },
  { id: 431, title: 'Bugzilla', subtitle: 'Robust defect tracking system', category: 'TOOLS', isNew: false, features: { Type: 'Project Mgmt', License: 'MPL' },
    specifications: { Type: 'Issue Tracker', Platform: 'Web', Language: 'Perl', UseCase: 'Large Projects', License: 'Open Source (MPL)' },
    scores: { Capability: 98, Speed: 90, ModernUI: 60 },
    prices: { amazon: { price: 'Free', link: 'https://www.bugzilla.org/' }, flipkart: { price: 'Free', link: 'https://www.bugzilla.org/' }, official: { price: 'Free', link: 'https://www.bugzilla.org/' } }
  },
  { id: 432, title: 'Taiga', subtitle: 'Agile project management platform', category: 'TOOLS', isNew: false, features: { Type: 'Project Mgmt', License: 'AGPL-3.0' },
    specifications: { Type: 'Issue Tracker', Platform: 'Web', Language: 'Python/Django', Framework: 'Scrum/Kanban', License: 'Open Source (AGPL-3.0)' },
    scores: { Usability: 96, Aesthetics: 95, Features: 90 },
    prices: { amazon: { price: 'Free', link: 'https://taiga.io/' }, flipkart: { price: 'Free', link: 'https://taiga.io/' }, official: { price: 'Free', link: 'https://taiga.io/' } }
  },
  { id: 433, title: 'SonarQube (Community)', subtitle: 'Code quality and security', category: 'TOOLS', isNew: false, features: { Type: 'Code Quality', License: 'LGPL-3.0' },
    specifications: { Type: 'Static Analysis', Platform: 'Web', Support: '15+ Languages', UseCase: 'CI/CD Integration', License: 'Open Source (LGPL-3.0)' },
    scores: { Analysis: 98, Ecosystem: 96, Usability: 92 },
    prices: { amazon: { price: 'Free', link: 'https://www.sonarsource.com/products/sonarqube/' }, flipkart: { price: 'Free', link: 'https://www.sonarsource.com/products/sonarqube/' }, official: { price: 'Free', link: 'https://www.sonarqube.org/' } }
  },
  { id: 434, title: 'ESLint', subtitle: 'Pluggable JavaScript linter', category: 'TOOLS', isNew: false, features: { Type: 'Code Quality', License: 'MIT' },
    specifications: { Type: 'Linter', Platform: 'Node.js', Language: 'JS/TS', Customization: 'High', License: 'Open Source (MIT)' },
    scores: { Usability: 99, Ecosystem: 100, Speed: 95 },
    prices: { amazon: { price: 'Free', link: 'https://eslint.org/' }, flipkart: { price: 'Free', link: 'https://eslint.org/' }, official: { price: 'Free', link: 'https://eslint.org/' } }
  },
  { id: 435, title: 'Prettier', subtitle: 'Opinionated code formatter', category: 'TOOLS', isNew: false, features: { Type: 'Code Quality', License: 'MIT' },
    specifications: { Type: 'Formatter', Platform: 'Node.js', Language: 'Multiple', Ecosystem: 'IDE Plug-ins', License: 'Open Source (MIT)' },
    scores: { Speed: 98, Consistency: 100, Adoption: 99 },
    prices: { amazon: { price: 'Free', link: 'https://prettier.io/' }, flipkart: { price: 'Free', link: 'https://prettier.io/' }, official: { price: 'Free', link: 'https://prettier.io/' } }
  },
  { id: 436, title: 'Selenium', subtitle: 'Browser automation framework', category: 'TOOLS', isNew: false, features: { Type: 'Testing', License: 'Apache-2.0' },
    specifications: { Type: 'Testing Web', Platform: 'Cross-platform', Language: 'Multiple', Support: 'All major browsers', License: 'Open Source (Apache-2.0)' },
    scores: { Capability: 99, Ecosystem: 100, Speed: 80 },
    prices: { amazon: { price: 'Free', link: 'https://www.selenium.dev/' }, flipkart: { price: 'Free', link: 'https://www.selenium.dev/' }, official: { price: 'Free', link: 'https://www.selenium.dev/' } }
  },
  { id: 437, title: 'Cypress', subtitle: 'Next generation front end testing tool', category: 'TOOLS', isNew: false, features: { Type: 'Testing', License: 'MIT' },
    specifications: { Type: 'Testing Web', Platform: 'Cross-platform', Language: 'JavaScript', Focus: 'E2E Testing', License: 'Open Source (MIT)' },
    scores: { Usability: 98, Speed: 95, Features: 94 },
    prices: { amazon: { price: 'Free', link: 'https://www.cypress.io/' }, flipkart: { price: 'Free', link: 'https://www.cypress.io/' }, official: { price: 'Free', link: 'https://www.cypress.io/' } }
  },
  { id: 438, title: 'JUnit', subtitle: 'Testing framework for Java', category: 'TOOLS', isNew: false, features: { Type: 'Testing', License: 'EPL-2.0' },
    specifications: { Type: 'Unit Testing', Platform: 'Java', Architecture: 'JUnit 5 Platform', UseCase: 'TDD', License: 'Open Source (EPL-2.0)' },
    scores: { Ecosystem: 100, Stability: 99, Extensibility: 95 },
    prices: { amazon: { price: 'Free', link: 'https://junit.org/' }, flipkart: { price: 'Free', link: 'https://junit.org/' }, official: { price: 'Free', link: 'https://junit.org/' } }
  },
  { id: 439, title: 'PostgreSQL', subtitle: 'Advanced open source relational DB', category: 'TOOLS', isNew: false, features: { Type: 'Database', License: 'PostgreSQL' },
    specifications: { Type: 'RDBMS', Platform: 'Cross-platform', Language: 'C', ACID: 'Yes', License: 'Open Source (PostgreSQL License)' },
    scores: { Reliability: 100, Features: 99, Performance: 95 },
    prices: { amazon: { price: 'Free', link: 'https://www.postgresql.org/' }, flipkart: { price: 'Free', link: 'https://www.postgresql.org/' }, official: { price: 'Free', link: 'https://www.postgresql.org/' } }
  },
  { id: 440, title: 'MySQL', subtitle: 'Most popular open source DB', category: 'TOOLS', isNew: false, features: { Type: 'Database', License: 'GPL-2.0' },
    specifications: { Type: 'RDBMS', Platform: 'Cross-platform', Language: 'C/C++', Performance: 'High', License: 'Open Source (GPL-2.0)' },
    scores: { Scalability: 96, Adoption: 100, Usability: 92 },
    prices: { amazon: { price: 'Free', link: 'https://www.mysql.com/' }, flipkart: { price: 'Free', link: 'https://www.mysql.com/' }, official: { price: 'Free', link: 'https://www.mysql.com/' } }
  },
  { id: 441, title: 'MariaDB', subtitle: 'Community-developed fork of MySQL', category: 'TOOLS', isNew: false, features: { Type: 'Database', License: 'GPL-2.0' },
    specifications: { Type: 'RDBMS', Platform: 'Cross-platform', Language: 'C/C++', StorageEngines: 'Pluggable', License: 'Open Source (GPL-2.0)' },
    scores: { Innovation: 95, Performance: 97, Compatibility: 98 },
    prices: { amazon: { price: 'Free', link: 'https://mariadb.org/' }, flipkart: { price: 'Free', link: 'https://mariadb.org/' }, official: { price: 'Free', link: 'https://mariadb.org/' } }
  },
  { id: 442, title: 'Hoppscotch', subtitle: 'Open source API development ecosystem', category: 'TOOLS', isNew: true, features: { Type: 'API Tool', License: 'MIT' },
    specifications: { Type: 'API Client', Platform: 'Web/PWA', Architecture: 'Vue.js', Identity: 'Postman Alternative', License: 'Open Source (MIT)' },
    scores: { Usability: 98, Speed: 99, Features: 92 },
    prices: { amazon: { price: 'Free', link: 'https://hoppscotch.io/' }, flipkart: { price: 'Free', link: 'https://hoppscotch.io/' }, official: { price: 'Free', link: 'https://hoppscotch.io/' } }
  },
  { id: 443, title: 'Insomnia', subtitle: 'API platform for GraphQL/REST/gRPC', category: 'TOOLS', isNew: false, features: { Type: 'API Tool', License: 'MIT' },
    specifications: { Type: 'API Client', Platform: 'Cross-platform', Support: 'GraphQL, REST', Extensibility: 'Plugins', License: 'Open Source (MIT)' },
    scores: { Aesthetics: 96, Features: 95, Adoption: 90 },
    prices: { amazon: { price: 'Free', link: 'https://insomnia.rest/' }, flipkart: { price: 'Free', link: 'https://insomnia.rest/' }, official: { price: 'Free', link: 'https://insomnia.rest/' } }
  },
  { id: 444, title: 'Bruno', subtitle: 'Open-source IDE for exploring APIs', category: 'TOOLS', isNew: true, features: { Type: 'API Tool', License: 'MIT' },
    specifications: { Type: 'API Client', Platform: 'Cross-platform', Storage: 'Local Plain Text', Identity: 'Postman Alternative', License: 'Open Source (MIT)' },
    scores: { Privacy: 100, Usability: 94, Speed: 96 },
    prices: { amazon: { price: 'Free', link: 'https://www.usebruno.com/' }, flipkart: { price: 'Free', link: 'https://www.usebruno.com/' }, official: { price: 'Free', link: 'https://www.usebruno.com/' } }
  },
  { id: 445, title: 'Prometheus', subtitle: 'Monitoring system & time series DB', category: 'TOOLS', isNew: false, features: { Type: 'Monitoring', License: 'Apache-2.0' },
    specifications: { Type: 'Monitoring', Platform: 'Linux', Ecosystem: 'CNCF', QueryLanguage: 'PromQL', License: 'Open Source (Apache-2.0)' },
    scores: { Scalability: 98, Features: 99, EaseOfSetup: 85 },
    prices: { amazon: { price: 'Free', link: 'https://prometheus.io/' }, flipkart: { price: 'Free', link: 'https://prometheus.io/' }, official: { price: 'Free', link: 'https://prometheus.io/' } }
  },
  { id: 446, title: 'Grafana', subtitle: 'The open observability platform', category: 'TOOLS', isNew: false, features: { Type: 'Monitoring', License: 'AGPL-3.0' },
    specifications: { Type: 'Dashboarding', Platform: 'Cross-platform', Integration: 'Prometheus, TSDBs', Visuals: 'Extensive', License: 'Open Source (AGPL-3.0)' },
    scores: { Visualization: 100, Usability: 96, Ecosystem: 99 },
    prices: { amazon: { price: 'Free', link: 'https://grafana.com/' }, flipkart: { price: 'Free', link: 'https://grafana.com/' }, official: { price: 'Free', link: 'https://grafana.com/' } }
  },
  { id: 447, title: 'Zabbix', subtitle: 'Enterprise-class monitoring solution', category: 'TOOLS', isNew: false, features: { Type: 'Monitoring', License: 'GPL-2.0' },
    specifications: { Type: 'Monitoring', Platform: 'Cross-platform', Scalability: 'Enterprise', Agents: 'Available', License: 'Open Source (GPL-2.0)' },
    scores: { Capability: 97, Scalability: 96, ModernUI: 80 },
    prices: { amazon: { price: 'Free', link: 'https://www.zabbix.com/' }, flipkart: { price: 'Free', link: 'https://www.zabbix.com/' }, official: { price: 'Free', link: 'https://www.zabbix.com/' } }
  },
  { id: 448, title: 'Elasticsearch', subtitle: 'Distributed, RESTful search/analytics engine', category: 'TOOLS', isNew: false, features: { Type: 'Log Mgmt', License: 'Elastic/SSPL' },
    specifications: { Type: 'Search Engine', Platform: 'Cross-platform', Base: 'Apache Lucene', Ecosystem: 'ELK Stack', License: 'Open Source / Business' },
    scores: { Speed: 99, Scalability: 98, Features: 97 },
    prices: { amazon: { price: 'Free', link: 'https://www.elastic.co/' }, flipkart: { price: 'Free', link: 'https://www.elastic.co/' }, official: { price: 'Free', link: 'https://www.elastic.co/' } }
  },
  { id: 449, title: 'Logstash', subtitle: 'Server-side data processing pipeline', category: 'TOOLS', isNew: false, features: { Type: 'Log Mgmt', License: 'Elastic/SSPL' },
    specifications: { Type: 'Data Pipeline', Platform: 'Cross-platform', Input/Output: 'Versatile', Ecosystem: 'ELK Stack', License: 'Open Source / Business' },
    scores: { Capability: 96, Flexibility: 98, Performance: 88 },
    prices: { amazon: { price: 'Free', link: 'https://www.elastic.co/logstash' }, flipkart: { price: 'Free', link: 'https://www.elastic.co/logstash' }, official: { price: 'Free', link: 'https://www.elastic.co/logstash' } }
  },
  { id: 450, title: 'Fluentd', subtitle: 'Data collector for unified logging layer', category: 'TOOLS', isNew: false, features: { Type: 'Log Mgmt', License: 'Apache-2.0' },
    specifications: { Type: 'Data Pipeline', Platform: 'Cross-platform', Language: 'Ruby/C', Ecosystem: 'CNCF', License: 'Open Source (Apache-2.0)' },
    scores: { Reliability: 98, Adaptability: 97, ResourceUsage: 90 },
    prices: { amazon: { price: 'Free', link: 'https://www.fluentd.org/' }, flipkart: { price: 'Free', link: 'https://www.fluentd.org/' }, official: { price: 'Free', link: 'https://www.fluentd.org/' } }
  },
  { id: 451, title: 'Gitea', subtitle: 'Painless self-hosted Git service', category: 'TOOLS', isNew: false, features: { Type: 'Code Hosting', License: 'MIT' },
    specifications: { Type: 'Forge', Platform: 'Cross-platform', Language: 'Go', Focus: 'Lightweight', License: 'Open Source (MIT)' },
    scores: { Performance: 99, Simplicity: 96, Features: 88 },
    prices: { amazon: { price: 'Free', link: 'https://gitea.io/' }, flipkart: { price: 'Free', link: 'https://gitea.io/' }, official: { price: 'Free', link: 'https://gitea.io/' } }
  },
  { id: 452, title: 'GitLab CE', subtitle: 'Complete DevOps platform', category: 'TOOLS', isNew: false, features: { Type: 'Code Hosting', License: 'MIT' },
    specifications: { Type: 'Forge', Platform: 'Linux', Ecosystem: 'All-in-one', Scale: 'Enterprise', License: 'Open Source (MIT)' },
    scores: { Features: 100, Scalability: 95, ResourceUsage: 75 },
    prices: { amazon: { price: 'Free', link: 'https://about.gitlab.com/' }, flipkart: { price: 'Free', link: 'https://about.gitlab.com/' }, official: { price: 'Free', link: 'https://about.gitlab.com/install/' } }
  },
  { id: 453, title: 'Nginx', subtitle: 'High performance web server & reverse proxy', category: 'TOOLS', isNew: false, features: { Type: 'Web Server', License: 'BSD-2-Clause' },
    specifications: { Type: 'Web Server', Platform: 'Cross-platform', Architecture: 'Event-driven', Capability: 'Load Balancer', License: 'Open Source (BSD-2-Clause)' },
    scores: { Performance: 100, Reliability: 99, Concurrency: 100 },
    prices: { amazon: { price: 'Free', link: 'https://nginx.org/' }, flipkart: { price: 'Free', link: 'https://nginx.org/' }, official: { price: 'Free', link: 'https://nginx.org/' } }
  },
  { id: 454, title: 'Apache HTTP Server', subtitle: 'Most popular web server', category: 'TOOLS', isNew: false, features: { Type: 'Web Server', License: 'Apache-2.0' },
    specifications: { Type: 'Web Server', Platform: 'Cross-platform', Architecture: 'Process/Thread based', Modules: 'Extensive', License: 'Open Source (Apache-2.0)' },
    scores: { Features: 98, Ecosystem: 100, Configurable: 96 },
    prices: { amazon: { price: 'Free', link: 'https://httpd.apache.org/' }, flipkart: { price: 'Free', link: 'https://httpd.apache.org/' }, official: { price: 'Free', link: 'https://httpd.apache.org/' } }
  }"""
]

# We want to string replace `// Memory (RAM)` with the new tools and `// Memory (RAM)`
new_text = text.replace('// Memory (RAM)', new_tools[0] + ',\n\n  // Memory (RAM)')

with open('generate_data.js', 'w', encoding='utf-8') as f:
    f.write(new_text)

print(f"Added {new_tools[0].count('{ id:')} new tools.")
