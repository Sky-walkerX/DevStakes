import re

with open('generate_data.js', 'r', encoding='utf-8') as f:
    text = f.read()

# First, remove the previously inserted tools (ID 409 to 454) if they exist.
# A simple way is to find the index of "id: 409" and cut until "// Memory (RAM)"
start_idx = text.find('  { id: 409,')
if start_idx != -1:
    end_idx = text.find('// Memory (RAM)')
    text = text[:start_idx] + '  // Memory (RAM)' + text[end_idx+15:]

new_tools = [
"""  { id: 409, title: 'Git', subtitle: 'Distributed version control system', category: 'TOOLS', isNew: false, features: { Type: 'VCS', License: 'GPL-2.0' },
    specifications: { Type: 'Version Control', Platform: 'Cross-platform', Language: 'C', Support: 'Git', License: 'Open Source (GPL-2.0)', Description: 'The most widely used modern version control system in the world.', PrimaryUseCase: 'Source code management, non-linear workflows.', Ecosystem: 'GitHub, GitLab, Bitbucket' },
    scores: { Reliability: 100, Speed: 98, EaseOfUse: 85 },
    prices: { amazon: { price: 'Free', link: 'https://git-scm.com/' }, flipkart: { price: 'Free', link: 'https://git-scm.com/' }, official: { price: 'Free', link: 'https://git-scm.com/' } }
  },
  { id: 410, title: 'Apache Subversion (SVN)', subtitle: 'Centralized version control', category: 'TOOLS', isNew: false, features: { Type: 'VCS', License: 'Apache-2.0' },
    specifications: { Type: 'Version Control', Platform: 'Cross-platform', Language: 'C', Support: 'SVN', License: 'Open Source (Apache-2.0)', Description: 'Centralized revision control system meant to be a better CVS.', PrimaryUseCase: 'Legacy enterprise version control, large binary files.', Ecosystem: 'TortoiseSVN' },
    scores: { Reliability: 95, Speed: 80, EaseOfUse: 90 },
    prices: { amazon: { price: 'Free', link: 'https://subversion.apache.org/' }, flipkart: { price: 'Free', link: 'https://subversion.apache.org/' }, official: { price: 'Free', link: 'https://subversion.apache.org/' } }
  },
  { id: 411, title: 'Mercurial', subtitle: 'Distributed version control', category: 'TOOLS', isNew: false, features: { Type: 'VCS', License: 'GPL-2.0' },
    specifications: { Type: 'Version Control', Platform: 'Cross-platform', Language: 'Python', Support: 'Mercurial', License: 'Open Source (GPL-2.0)', Description: 'Free, distributed source control management tool known for its performance and scale.', PrimaryUseCase: 'Handling large projects elegantly.', Ecosystem: 'RhodeCode, Phabricator' },
    scores: { Reliability: 98, Speed: 90, EaseOfUse: 92 },
    prices: { amazon: { price: 'Free', link: 'https://www.mercurial-scm.org/' }, flipkart: { price: 'Free', link: 'https://www.mercurial-scm.org/' }, official: { price: 'Free', link: 'https://www.mercurial-scm.org/' } }
  },
  { id: 412, title: 'VSCodium', subtitle: 'Telemetry-free VS Code binary', category: 'TOOLS', isNew: false, features: { Type: 'IDE', License: 'MIT' },
    specifications: { Type: 'Code Editor', Platform: 'Cross-platform', Engine: 'Electron', Support: 'Multiple', License: 'Open Source (MIT)', Description: 'Community-driven, freely-licensed binary distribution of Microsoft VS Code without telemetry.', PrimaryUseCase: 'General purpose code editing.', Ecosystem: 'OpenVSX Registry' },
    scores: { Extensibility: 98, Performance: 90, Privacy: 100 },
    prices: { amazon: { price: 'Free', link: 'https://vscodium.com/' }, flipkart: { price: 'Free', link: 'https://vscodium.com/' }, official: { price: 'Free', link: 'https://vscodium.com/' } }
  },
  { id: 413, title: 'Eclipse IDE', subtitle: 'Extensible development platform', category: 'TOOLS', isNew: false, features: { Type: 'IDE', License: 'EPL-2.0' },
    specifications: { Type: 'IDE', Platform: 'Cross-platform', Language: 'Java', Support: 'Multiple', License: 'Open Source (EPL-2.0)', Description: 'Famous for Java IDE, but C/C++ and PHP IDEs are also heavily used.', PrimaryUseCase: 'Enterprise Java development.', Ecosystem: 'Eclipse Marketplace' },
    scores: { Extensibility: 95, Performance: 80, Maturity: 99 },
    prices: { amazon: { price: 'Free', link: 'https://www.eclipse.org/' }, flipkart: { price: 'Free', link: 'https://www.eclipse.org/' }, official: { price: 'Free', link: 'https://www.eclipse.org/' } }
  },
  { id: 414, title: 'IntelliJ IDEA Community', subtitle: 'Capable Java IDE', category: 'TOOLS', isNew: false, features: { Type: 'IDE', License: 'Apache-2.0' },
    specifications: { Type: 'IDE', Platform: 'Cross-platform', Language: 'Java', Support: 'Java, Kotlin', License: 'Open Source (Apache-2.0)', Description: 'The smartest JVM IDE by JetBrains, community edition.', PrimaryUseCase: 'JVM-based application development.', Ecosystem: 'JetBrains Marketplace' },
    scores: { Features: 96, Performance: 88, EaseOfUse: 92 },
    prices: { amazon: { price: 'Free', link: 'https://www.jetbrains.com/idea/' }, flipkart: { price: 'Free', link: 'https://www.jetbrains.com/idea/' }, official: { price: 'Free', link: 'https://www.jetbrains.com/idea/' } }
  },
  { id: 415, title: 'Apache Maven', subtitle: 'Software comprehension tool', category: 'TOOLS', isNew: false, features: { Type: 'Build Tool', License: 'Apache-2.0' },
    specifications: { Type: 'Build Tool', Platform: 'Cross-platform', Language: 'Java', Support: 'POM based', License: 'Open Source (Apache-2.0)', Description: 'Declarative build automation primarily used for Java projects.', PrimaryUseCase: 'Dependency management and standardized builds.', Ecosystem: 'Maven Central Repository' },
    scores: { Reliability: 99, Features: 90, Ecosystem: 98 },
    prices: { amazon: { price: 'Free', link: 'https://maven.apache.org/' }, flipkart: { price: 'Free', link: 'https://maven.apache.org/' }, official: { price: 'Free', link: 'https://maven.apache.org/' } }
  },
  { id: 416, title: 'Gradle', subtitle: 'Accelerates developer productivity', category: 'TOOLS', isNew: false, features: { Type: 'Build Tool', License: 'Apache-2.0' },
    specifications: { Type: 'Build Tool', Platform: 'Cross-platform', Language: 'Java/Kotlin', Support: 'DSL', License: 'Open Source (Apache-2.0)', Description: 'Highly customizable and fast build automation tool.', PrimaryUseCase: 'Android development and multi-project Java builds.', Ecosystem: 'Gradle Plugins' },
    scores: { Performance: 95, Flexibility: 98, Ecosystem: 92 },
    prices: { amazon: { price: 'Free', link: 'https://gradle.org/' }, flipkart: { price: 'Free', link: 'https://gradle.org/' }, official: { price: 'Free', link: 'https://gradle.org/' } }
  },
  { id: 417, title: 'Apache Ant', subtitle: 'Java based build tool', category: 'TOOLS', isNew: false, features: { Type: 'Build Tool', License: 'Apache-2.0' },
    specifications: { Type: 'Build Tool', Platform: 'Cross-platform', Language: 'Java', Support: 'XML based', License: 'Open Source (Apache-2.0)', Description: 'Extremely flexible, procedural build system using XML.', PrimaryUseCase: 'Custom build scripts and legacy Java support.', Ecosystem: 'Apache Foundation' },
    scores: { Dependability: 99, Speed: 90, Flexibility: 85 },
    prices: { amazon: { price: 'Free', link: 'https://ant.apache.org/' }, flipkart: { price: 'Free', link: 'https://ant.apache.org/' }, official: { price: 'Free', link: 'https://ant.apache.org/' } }
  },
  { id: 418, title: 'Jenkins', subtitle: 'Leading open source automation server', category: 'TOOLS', isNew: false, features: { Type: 'CI/CD', License: 'MIT' },
    specifications: { Type: 'CI/CD Server', Platform: 'Cross-platform', Language: 'Java', Plugins: '1800+', License: 'Open Source (MIT)', Description: 'Provides hundreds of plugins to support building, deploying and automating any project.', PrimaryUseCase: 'Continuous Integration / Continuous Delivery pipelines.', Ecosystem: 'Jenkins Plugin Index' },
    scores: { Extensibility: 100, Ecosystem: 99, EaseOfSetup: 80 },
    prices: { amazon: { price: 'Free', link: 'https://www.jenkins.io/' }, flipkart: { price: 'Free', link: 'https://www.jenkins.io/' }, official: { price: 'Free', link: 'https://www.jenkins.io/' } }
  },
  { id: 419, title: 'GitLab CI/CD', subtitle: 'Integrated CI/CD platform', category: 'TOOLS', isNew: false, features: { Type: 'CI/CD', License: 'MIT' },
    specifications: { Type: 'CI/CD', Platform: 'Cross-platform', Integrated: 'GitLab', Runners: 'Go based', License: 'Open Source (MIT)', Description: 'Built into GitLab to automatically build, test, secure, and deploy software.', PrimaryUseCase: 'Seamless code-to-deployment workflows.', Ecosystem: 'GitLab Registry' },
    scores: { Integration: 99, Features: 95, EaseOfUse: 92 },
    prices: { amazon: { price: 'Free', link: 'https://about.gitlab.com/' }, flipkart: { price: 'Free', link: 'https://about.gitlab.com/' }, official: { price: 'Free', link: 'https://docs.gitlab.com/ee/ci/' } }
  },
  { id: 420, title: 'Tekton', subtitle: 'Cloud-native CI/CD framework', category: 'TOOLS', isNew: false, features: { Type: 'CI/CD', License: 'Apache-2.0' },
    specifications: { Type: 'CI/CD', Platform: 'Kubernetes', Language: 'Go', Ecosystem: 'CD Foundation', License: 'Open Source (Apache-2.0)', Description: 'Kubernetes-native framework for creating continuous integration and delivery systems.', PrimaryUseCase: 'Serverless CI/CD on Kubernetes.', Ecosystem: 'Tekton Hub' },
    scores: { Flexibility: 95, Scalability: 98, Ecosystem: 88 },
    prices: { amazon: { price: 'Free', link: 'https://tekton.dev/' }, flipkart: { price: 'Free', link: 'https://tekton.dev/' }, official: { price: 'Free', link: 'https://tekton.dev/' } }
  },
  { id: 421, title: 'Docker Engine', subtitle: 'Industry standard container runtime', category: 'TOOLS', isNew: false, features: { Type: 'Containerization', License: 'Apache-2.0' },
    specifications: { Type: 'Container Runtime', Platform: 'Linux/Mac/Win', Core: 'containerd', Interface: 'CLI', License: 'Open Source (Apache-2.0)', Description: 'De-facto standard for building, sharing, and running applications in isolated containers.', PrimaryUseCase: 'Local development and microservices packaging.', Ecosystem: 'Docker Hub' },
    scores: { Ecosystem: 100, Usability: 95, Reliability: 99 },
    prices: { amazon: { price: 'Free', link: 'https://www.docker.com/' }, flipkart: { price: 'Free', link: 'https://www.docker.com/' }, official: { price: 'Free', link: 'https://github.com/docker/engine' } }
  },
  { id: 422, title: 'Podman', subtitle: 'Daemonless container engine', category: 'TOOLS', isNew: true, features: { Type: 'Containerization', License: 'Apache-2.0' },
    specifications: { Type: 'Container Runtime', Platform: 'Linux/Mac/Win', Architecture: 'Daemonless', Rootless: 'Yes', License: 'Open Source (Apache-2.0)', Description: 'A secure alternative to Docker that does not require a root daemon.', PrimaryUseCase: 'Rootless container isolation for improved security.', Ecosystem: 'RedHat / OCI' },
    scores: { Security: 98, Compatibility: 96, Architecture: 95 },
    prices: { amazon: { price: 'Free', link: 'https://podman.io/' }, flipkart: { price: 'Free', link: 'https://podman.io/' }, official: { price: 'Free', link: 'https://podman.io/' } }
  },
  { id: 423, title: 'containerd', subtitle: 'Standard container runtime', category: 'TOOLS', isNew: false, features: { Type: 'Containerization', License: 'Apache-2.0' },
    specifications: { Type: 'Container Runtime', Platform: 'Linux/Win', Ecosystem: 'CNCF', Focus: 'Simplicity', License: 'Open Source (Apache-2.0)', Description: 'Industry-standard core container runtime with an emphasis on simplicity, robustness and portability.', PrimaryUseCase: 'Base runtime used by Kubernetes and Docker.', Ecosystem: 'CNCF' },
    scores: { Performance: 99, Reliability: 99, Ecosystem: 96 },
    prices: { amazon: { price: 'Free', link: 'https://containerd.io/' }, flipkart: { price: 'Free', link: 'https://containerd.io/' }, official: { price: 'Free', link: 'https://containerd.io/' } }
  },
  { id: 424, title: 'Kubernetes', subtitle: 'Container orchestration system', category: 'TOOLS', isNew: false, features: { Type: 'Orchestration', License: 'Apache-2.0' },
    specifications: { Type: 'Orchestration', Platform: 'Linux', Ecosystem: 'CNCF', Scaling: 'Automated', License: 'Open Source (Apache-2.0)', Description: 'Automates deployment, scaling, and management of containerized applications.', PrimaryUseCase: 'Enterprise and cloud-scale container orchestration.', Ecosystem: 'Helm, Cloud Native' },
    scores: { Scalability: 100, Ecosystem: 100, Complexity: 85 },
    prices: { amazon: { price: 'Free', link: 'https://kubernetes.io/' }, flipkart: { price: 'Free', link: 'https://kubernetes.io/' }, official: { price: 'Free', link: 'https://kubernetes.io/' } }
  },
  { id: 425, title: 'Docker Swarm', subtitle: 'Native clustering for Docker', category: 'TOOLS', isNew: false, features: { Type: 'Orchestration', License: 'Apache-2.0' },
    specifications: { Type: 'Orchestration', Platform: 'Cross-platform', Integration: 'Docker CLI', Setup: 'Simple', License: 'Open Source (Apache-2.0)', Description: 'Swarm mode is built into the Docker Engine and is extremely easy to set up.', PrimaryUseCase: 'Simple container orchestration for small/medium clusters.', Ecosystem: 'Docker Engine' },
    scores: { Usability: 96, Simplicity: 98, Scalability: 88 },
    prices: { amazon: { price: 'Free', link: 'https://docs.docker.com/engine/swarm/' }, flipkart: { price: 'Free', link: 'https://docs.docker.com/engine/swarm/' }, official: { price: 'Free', link: 'https://docs.docker.com/engine/swarm/' } }
  },
  { id: 426, title: 'Nomad', subtitle: 'Simple/flexible workload orchestrator', category: 'TOOLS', isNew: false, features: { Type: 'Orchestration', License: 'BUSL/MPL' },
    specifications: { Type: 'Orchestration', Platform: 'Cross-platform', Vendor: 'HashiCorp', Workloads: 'Containers, VMs, Binaries', License: 'Open Source/BUSL', Description: 'Orchestrates any type of application, not just containers.', PrimaryUseCase: 'Mixed workloads (VMs + Containers + Edge) orchestration.', Ecosystem: 'Consul, Vault' },
    scores: { Flexibility: 97, Simplicity: 94, Performance: 95 },
    prices: { amazon: { price: 'Free', link: 'https://www.nomadproject.io/' }, flipkart: { price: 'Free', link: 'https://www.nomadproject.io/' }, official: { price: 'Free', link: 'https://www.nomadproject.io/' } }
  },
  { id: 427, title: 'Ansible', subtitle: 'Simple IT automation', category: 'TOOLS', isNew: false, features: { Type: 'Config Mgmt', License: 'GPL-3.0' },
    specifications: { Type: 'Automation', Platform: 'Cross-platform', Language: 'Python/YAML', Architecture: 'Agentless', License: 'Open Source (GPL-3.0)', Description: 'Radically simple IT automation engine via SSH without agents.', PrimaryUseCase: 'Configuration management and ad-hoc infrastructure logic.', Ecosystem: 'Ansible Galaxy' },
    scores: { Usability: 98, Adoption: 99, Extensibility: 96 },
    prices: { amazon: { price: 'Free', link: 'https://www.ansible.com/' }, flipkart: { price: 'Free', link: 'https://www.ansible.com/' }, official: { price: 'Free', link: 'https://www.ansible.com/' } }
  },
  { id: 428, title: 'Puppet', subtitle: 'Infrastructure delivery tooling', category: 'TOOLS', isNew: false, features: { Type: 'Config Mgmt', License: 'Apache-2.0' },
    specifications: { Type: 'Automation', Platform: 'Cross-platform', Language: 'Ruby/DSL', Architecture: 'Agent-based', License: 'Open Source (Apache-2.0)', Description: 'Ensures servers are configured in their desired state continuously.', PrimaryUseCase: 'Large scale infrastructure-as-code management.', Ecosystem: 'Puppet Forge' },
    scores: { Scalability: 97, Reliability: 95, Usability: 85 },
    prices: { amazon: { price: 'Free', link: 'https://puppet.com/' }, flipkart: { price: 'Free', link: 'https://puppet.com/' }, official: { price: 'Free', link: 'https://puppet.com/' } }
  },
  { id: 429, title: 'Chef', subtitle: 'Infrastructure as code', category: 'TOOLS', isNew: false, features: { Type: 'Config Mgmt', License: 'Apache-2.0' },
    specifications: { Type: 'Automation', Platform: 'Cross-platform', Language: 'Ruby', Architecture: 'Agent-based', License: 'Open Source (Apache-2.0)', Description: 'Transform infrastructure into code using Ruby dialects.', PrimaryUseCase: 'Extremely customizable configuration enforcement.', Ecosystem: 'Chef Supermarket' },
    scores: { Flexibility: 95, Extensibility: 96, Usability: 82 },
    prices: { amazon: { price: 'Free', link: 'https://www.chef.io/' }, flipkart: { price: 'Free', link: 'https://www.chef.io/' }, official: { price: 'Free', link: 'https://www.chef.io/' } }
  },
  { id: 430, title: 'Redmine', subtitle: 'Flexible project management web app', category: 'TOOLS', isNew: false, features: { Type: 'Project Mgmt', License: 'GPL-2.0' },
    specifications: { Type: 'Issue Tracker', Platform: 'Web', Language: 'Ruby on Rails', Plugins: 'Extensive', License: 'Open Source (GPL-2.0)', Description: 'Provides Gantt charts, calendar, wiki, forums, and role-based access.', PrimaryUseCase: 'Cross-project issue tracking and traditional management.', Ecosystem: 'Redmine Plugins' },
    scores: { Features: 94, Flexibility: 95, ModernUI: 70 },
    prices: { amazon: { price: 'Free', link: 'https://www.redmine.org/' }, flipkart: { price: 'Free', link: 'https://www.redmine.org/' }, official: { price: 'Free', link: 'https://www.redmine.org/' } }
  },
  { id: 431, title: 'Bugzilla', subtitle: 'Robust defect tracking system', category: 'TOOLS', isNew: false, features: { Type: 'Project Mgmt', License: 'MPL' },
    specifications: { Type: 'Issue Tracker', Platform: 'Web', Language: 'Perl', UseCase: 'Large Projects', License: 'Open Source (MPL)', Description: 'Used by organizations like Mozilla to track highly complex software defects.', PrimaryUseCase: 'Heavy-duty software bug tracking.', Ecosystem: 'Bugzilla Extensions' },
    scores: { Capability: 98, Speed: 90, ModernUI: 60 },
    prices: { amazon: { price: 'Free', link: 'https://www.bugzilla.org/' }, flipkart: { price: 'Free', link: 'https://www.bugzilla.org/' }, official: { price: 'Free', link: 'https://www.bugzilla.org/' } }
  },
  { id: 432, title: 'Taiga', subtitle: 'Agile project management platform', category: 'TOOLS', isNew: false, features: { Type: 'Project Mgmt', License: 'AGPL-3.0' },
    specifications: { Type: 'Issue Tracker', Platform: 'Web', Language: 'Python/Django', Framework: 'Scrum/Kanban', License: 'Open Source (AGPL-3.0)', Description: 'Highly visual platform tailored strictly for agile methodologies.', PrimaryUseCase: 'Scrum sprints and Kanban boards for dev teams.', Ecosystem: 'Taiga Integrations' },
    scores: { Usability: 96, Aesthetics: 95, Features: 90 },
    prices: { amazon: { price: 'Free', link: 'https://taiga.io/' }, flipkart: { price: 'Free', link: 'https://taiga.io/' }, official: { price: 'Free', link: 'https://taiga.io/' } }
  },
  { id: 433, title: 'SonarQube (Community)', subtitle: 'Code quality and security', category: 'TOOLS', isNew: false, features: { Type: 'Code Quality', License: 'LGPL-3.0' },
    specifications: { Type: 'Static Analysis', Platform: 'Web', Support: '15+ Languages', UseCase: 'CI/CD Integration', License: 'Open Source (LGPL-3.0)', Description: 'Continuously inspects code quality to detect bugs, code smells and security vulnerabilities.', PrimaryUseCase: 'Automated CI code review.', Ecosystem: 'SonarSource' },
    scores: { Analysis: 98, Ecosystem: 96, Usability: 92 },
    prices: { amazon: { price: 'Free', link: 'https://www.sonarsource.com/products/sonarqube/' }, flipkart: { price: 'Free', link: 'https://www.sonarsource.com/products/sonarqube/' }, official: { price: 'Free', link: 'https://www.sonarqube.org/' } }
  },
  { id: 434, title: 'ESLint', subtitle: 'Pluggable JavaScript linter', category: 'TOOLS', isNew: false, features: { Type: 'Code Quality', License: 'MIT' },
    specifications: { Type: 'Linter', Platform: 'Node.js', Language: 'JS/TS', Customization: 'High', License: 'Open Source (MIT)', Description: 'Find and fix problems in your JavaScript code.', PrimaryUseCase: 'Enforcing JS/TS code standards and catching syntax bugs.', Ecosystem: 'NPM rulesets' },
    scores: { Usability: 99, Ecosystem: 100, Speed: 95 },
    prices: { amazon: { price: 'Free', link: 'https://eslint.org/' }, flipkart: { price: 'Free', link: 'https://eslint.org/' }, official: { price: 'Free', link: 'https://eslint.org/' } }
  },
  { id: 435, title: 'Prettier', subtitle: 'Opinionated code formatter', category: 'TOOLS', isNew: false, features: { Type: 'Code Quality', License: 'MIT' },
    specifications: { Type: 'Formatter', Platform: 'Node.js', Language: 'Multiple', Ecosystem: 'IDE Plug-ins', License: 'Open Source (MIT)', Description: 'Parses code and re-prints it with its own consistent style.', PrimaryUseCase: 'Automatic code style homogenization over a repository.', Ecosystem: 'Prettier Plugins' },
    scores: { Speed: 98, Consistency: 100, Adoption: 99 },
    prices: { amazon: { price: 'Free', link: 'https://prettier.io/' }, flipkart: { price: 'Free', link: 'https://prettier.io/' }, official: { price: 'Free', link: 'https://prettier.io/' } }
  },
  { id: 436, title: 'Selenium', subtitle: 'Browser automation framework', category: 'TOOLS', isNew: false, features: { Type: 'Testing', License: 'Apache-2.0' },
    specifications: { Type: 'Testing Web', Platform: 'Cross-platform', Language: 'Multiple', Support: 'All major browsers', License: 'Open Source (Apache-2.0)', Description: 'Provides a playback tool for authoring tests without the need to learn a test scripting language.', PrimaryUseCase: 'Automated end-to-end web testing across all browsers.', Ecosystem: 'Selenium Grid' },
    scores: { Capability: 99, Ecosystem: 100, Speed: 80 },
    prices: { amazon: { price: 'Free', link: 'https://www.selenium.dev/' }, flipkart: { price: 'Free', link: 'https://www.selenium.dev/' }, official: { price: 'Free', link: 'https://www.selenium.dev/' } }
  },
  { id: 437, title: 'Cypress', subtitle: 'Next generation front end testing tool', category: 'TOOLS', isNew: false, features: { Type: 'Testing', License: 'MIT' },
    specifications: { Type: 'Testing Web', Platform: 'Cross-platform', Language: 'JavaScript', Focus: 'E2E Testing', License: 'Open Source (MIT)', Description: 'Modern web automation built for the modern web directly in the browser architecture.', PrimaryUseCase: 'Developer-oriented E2E and component testing.', Ecosystem: 'Cypress Dashboard' },
    scores: { Usability: 98, Speed: 95, Features: 94 },
    prices: { amazon: { price: 'Free', link: 'https://www.cypress.io/' }, flipkart: { price: 'Free', link: 'https://www.cypress.io/' }, official: { price: 'Free', link: 'https://www.cypress.io/' } }
  },
  { id: 438, title: 'JUnit', subtitle: 'Testing framework for Java', category: 'TOOLS', isNew: false, features: { Type: 'Testing', License: 'EPL-2.0' },
    specifications: { Type: 'Unit Testing', Platform: 'Java', Architecture: 'JUnit 5 Platform', UseCase: 'TDD', License: 'Open Source (EPL-2.0)', Description: 'The most popular unit testing framework providing annotations for test execution.', PrimaryUseCase: 'Test-Driven Development (TDD) for Java applications.', Ecosystem: 'Maven/Gradle Test' },
    scores: { Ecosystem: 100, Stability: 99, Extensibility: 95 },
    prices: { amazon: { price: 'Free', link: 'https://junit.org/' }, flipkart: { price: 'Free', link: 'https://junit.org/' }, official: { price: 'Free', link: 'https://junit.org/' } }
  },
  { id: 439, title: 'PostgreSQL', subtitle: 'Advanced open source relational DB', category: 'TOOLS', isNew: false, features: { Type: 'Database', License: 'PostgreSQL' },
    specifications: { Type: 'RDBMS', Platform: 'Cross-platform', Language: 'C', ACID: 'Yes', License: 'Open Source (PostgreSQL License)', Description: 'Highly robust relational database system known for strict standards compliance and scalability.', PrimaryUseCase: 'Complex relational schemas and structured data integrity.', Ecosystem: 'PostGIS, Citus' },
    scores: { Reliability: 100, Features: 99, Performance: 95 },
    prices: { amazon: { price: 'Free', link: 'https://www.postgresql.org/' }, flipkart: { price: 'Free', link: 'https://www.postgresql.org/' }, official: { price: 'Free', link: 'https://www.postgresql.org/' } }
  },
  { id: 440, title: 'MySQL', subtitle: 'Most popular open source DB', category: 'TOOLS', isNew: false, features: { Type: 'Database', License: 'GPL-2.0' },
    specifications: { Type: 'RDBMS', Platform: 'Cross-platform', Language: 'C/C++', Performance: 'High', License: 'Open Source (GPL-2.0)', Description: 'Fast, reliable, and extremely popular database backend for web applications.', PrimaryUseCase: 'General purpose relational data serving.', Ecosystem: 'Oracle' },
    scores: { Scalability: 96, Adoption: 100, Usability: 92 },
    prices: { amazon: { price: 'Free', link: 'https://www.mysql.com/' }, flipkart: { price: 'Free', link: 'https://www.mysql.com/' }, official: { price: 'Free', link: 'https://www.mysql.com/' } }
  },
  { id: 441, title: 'MariaDB', subtitle: 'Community-developed fork of MySQL', category: 'TOOLS', isNew: false, features: { Type: 'Database', License: 'GPL-2.0' },
    specifications: { Type: 'RDBMS', Platform: 'Cross-platform', Language: 'C/C++', StorageEngines: 'Pluggable', License: 'Open Source (GPL-2.0)', Description: 'Created by original developers of MySQL with guarantees to stay open source.', PrimaryUseCase: 'Drop-in replacement for MySQL with more features.', Ecosystem: 'MariaDB Foundation' },
    scores: { Innovation: 95, Performance: 97, Compatibility: 98 },
    prices: { amazon: { price: 'Free', link: 'https://mariadb.org/' }, flipkart: { price: 'Free', link: 'https://mariadb.org/' }, official: { price: 'Free', link: 'https://mariadb.org/' } }
  },
  { id: 442, title: 'Hoppscotch', subtitle: 'Open source API development ecosystem', category: 'TOOLS', isNew: true, features: { Type: 'API Tool', License: 'MIT' },
    specifications: { Type: 'API Client', Platform: 'Web/PWA', Architecture: 'Vue.js', Identity: 'Postman Alternative', License: 'Open Source (MIT)', Description: 'Lightweight web-based API request builder with real-time syncing.', PrimaryUseCase: 'Rapid API testing and sharing within the browser.', Ecosystem: 'Hoppscotch CLI' },
    scores: { Usability: 98, Speed: 99, Features: 92 },
    prices: { amazon: { price: 'Free', link: 'https://hoppscotch.io/' }, flipkart: { price: 'Free', link: 'https://hoppscotch.io/' }, official: { price: 'Free', link: 'https://hoppscotch.io/' } }
  },
  { id: 443, title: 'Insomnia', subtitle: 'API platform for GraphQL/REST/gRPC', category: 'TOOLS', isNew: false, features: { Type: 'API Tool', License: 'MIT' },
    specifications: { Type: 'API Client', Platform: 'Cross-platform', Support: 'GraphQL, REST', Extensibility: 'Plugins', License: 'Open Source (MIT)', Description: 'Desktop application to test APIs locally and efficiently with strong GraphQL support.', PrimaryUseCase: 'REST/GraphQL API design and testing.', Ecosystem: 'Insomnia Plugins' },
    scores: { Aesthetics: 96, Features: 95, Adoption: 90 },
    prices: { amazon: { price: 'Free', link: 'https://insomnia.rest/' }, flipkart: { price: 'Free', link: 'https://insomnia.rest/' }, official: { price: 'Free', link: 'https://insomnia.rest/' } }
  },
  { id: 444, title: 'Bruno', subtitle: 'Open-source IDE for exploring APIs', category: 'TOOLS', isNew: true, features: { Type: 'API Tool', License: 'MIT' },
    specifications: { Type: 'API Client', Platform: 'Cross-platform', Storage: 'Local Plain Text', Identity: 'Postman Alternative', License: 'Open Source (MIT)', Description: 'Revolutionary API client that stores collections as plain text making it Git-friendly.', PrimaryUseCase: 'Version-controlled API collections without cloud dependency.', Ecosystem: 'Bruno CLI' },
    scores: { Privacy: 100, Usability: 94, Speed: 96 },
    prices: { amazon: { price: 'Free', link: 'https://www.usebruno.com/' }, flipkart: { price: 'Free', link: 'https://www.usebruno.com/' }, official: { price: 'Free', link: 'https://www.usebruno.com/' } }
  },
  { id: 445, title: 'Prometheus', subtitle: 'Monitoring system & time series DB', category: 'TOOLS', isNew: false, features: { Type: 'Monitoring', License: 'Apache-2.0' },
    specifications: { Type: 'Monitoring', Platform: 'Linux', Ecosystem: 'CNCF', QueryLanguage: 'PromQL', License: 'Open Source (Apache-2.0)', Description: 'Gathers multi-dimensional time series data using a pull model.', PrimaryUseCase: 'Cloud-native service monitoring and alerting.', Ecosystem: 'Exporters / Grafana' },
    scores: { Scalability: 98, Features: 99, EaseOfSetup: 85 },
    prices: { amazon: { price: 'Free', link: 'https://prometheus.io/' }, flipkart: { price: 'Free', link: 'https://prometheus.io/' }, official: { price: 'Free', link: 'https://prometheus.io/' } }
  },
  { id: 446, title: 'Grafana', subtitle: 'The open observability platform', category: 'TOOLS', isNew: false, features: { Type: 'Monitoring', License: 'AGPL-3.0' },
    specifications: { Type: 'Dashboarding', Platform: 'Cross-platform', Integration: 'Prometheus, TSDBs', Visuals: 'Extensive', License: 'Open Source (AGPL-3.0)', Description: 'Allows you to query, visualize, alert on and understand your metrics no matter where they are stored.', PrimaryUseCase: 'Interactive dashboards for metrics and logs.', Ecosystem: 'Grafana Plugins' },
    scores: { Visualization: 100, Usability: 96, Ecosystem: 99 },
    prices: { amazon: { price: 'Free', link: 'https://grafana.com/' }, flipkart: { price: 'Free', link: 'https://grafana.com/' }, official: { price: 'Free', link: 'https://grafana.com/' } }
  },
  { id: 447, title: 'Zabbix', subtitle: 'Enterprise-class monitoring solution', category: 'TOOLS', isNew: false, features: { Type: 'Monitoring', License: 'GPL-2.0' },
    specifications: { Type: 'Monitoring', Platform: 'Cross-platform', Scalability: 'Enterprise', Agents: 'Available', License: 'Open Source (GPL-2.0)', Description: 'Mature, network-heavy monitoring system with built-in UI and alerting.', PrimaryUseCase: 'Server and network infrastructure monitoring.', Ecosystem: 'Zabbix Integrations' },
    scores: { Capability: 97, Scalability: 96, ModernUI: 80 },
    prices: { amazon: { price: 'Free', link: 'https://www.zabbix.com/' }, flipkart: { price: 'Free', link: 'https://www.zabbix.com/' }, official: { price: 'Free', link: 'https://www.zabbix.com/' } }
  },
  { id: 448, title: 'Elasticsearch', subtitle: 'Distributed, RESTful search/analytics engine', category: 'TOOLS', isNew: false, features: { Type: 'Log Mgmt', License: 'Elastic/SSPL' },
    specifications: { Type: 'Search Engine', Platform: 'Cross-platform', Base: 'Apache Lucene', Ecosystem: 'ELK Stack', License: 'Open Source / Business', Description: 'Provides a distributed, multitenant-capable full-text search engine.', PrimaryUseCase: 'Log aggregation and extremely fast unstructured searches.', Ecosystem: 'Kibana, Logstash' },
    scores: { Speed: 99, Scalability: 98, Features: 97 },
    prices: { amazon: { price: 'Free', link: 'https://www.elastic.co/' }, flipkart: { price: 'Free', link: 'https://www.elastic.co/' }, official: { price: 'Free', link: 'https://www.elastic.co/' } }
  },
  { id: 449, title: 'Logstash', subtitle: 'Server-side data processing pipeline', category: 'TOOLS', isNew: false, features: { Type: 'Log Mgmt', License: 'Elastic/SSPL' },
    specifications: { Type: 'Data Pipeline', Platform: 'Cross-platform', 'Input/Output': 'Versatile', Ecosystem: 'ELK Stack', License: 'Open Source / Business', Description: 'Ingests data from a multitude of sources simultaneously, transforms it, and sends it to your favorite stash.', PrimaryUseCase: 'Data parsing and routing for logging.', Ecosystem: 'Elastic Stack' },
    scores: { Capability: 96, Flexibility: 98, Performance: 88 },
    prices: { amazon: { price: 'Free', link: 'https://www.elastic.co/logstash' }, flipkart: { price: 'Free', link: 'https://www.elastic.co/logstash' }, official: { price: 'Free', link: 'https://www.elastic.co/logstash' } }
  },
  { id: 450, title: 'Fluentd', subtitle: 'Data collector for unified logging layer', category: 'TOOLS', isNew: false, features: { Type: 'Log Mgmt', License: 'Apache-2.0' },
    specifications: { Type: 'Data Pipeline', Platform: 'Cross-platform', Language: 'Ruby/C', Ecosystem: 'CNCF', License: 'Open Source (Apache-2.0)', Description: 'Decouples data sources from backend systems by providing a unified logging layer.', PrimaryUseCase: 'Cloud-native log collection and shipping.', Ecosystem: 'Fluent Bit, Kubernetes' },
    scores: { Reliability: 98, Adaptability: 97, ResourceUsage: 90 },
    prices: { amazon: { price: 'Free', link: 'https://www.fluentd.org/' }, flipkart: { price: 'Free', link: 'https://www.fluentd.org/' }, official: { price: 'Free', link: 'https://www.fluentd.org/' } }
  },
  { id: 451, title: 'Gitea', subtitle: 'Painless self-hosted Git service', category: 'TOOLS', isNew: false, features: { Type: 'Code Hosting', License: 'MIT' },
    specifications: { Type: 'Forge', Platform: 'Cross-platform', Language: 'Go', Focus: 'Lightweight', License: 'Open Source (MIT)', Description: 'Community managed, lightweight code hosting solution written in Go.', PrimaryUseCase: 'Self-hosting Git repositories on low-power servers.', Ecosystem: 'Forgejo' },
    scores: { Performance: 99, Simplicity: 96, Features: 88 },
    prices: { amazon: { price: 'Free', link: 'https://gitea.io/' }, flipkart: { price: 'Free', link: 'https://gitea.io/' }, official: { price: 'Free', link: 'https://gitea.io/' } }
  },
  { id: 452, title: 'GitLab CE', subtitle: 'Complete DevOps platform', category: 'TOOLS', isNew: false, features: { Type: 'Code Hosting', License: 'MIT' },
    specifications: { Type: 'Forge', Platform: 'Linux', Ecosystem: 'All-in-one', Scale: 'Enterprise', License: 'Open Source (MIT)', Description: 'A single application for the entire DevSecOps lifecycle.', PrimaryUseCase: 'Comprehensive enterprise-grade code repository and pipelines.', Ecosystem: 'GitLab Runners' },
    scores: { Features: 100, Scalability: 95, ResourceUsage: 75 },
    prices: { amazon: { price: 'Free', link: 'https://about.gitlab.com/' }, flipkart: { price: 'Free', link: 'https://about.gitlab.com/' }, official: { price: 'Free', link: 'https://about.gitlab.com/install/' } }
  },
  { id: 453, title: 'Nginx', subtitle: 'High performance web server & reverse proxy', category: 'TOOLS', isNew: false, features: { Type: 'Web Server', License: 'BSD-2-Clause' },
    specifications: { Type: 'Web Server', Platform: 'Cross-platform', Architecture: 'Event-driven', Capability: 'Load Balancer', License: 'Open Source (BSD-2-Clause)', Description: 'Known for its stability, rich feature set, simple configuration, and low resource consumption.', PrimaryUseCase: 'High-traffic reverse proxy serving static content.', Ecosystem: 'F5 Networks' },
    scores: { Performance: 100, Reliability: 99, Concurrency: 100 },
    prices: { amazon: { price: 'Free', link: 'https://nginx.org/' }, flipkart: { price: 'Free', link: 'https://nginx.org/' }, official: { price: 'Free', link: 'https://nginx.org/' } }
  },
  { id: 454, title: 'Apache HTTP Server', subtitle: 'Most popular web server', category: 'TOOLS', isNew: false, features: { Type: 'Web Server', License: 'Apache-2.0' },
    specifications: { Type: 'Web Server', Platform: 'Cross-platform', Architecture: 'Process/Thread based', Modules: 'Extensive', License: 'Open Source (Apache-2.0)', Description: 'A robust, commercial-grade, featureful HTTP server serving over 20% of internet traffic.', PrimaryUseCase: 'Dynamic content processing and highly configurable routing.', Ecosystem: 'Apache Foundation' },
    scores: { Features: 98, Ecosystem: 100, Configurable: 96 },
    prices: { amazon: { price: 'Free', link: 'https://httpd.apache.org/' }, flipkart: { price: 'Free', link: 'https://httpd.apache.org/' }, official: { price: 'Free', link: 'https://httpd.apache.org/' } }
  }"""
]

# Write new tools
new_text = text.replace('  // Memory (RAM)', new_tools[0] + ',\n\n  // Memory (RAM)')

with open('generate_data.js', 'w', encoding='utf-8') as f:
    f.write(new_text)

print(f"Update complete. Added {new_tools[0].count('{ id:')} enriched tools.")
