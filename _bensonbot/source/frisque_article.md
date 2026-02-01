---
title: "Frisque – Using AI agents for Due Diligence"
---
In this article, I discuss how to use AI agents for Due Diligence

TLDR;
Frisque uses django, ai agents, celery and rabbitmq to automate due diligence on startups. It takes text, pitch decks, financial spreadsheets and even video as input and outputs an investment memo. It was built for the Agent Development Kit Hackathon with Google Cloud on DevPost.

Table of Contents
Introduction
The Problem
Our Solution
Architecture and Stack
Agentic AI – Orchestration in Action
Challenges and Revelations
Key Learnings
Future Plans
DYI
Conclusion
Introduction
In the dynamic world of Venture Capital (VC), conducting due diligence on potential startup investments is a critical yet cumbersome bottleneck. This process became painfully familiar through firsthand experience interning in VC, revealing the sheer volume of information, meticulous cross-referencing, and relentless pressure to identify both opportunity and risk within tight timeframes. Frisque was born directly from this experience, aiming to automate and augment these very tasks and challenges.

VC firms inherently dedicate significant time and resources to due diligence, as it is crucial for assessing a startup's viability and growth potential. Given that a fund's returns often originate from a small percentage of its investments, streamlining this process is absolutely crucial for success. Frisque aims to go beyond mere efficiency, enabling VCs to make smarter, faster, and more informed investment decisions.

The Problem
Having both spent time interning in the dynamic world of Venture Capital, we quickly became painfully familiar with a critical, yet cumbersome, bottleneck: due diligence. The sheer volume of information, the meticulous cross-referencing, and the relentless pressure to identify both opportunity and risk within a tight timeframe becomes incredibly apparent in such roles. Frisque was born out of this firsthand experience, directly addressing the very tasks and challenges we faced, aiming to automate and augment the work we were doing.

Venture Capital (VC) firms dedicate a significant amount of time and resources to conducting due diligence on potential startup investments. This process is critical for assessing a startup's viability and growth potential, but it is incredibly time-intensive. Given that a fund's returns often come from a small percentage of its investments (pareto principle), streamlining this process is absolutely crucial for success. It's about more than just efficiency; it's about making smarter, faster, and more informed investment decisions.

Our Solution
Frisque, aptly named from the French "Faux Risque" (false risk), is an AI-powered platform built to revolutionize the VC due diligence process by significantly reducing the time and effort VCs spend on initial assessments while dramatically improving the depth and breadth of insights.
At its core, Frisque is a web-based platform built on Django, uniquely leveraging Google's open-source Agent Development Kit (ADK) to create a sophisticated multi-agent AI system. This approach means Frisque isn't just one large AI, but a coordinated team of specialized AI "agents" working together, mirroring a human due diligence team.
Here's how Frisque's agentic system streamlines the process:

Comprehensive Input Collection: Analysts can initiate "scans" on target companies. They provide a wide array of inputs, including company names, website URLs, business plans, pitch decks, lean canvases, founder profiles, social media links, and even financial documents (like spreadsheets) and government registration documents. The system also allows users to select which specific types of scans they want to perform, such as Tech, Legal, or Financial analysis.
Intelligent Agent Orchestration: Once a scan is initiated, a Master Bot, or Orchestrator Agent, takes charge. It intelligently delegates specific sub-tasks to a team of specialized worker agents. This multi-agent by design approach is a core strength of Google's ADK, enabling complex coordination and task delegation.

Specialized Agents in Action:
The Tech Bot assesses a startup's technology stack, scalability, and potentially intellectual property.
The Legal Bot sifts through provided legal documents to identify basic red flags or critical phrases in contracts and registrations.
The Market Research Bot gathers crucial data on market size, industry trends, and competitor landscapes.
The Social Media Sentiment Bot analyzes public sentiment around the company and its founders from various social media profiles.
The Financial Bot performs basic analysis of financial statements, capable of detecting anomalies or inconsistencies in the data.

These agents utilize Large Language Models (LLMs), Natural Language Processing (NLP) tools, and can integrate with external APIs or custom tools as needed. A key learning was that ADK's inherent agency allows bots to choose their own tools, meaning we didn't need to explicitly direct them, which streamlined our development. We also adopted a "Pipeline / Assembly line architecture" or "Dumb Worker, Smart Master" pattern, where complex logic is handled by the master agent and a dedicated worker agent formats responses, effectively solving issues like prompt leakage and hallucination we initially encountered. This approach reinforces the benefits of a microservices design over a monolithic one for scalability and isolation.

Comprehensive Output Generation: The system synthesizes the findings from all the specialized agents into a comprehensive and actionable suite of outputs. This includes a structured Investment Memo (a go/no-go document), a summary Dashboard with key findings and scores, and if financial data is provided, basic financial projections. It also provides a valuable list of assumptions made, key questions to ask the startup, and all cited sources.
Real-time Updates and Notifications: To keep analysts informed throughout the process, Frisque provides real-time updates on scan progress directly on the results page using Django Channels (WebSockets). Users also receive both in-app notifications and email notifications once a scan is complete.

By leveraging Google's ADK and a modern stack including Django, PostgreSQL, Celery, RabbitMQ, and Google Cloud services like Google Cloud Storage and Vertex AI, Frisque is designed to be modular, scalable, and deployment-ready. This project is also a contribution to the Agent Development Kit Hackathon with Google Cloud, highlighting our use of Google Cloud technologies and the open-source ADK

Architecture and Stack
Frisque's architecture and technology stack are designed for modularity, scalability, and efficient AI-powered due diligence. It aims to support asynchronous workloads and intelligent processing.
Here's a breakdown of the key components:

Our Architecture diagram

Backend Framework (Django): Frisque is a web-based platform built on Django. Django provides a self-contained framework for the application's backend. Its ORM (Object-Relational Mapper) simplifies database interactions by managing models for users, companies, and scan jobs. This structure allows for quick integration with other technologies, such as Docker, for consistent development and deployment.

AI Agents (Google Agent Development Kit - ADK): The platform leverages Google's Agent Development Kit (ADK) to create its multi-agent AI system. ADK is an open-source, code-first framework designed for building and deploying sophisticated AI agents. It is "Multi-Agent by Design," enabling complex coordination and delegation of tasks within a team of agents. The Agent Starter Pack provides an easier way to quickly set up, customize, and deploy agents. This approach supports modular and scalable development, breaking down intricate problems into manageable sub-tasks handled by specialized agents.

Asynchronous Task Queue (Celery) and Message Broker (RabbitMQ): Frisque uses Celery for background task processing. When a scan is initiated, a Celery task is dispatched to handle it asynchronously. This allows for scheduling and managing complex, time-consuming operations outside of the main web request flow. RabbitMQ (or Redis) serves as the message broker for Celery, facilitating communication between the application and the worker processes.

Containerization (Docker and Docker Compose): Docker is used for containerization, ensuring that the application and all its dependencies are packaged into isolated units. Docker Compose simplifies the management of multi-container Docker applications for local development. This setup provides reproducibility across different environments, making it easy to get the development environment up and running consistently. All development commands are designed to be run inside the web container for a consistent workflow.

Database (PostgreSQL): PostgreSQL is the chosen database for storing structured data. This includes details of target companies and scan job metadata.

Object Storage (Google Cloud Storage - GCS): Google Cloud Storage (GCS) is integrated for storing unstructured data. This includes uploaded documents like pitch decks and financial spreadsheets, as well as generated reports and memos.

Real-time Communication (Django Channels): Django Channels, utilizing WebSockets, enables real-time updates and notifications. This allows the scan results page to display live progress updates and provides in-app notifications upon scan completion.

Infrastructure as Code (Terraform): Terraform is used for provisioning Google Cloud Platform (GCP) resources. This ensures that the cloud infrastructure is managed consistently and repeatably.

Cloud Platform (Google Cloud Platform - GCP): The entire system is designed to leverage Google Cloud Platform services for deployment and scalability. This includes potential use of Vertex AI for Agent Engine and LLM hosting, Cloud Run for serverless agent deployment, and Cloud SQL for managed PostgreSQL. Frisque is also a contribution to the Agent Development Kit Hackathon with Google Cloud.

This comprehensive stack allows Frisque to efficiently process complex due diligence tasks, manage data, and provide real-time insights to users.

Agentic AI – Orchestration in action
Frisque's power lies in its agentic AI system, meticulously designed to replicate and enhance the collaborative nature of a human due diligence team. This sophisticated structure is made possible by leveraging Google's open-source Agent Development Kit (ADK), a framework built to develop, evaluate, and deploy sophisticated AI agents and multi-agent systems. ADK is inherently "Multi-Agent by Design," which means it excels at enabling complex coordination and delegation of tasks within a hierarchy or team of agents.
When an analyst initiates a "scan" on a target company within Frisque, a comprehensive process of intelligent orchestration begins.

The Orchestrator Agent (Master Bot): At the core of this system is a Master Bot, acting as the Orchestrator Agent. Its primary role is to receive the initial scan request and intelligently delegate specific sub-tasks to a team of specialized worker agents. This delegation is crucial for breaking down intricate due diligence problems into manageable parts.

Specialized Agents in a Pipeline: Frisque employs a diverse set of specialized worker agents, each with a distinct focus. These include the Tech Bot, Legal Bot, Market Research Bot, Social Media Sentiment Bot, and Financial Bot. A key learning during development was the adoption of a "Pipeline / Assembly line architecture" or "Dumb Worker, Smart Master" pattern. In this architecture, the complex logic and coordination are handled by the master agent, while a dedicated worker agent is specifically responsible for formatting the responses. This separation of concerns proved vital in solving initial challenges like prompt leakage and hallucination, reinforcing the benefits of a microservices design for scalability and isolation.

Intelligent Tool Selection and Inquiry: A significant aspect of the agents' intelligence lies in their inherent agency. The ADK's design allows bots to choose their own tools without explicit direction from the developer. This means agents can intelligently decide which resources to use for their tasks, whether it's utilizing Large Language Models (LLMs), Natural Language Processing (NLP) tools, integrating with external APIs, or even using other agents as tools. This self-directed tool selection, and the ability to inquire further after obtaining initial results, streamlines the development process and enhances the depth of research. For instance, the Market Research Bot might autonomously decide to use web search tools to gather market size data or a sentiment API to analyze social media.

Synthesis and Output: As each specialized agent completes its analysis, it gathers, processes, and analyzes information based on its function and the provided inputs. The Orchestrator then synthesizes these findings from all the specialized agents into comprehensive and actionable outputs. This culminates in a structured Investment Memo, a summary Dashboard with key findings and scores, and potentially basic financial projections. The system also provides a valuable list of assumptions made, key questions to ask the startup, and all cited sources.

This orchestrative, multi-agent approach allows Frisque to efficiently process complex due diligence tasks, manage vast amounts of data, and provide real-time, insightful analyses to VC firms.

Challenges and Revelations
One of the first and most critical challenges was agent hallucination. Agents were generating incorrect or fabricated information. Closely related was prompt leakage. This occurred due to difficulties in system integration. Initially, the master agent was responsible for both task delegation and response formatting. This design inadvertently led to the agents' tendency to hallucinate and expose prompts in unintended ways.

We fixed the above by creating a new agent to format the final output before it is returned by the master agent. Even in this we had to be explicit in terms of the fields we required in the output in both the master agent and the formatting agent. Otherwise we would get errors of missing fields.

Another inherent challenge in building multi-agent systems, particularly with complex interactions, involves designing and debugging their orchestration. Ensuring the consistency and accuracy of Large Language Model (LLM) calls across various agent tasks, while also managing their associated costs, proved challenging. The overall quality and availability of input data for target companies also directly impacted the effectiveness of the agents. Finally, effectively quantifying and training agents to achieve the depth of insight expected by experienced Venture Capitalists was a significant undertaking

Key Learnings
Embracing a Pipeline/Microservices Architecture for Agentic Systems: Our development journey revealed that complex multi-agent systems, especially those dealing with detailed outputs, can suffer from agent hallucination and prompt leakage. This was a profound revelation, teaching us the crucial importance of a pipeline or assembly line architecture. By introducing a new, dedicated agent solely for formatting the final output, we achieved a clearer separation of concerns. This "Dumb Worker, Smart Master" pattern proved far more effective for managing complex logic, allowing agents to specialize. This experience solidified our conviction that a microservices approach is generally superior to a monolith for deployment, offering benefits like enhanced scalability, technology flexibility, reduced single points of failure, and faster deployments. We saw how individual management of agents became possible, allowing us to explore other technologies if needed.
Leveraging Google Agent Development Kit (ADK) for Multi-Agent Orchestration: ADK, as an open-source, code-first framework, became the backbone of Frisque, empowering us to build, evaluate, and deploy sophisticated AI agents. Its "Multi-Agent by Design" principle was instrumental for enabling the complex coordination and task delegation within our system. We learned to fully utilize ADK's flexible orchestration capabilities, including both workflow agents for predictable pipelines (like SequentialAgent, ParallelAgent, and LoopAgent) and LLM-Driven Dynamic Routing for adaptive behaviors. The integrated developer experience, complete with a command-line interface (CLI) and a visual Web UI, significantly aided our development, allowing us to run agents, inspect execution steps, and debug interactions in real-time. The built-in observability and debugging tools, which log agent decisions, tool usage, and trace delegation paths, were invaluable for understanding and refining our agents' behavior.
Precision in Prompting and Agent Tooling: A critical insight gained was that agents within ADK do not need explicit direction on which tools to use. Simply providing the prompt is sufficient, as ADK already exposes the available tools to the agent, and the agent's selection of tools is part of its inherent agency. However, we also learned the critical importance of being explicit in terms of required output fields (both in the master agent's instructions and the formatting agent's directives) to prevent errors and ensure consistent data.
The Paramount Importance of Data Quality: The effectiveness of our AI agents in due diligence directly correlated with the quality and availability of input data. This highlighted the absolute necessity of establishing robust data management processes and infrastructure for input collection and storage. We chose Google Cloud Storage (GCS) for securely housing uploaded documents and generated reports, with PostgreSQL maintaining structured data and references.
Balancing AI Capabilities with Human Expectation: Quantifying and training agents to achieve the depth of insight expected by experienced Venture Capitalists proved a significant undertaking. Our learning here was the value of an iterative and specialized approach. By developing distinct agents for different domains—such as Tech Bot, Legal Bot, Market Research Bot, Social Media Sentiment Bot, and Financial Bot—we could address specific analytical tasks. This modularity, combined with a basic scoring mechanism, is our path to incrementally achieving sophisticated VC-level insights, understanding that AI augments, rather than replaces, human judgment in complex financial decisions
Future Plans
Collapse the results into a downloadable pdf document
Add more ai agents
Add email notification for when a scan is done
Allow selective scans, e.g., security, sentiment analysis, social media, legal, etc
Create a scan history and dashboard pages
Integrate MCP, A2A and other integrations
Scoring of startups for investments purposes
DYI
Please find the code here
Follow the results in the README to reproduce the project. No api keys or envs needed.

Conclusion
The comprehensive technology stack employed by Frisque allows it to efficiently process complex due diligence tasks, manage data, and provide real-time insights to users. The process of due diligence mirrors that of fundraising. Marc Andressen once compared fundraising rounds to removing the layers of an onion and we hope Frisque can help make this less tear-worthy for VCs.
