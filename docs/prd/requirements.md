# Requirements

## Functional

- **FR1:** The system shall provide a natural language query bar as the primary search interface, accepting conversational queries (e.g., "Find PRDs for e-commerce projects", "How to integrate Razorpay")
- **FR2:** The system shall return relevant documents with context snippets highlighting matched content within 2 seconds of query submission
- **FR3:** The system shall display a hierarchical folder tree structure with visual access indicators (🔒 locked / 🔓 open) and document counts per folder
- **FR4:** The system shall show a preview panel on folder click displaying document title, summary, last updated timestamp, and owner
- **FR5:** The system shall display a document metadata bar showing: Created by, Modified by, Last updated timestamp, View count badge, and Comment count
- **FR6:** The system shall support simple commenting on documents with Name + Timestamp + Text format in chronological display (no reply threads or reactions)
- **FR7:** The system shall automatically track and display view counts for each document
- **FR8:** The system shall provide an external resource fallback when no internal documents match a query, with a toggle between "Search internal only" and "Search everywhere"
- **FR9:** The system shall enforce role-based access control at the department level with visual indicators in the folder tree
- **FR10:** The system shall support Markdown format for document content
- **FR11:** The system shall allow users to create, edit, and delete documents within their authorized folders
- **FR12:** The system shall provide user authentication with basic auth (username/password)

## Non-Functional

- **NFR1:** Query results shall be returned in less than 2 seconds under normal load
- **NFR2:** Page load time shall not exceed 3 seconds on standard broadband connections
- **NFR3:** The system shall support 100+ concurrent users without performance degradation
- **NFR4:** The system shall support the latest 2 versions of Chrome, Firefox, Safari, and Edge browsers
- **NFR5:** The system shall be deployable via containerized infrastructure (Docker)
- **NFR6:** The system shall maintain audit logging for document access events
- **NFR7:** The system shall be designed as a monolith with clear separation of concerns to allow future service extraction
- **NFR8:** The codebase shall use TypeScript for type safety across frontend and backend
- **NFR9:** The system shall minimize external service costs by leveraging cost-effective NLP/embedding solutions
