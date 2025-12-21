import React, { useState, useEffect, useRef } from 'react';

interface NavLink {
  id: string;
  title: string;
}

interface NavGroup {
  groupTitle: string;
  links: NavLink[];
}

interface Subsection {
  id: string;
  title: string;
}

interface ContentSection {
  id: string;
  title: string;
  subsections?: Subsection[];
}

type ContentItem = {
  type: 'paragraph' | 'heading' | 'list';
  content: string | string[];
  level?: number;
};

export default function guide_for_author() {
  const [activeSection, setActiveSection] = useState<string>('guide-authors');
  
  const mainContentRef = useRef<HTMLDivElement>(null);
  
  const observerRef = useRef<IntersectionObserver | null>(null);

  const navGroups: NavGroup[] = [
    {
      groupTitle: 'About the journal',
      links: [
        { id: 'aims-scope', title: 'Aims and scope' },
        { id: 'peer-review', title: 'Peer review' },
        { id: 'open-access', title: 'Open access' },
      ]
    },
    {
      groupTitle: 'Ethics and policies',
      links: [
        { id: 'ethics-publishing', title: 'Ethics in publishing' },
        { id: 'submission-declaration', title: 'Submission declaration' },
        { id: 'authorship', title: 'Authorship' },
        { id: 'changes-authorship', title: 'Changes to authorship' },
        { id: 'competing-interests', title: 'Declaration of competing interests' },
        { id: 'funding-sources', title: 'Funding sources' },
        { id: 'ai-use', title: 'Declaration of generative AI use' },
        { id: 'preprints', title: 'Preprints' },
        { id: 'inclusive-language', title: 'Use of inclusive language' },
        { id: 'sex-gender-analyses', title: 'Reporting sex- and gender-based analyses' },
        { id: 'jurisdictional-claims', title: 'Jurisdictional claims' },
      ]
    },
    {
      groupTitle: 'Writing and formatting',
      links: [
        { id: 'file-format', title: 'File format' },
        { id: 'latex', title: 'LaTeX' },
        { id: 'title-page', title: 'Title page' },
        { id: 'abstract', title: 'Abstract' },
        { id: 'keywords', title: 'Keywords' },
        { id: 'highlights', title: 'Highlights' },
        { id: 'graphical-abstract', title: 'Graphical abstract' },
        { id: 'units-classifications', title: 'Units, classifications codes and nomenclature' },
        { id: 'math-formulae', title: 'Math formulae' },
        { id: 'tables', title: 'Tables' },
        { id: 'figures-images', title: 'Figures, images and artwork' },
        { id: 'ai-figures', title: 'Generative AI and Figures, images and artwork' },
        { id: 'supplementary-material', title: 'Supplementary material' },
        { id: 'video', title: 'Video' },
      ]
    },
    {
      groupTitle: 'Research data',
      links: [
        { id: 'research-data', title: 'Research data' },
        { id: 'data-linking', title: 'Data linking' },
        { id: 'research-elements', title: 'Research Elements' },
        { id: 'co-submission', title: 'Co-submission of related data, methods or protocols' },
      ]
    },
    {
      groupTitle: 'Article structure',
      links: [
        { id: 'article-structure', title: 'Article structure' },
        { id: 'references', title: 'References' },
      ]
    },
    {
      groupTitle: 'Submitting your manuscript',
      links: [
        { id: 'submission-checklist', title: 'Submission checklist' },
        { id: 'submit-online', title: 'Submit online' },
       
      ]
    },
    {
      groupTitle: 'After receiving a final decision',
      links: [
        
        { id: 'article-transfer', title: 'Article Transfer Service' },
        { id: 'publishing-agreement', title: 'Publishing agreement' },
        { id: 'license-options', title: 'License options' },
        { id: 'permission-copyrighted', title: 'Permission for copyrighted works' },
        { id: 'proof-correction', title: 'Proof correction' },
        { id: 'offprints', title: 'Offprints' },
        { id: 'responsible-sharing', title: 'Responsible sharing' },
      ]
    },
    {
      groupTitle: 'Resources for authors',
      links: [
        { id: 'elsevier-academy', title: 'Elsevier Researcher Academy' },
        { id: 'language-editing', title: 'Language and editing services' },
        { id: 'getting-help', title: 'Getting help and support' },
        { id: 'author-support', title: 'Author support' },
      ]
    }
  ];

  const contentSections: ContentSection[] = [
    { id: 'about-journal', title: 'About the journal' },
    { id: 'aims-scope', title: 'Aims and scope' },
    { id: 'peer-review', title: 'Peer review' },
    { id: 'open-access', title: 'Open access' },
    { id: 'ethics-publishing', title: 'Ethics in publishing' },
    { id: 'submission-declaration', title: 'Submission declaration' },
    { id: 'authorship', title: 'Authorship' },
    { id: 'changes-authorship', title: 'Changes to authorship' },
    { id: 'competing-interests', title: 'Declaration of competing interests' },
    { id: 'funding-sources', title: 'Funding sources' },
    { id: 'ai-use', title: 'Declaration of generative AI use' },
    { id: 'preprints', title: 'Preprints' },
    { id: 'inclusive-language', title: 'Use of inclusive language' },
    { id: 'sex-gender-analyses', title: 'Reporting sex- and gender-based analyses' },
    { id: 'jurisdictional-claims', title: 'Jurisdictional claims' },
    { id: 'file-format', title: 'File format' },
    { id: 'latex', title: 'LaTeX' },
    { id: 'title-page', title: 'Title page' },
    { id: 'abstract', title: 'Abstract' },
    { id: 'keywords', title: 'Keywords' },
    { id: 'highlights', title: 'Highlights' },
    { id: 'graphical-abstract', title: 'Graphical abstract' },
    { id: 'units-classifications', title: 'Units, classifications codes and nomenclature' },
    { id: 'math-formulae', title: 'Math formulae' },
    { id: 'tables', title: 'Tables' },
    { id: 'figures-images', title: 'Figures, images and artwork' },
    { id: 'ai-figures', title: 'Generative AI and Figures, images and artwork' },
    { id: 'supplementary-material', title: 'Supplementary material' },
    { id: 'video', title: 'Video' },
    { id: 'research-data', title: 'Research data' },
    { id: 'data-linking', title: 'Data linking' },
    { id: 'research-elements', title: 'Research Elements' },
    { id: 'co-submission', title: 'Co-submission of related data, methods or protocols' },
    { id: 'article-structure', title: 'Article structure' },
    { id: 'references', title: 'References' },
    { id: 'submission-checklist', title: 'Submission checklist' },
    { id: 'submit-online', title: 'Submit online' },
    { id: 'after-decision', title: 'After receiving a final decision' },
    { id: 'article-transfer', title: 'Article Transfer Service' },
    { id: 'publishing-agreement', title: 'Publishing agreement' },
    { id: 'license-options', title: 'License options' },
    { id: 'permission-copyrighted', title: 'Permission for copyrighted works' },
    { id: 'proof-correction', title: 'Proof correction' },
    { id: 'offprints', title: 'Offprints' },
    { id: 'responsible-sharing', title: 'Responsible sharing' },
    { id: 'elsevier-academy', title: 'Elsevier Researcher Academy' },
    { id: 'language-editing', title: 'Language and editing services' },
    { id: 'getting-help', title: 'Getting help and support' },
    { id: 'author-support', title: 'Author support' },
  ];

  const sectionContent: { [key: string]: ContentItem[] } = {
    'about-journal': [],
    'aims-scope': [
      { type: 'paragraph', content: 'Internet of Things; Engineering Cyber Physical Human Systems is a comprehensive journal encouraging cross collaboration between researchers, engineers and practitioners in the field of IoT & Cyber Physical Human Systems. The journal offers a unique platform to exchange scientific information on the entire breadth of technology, science, and societal applications of the IoT.' },
      { type: 'paragraph', content: 'The journal will place a high priority on timely publication, and provide a home for high quality:' },
      { type: 'list', content: ['Full Research papers', 'Survey Papers', 'Open Software and Data', 'Tutorials and best practices', 'Case studies', 'Whitepapers'] },
      { type: 'paragraph', content: 'Furthermore, IOT is interested in publishing topical Special Issues on any aspect of IOT. Please submit your SI proposal for IOT through the Elsevier CSSI Portal. Detailed instructions could be found at: https://www.elsevier.com/physical-sciences-and-engineering/computer-science/journals/how-to-prepare-a-special-issue-proposal' },
      { type: 'paragraph', content: 'The scope of IoT comprises four main blocks to cover the entire spectrum of the field. From Research to Technology, from Applications to their Consequences for life and society.' },
      { type: 'heading', content: 'Theory and fundamental research', level: 3 },
      { type: 'paragraph', content: 'Research that addresses the core underlying scientific principles dealing with the analysis and algorithmics of "IoT ecosystem" as a multicomponent system with complex and dynamic dependences at large-scale, such as:' },
      { type: 'list', content: ['New formal methods research to create abstractions, formalisms and semantics at IoT layer.', 'Artificial Intelligence of Things (AIoT), Explainable Machine Learning for IoT, Intelligent Edge.', 'Research on the unique IoT challenges in security, reliability and privacy.', 'High-level policy languages for specifying permissible communication patterns.'] },
      { type: 'heading', content: 'Software development, technology and engineering', level: 3 },
      { type: 'paragraph', content: 'Key enabling IoT technologies related to sensors, actuators and machine intelligence. Development and deployment IoT tools and platforms to ensure security, reliability and efficiency, such as:' },
      { type: 'list', content: ['Device software development, such as minimal operating systems.', 'IoT in Cloud-to-thing-Continuum. Secure communication of IoT with other software layers from edge computing to the Cloud.', 'IoT software designs, including addressing security at design phase.', 'Best practices for IoT (software) development, test beds and quality assurance. Sensors and actuators; Remote Operations and Control; IoT and Digital Twins.'] },
      { type: 'heading', content: 'Applications of IoT', level: 3 },
      { type: 'paragraph', content: 'New Applications of connected products and/or connected business processes to create new business value and business models. We are looking for contributions, and lessons learned, from researchers applying IoT in various domains including but not limited to:' },
      { type: 'list', content: ['Energy (smart grids, meters & appliances, renewable energy).', 'Transportation and Critical Infrastructures (infrastructures, logistics, road and rail, shipping, aerospace, autonomous vehicles).', 'Manufacturing & industry (smart design & smart manufacturing, advanced robotics; Robotic Process Automation).', 'Business, marketing & finance (e-commerce, finance, advertising & media).', 'Urban life (smart/cyber-cities, home automation, smart buildings).', 'Behavioral Sciences, Well-being Society, Sustainable Digital Transformation.', 'eLearning, Technology-Enhanced Learning, CSCL, Virtual Campuses, Education and Technology.', 'Ecology (precision agriculture, dairy, fishing, wildlife management, water, climate & ecology).', 'Medicine & healthcare (delivery & care systems, decision support, wearables).', 'Nano IoT (personalized precision medicine, Biological IoT, Chemical IoT).'] },
      { type: 'heading', content: 'Societal aspects of IoT', level: 3 },
      { type: 'list', content: ['Keeping humans in the loop is vital. Research in cyber-human systems that reflect human understanding and interaction with the physical world and (semi) autonomous systems.', 'Societal, political and social impacts of the IoT.', 'Ethics & (proposed) laws & regulations.', 'IoT Governance.', 'IoT Solutions for Pandemics, Disaster Management and Public Safety.', 'Human Technology Interaction - at scale.', 'Emerging standards and technology in human life.', 'And, of course, hot issues, such as auditing, liability and social vulnerabilities.'] }
    ],
    'peer-review': [
      { type: 'paragraph', content: 'This journal follows a single anonymized review process. Your submission will initially be assessed by our editors to determine suitability for publication in this journal. If your submission is deemed suitable, it will typically be sent to a minimum of two reviewers for an independent expert assessment of the scientific quality. The decision as to whether your article is accepted or rejected will be taken by our editors.' },
      { type: 'paragraph', content: 'Read more about peer review.' },
      { type: 'heading', content: 'Our editors are not involved in making decisions about papers which:', level: 3 },
      { type: 'list', content: ['they have written themselves.', 'have been written by family members or colleagues.', 'relate to products or services in which they have an interest.'] },
      { type: 'paragraph', content: 'Any such submissions will be subject to the journal\'s usual procedures and peer review will be handled independently of the editor involved and their research group. Read more about editor duties.' },
      { type: 'paragraph', content: 'Authors may submit a formal appeal request to the editorial decision, provided it meets all the requirements and follows the procedure outlined in Elsevier\'s Appeal Policy. Only one appeal per submission will be considered and the appeal decision will be final.' },
      { type: 'heading', content: 'Special issues and article collections', level: 3 },
      { type: 'paragraph', content: 'The peer review process for special issues and article collections follows the same process as outlined above for regular submissions, except, a guest editor may send the submissions out to the reviewers and may recommend a decision to the journal editor. The journal editor oversees the peer review process of all special issues and article collections to ensure the high standards of publishing ethics and responsiveness are respected and is responsible for the final decision regarding acceptance or rejection of articles.' }
    ],
    'open-access': [
      { type: 'paragraph', content: 'Information about open access options will be displayed here.' }
    ],
    'ethics-publishing': [
      { type: 'paragraph', content: 'Authors must follow ethical guidelines stated in Elsevier\'s Publishing Ethics Policy.' }
    ],
    'submission-declaration': [
      { type: 'paragraph', content: 'When authors submit an article to an Elsevier journal it is implied that:' },
      { type: 'list', content: ['The work described has not been published previously except in the form of a preprint, an abstract, a published lecture, academic thesis or registered report. See our policy on multiple, redundant or concurrent publication.', 'The article is not under consideration for publication elsewhere.', 'The article\'s publication is approved by all authors and tacitly or explicitly by the responsible authorities where the work was carried out.', 'If accepted, the article will not be published elsewhere in the same form, in English or in any other language, including electronically, without the written consent of the copyright-holder.'] },
      { type: 'paragraph', content: 'To verify compliance with our journal publishing policies, we may check your manuscript with our screening tools.' }
    ],
    'authorship': [
      { type: 'paragraph', content: 'All authors should have made substantial contributions to all of the following:' },
      { type: 'list', content: ['The conception and design of the study, or acquisition of data, or analysis and interpretation of data.', 'Drafting the article or revising it critically for important intellectual content.', 'Final approval of the version to be submitted.'] },
      { type: 'paragraph', content: 'Authors should appoint a corresponding author to communicate with the journal during the editorial process. All authors should agree to be accountable for all aspects of the work to ensure that the questions related to the accuracy or integrity of any part of the work are appropriately investigated and resolved.' }
    ],
    'changes-authorship': [
      { type: 'paragraph', content: 'The editors of this journal generally will not consider changes to authorship once a manuscript has been submitted. It is important that authors carefully consider the authorship list and order of authors and provide a definitive author list at original submission.' },
      { type: 'heading', content: 'The policy of this journal around authorship changes:', level: 3 },
      { type: 'list', content: ['All authors must be listed in the manuscript and their details entered into the submission system.', 'Any addition, deletion or rearrangement of author names in the authorship list should only be made prior to acceptance, and only if approved by the journal editor.', 'Requests to change authorship should be made by the corresponding author, who must provide the reason for the request to the journal editor with written confirmation from all authors, including any authors being added or removed, that they agree with the addition, removal or rearrangement.', 'All requests to change authorship must be submitted using this form. Requests which do not comply with the instructions outlined in the form will not be considered.', 'Only in exceptional circumstances will the journal editor consider the addition, deletion or rearrangement of authors post acceptance.', 'Publication of the manuscript may be paused while a change in authorship request is being considered.', 'Any authorship change requests approved by the journal editor will result in a corrigendum if the manuscript has already been published.', 'Any unauthorized authorship changes may result in the rejection of the article, or retraction, if the article has already been published.'] }
    ],
    'competing-interests': [
      { type: 'paragraph', content: 'All authors must disclose any financial and personal relationships with other people or organizations that could inappropriately influence or bias their work. Examples of potential competing interests include:' },
      { type: 'list', content: ['Employment', 'Consultancies', 'Stock ownership', 'Honoraria', 'Paid expert testimony', 'Patent applications or registrations', 'Grants or any other funding', 'Affiliation with the journal as an Editor or Advisory Board Member'] },
      { type: 'paragraph', content: 'The declarations tool should always be completed.' },
      { type: 'paragraph', content: 'Authors with a journal affiliation to declare should enter the following text under "Other Activities" within the declarations tool and should inform the journal and publisher prior to completing the submission process:' },
      { type: 'paragraph', content: 'Given their role as [insert journal role title], [insert your name] had no involvement in the peer-review of this article and has no access to information regarding its peer-review. Full responsibility for the editorial process for this article was delegated to another journal editor.' },
      { type: 'paragraph', content: 'Authors with no competing interests to declare should select the option "I have nothing to declare".' },
      { type: 'paragraph', content: 'The resulting Word document containing your declaration should be uploaded at the "attach/upload files" step in the submission process. It is important that the Word document is saved in the .doc/.docx file format. Author signatures are not required.' }
    ],
    'funding-sources': [
      { type: 'paragraph', content: 'Authors must disclose any funding sources who provided financial support for the conduct of the research and/or preparation of the article. The role of sponsors, if any, should be declared in relation to the study design, collection, analysis and interpretation of data, writing of the report and decision to submit the article for publication. If funding sources had no such involvement this should be stated in your submission.' },
      { type: 'paragraph', content: 'List funding sources in this standard way to facilitate compliance to funder\'s requirements:' },
      { type: 'paragraph', content: 'Funding: This work was supported by the National Institutes of Health [grant numbers xxxx, yyyy]; the Bill & Melinda Gates Foundation, Seattle, WA [grant number zzzz]; and the United States Institutes of Peace [grant number aaaa].' },
      { type: 'paragraph', content: 'It is not necessary to include detailed descriptions on the program or type of grants, scholarships and awards. When funding is from a block grant or other resources available to a university, college, or other research institution, submit the name of the institute or organization that provided the funding.' },
      { type: 'paragraph', content: 'If no funding has been provided for the research, it is recommended to include the following sentence:' },
      { type: 'paragraph', content: 'This research did not receive any specific grant from funding agencies in the public, commercial, or not-for-profit sectors.' }
    ],
    'ai-use': [
      { type: 'paragraph', content: 'Authors must declare the use of generative AI in the manuscript preparation process upon submission of the paper.' },
      { type: 'paragraph', content: 'Elsevier recognizes the potential of generative AI and AI-assisted technologies ("AI Tools"), when used responsibly, to help researchers work efficiently, gain critical insights fast and achieve better outcomes. Increasingly, these tools, including AI agents and deep research tools, are helping researchers to synthesize complex literature, provide an overview of a field or research question, identify research gaps, generate ideas, and provide tailored support for tasks such as content organization and improving language and readability.' },
      { type: 'paragraph', content: 'Authors preparing a manuscript for an Elsevier journal can use AI Tools to support them. However, these tools must never be used as a substitute for human critical thinking, expertise and evaluation. AI technology should always be applied with human oversight and control.' },
      { type: 'paragraph', content: 'Ultimately, authors are responsible and accountable for the contents of their work. This includes accountability for:' },
      { type: 'list', content: ['Carefully reviewing and verifying the accuracy, comprehensiveness, and impartiality of all AI-generated output (including checking the sources, as AI-generated references can be incorrect or fabricated).', 'Editing and adapting all material thoroughly to ensure the manuscript represents the author\'s authentic and original contribution and reflects their own analysis, interpretation, insights and ideas.', 'Ensuring the use of any tools or sources, AI-based or otherwise, is made clear and transparent to readers. If AI Tools have been used, we require a disclosure statement upon submission; please see example below.', 'Ensuring the manuscript is developed in a way that safeguards data privacy, intellectual property and other rights, by checking the terms and conditions of any AI tool that is used.'] },
      { type: 'paragraph', content: 'Finally, authors must not list or cite AI Tools as an author or co-author on the manuscript since authorship implies responsibilities and tasks that can only be attributed to, and performed by, humans.' },
      { type: 'paragraph', content: 'The use of AI Tools in the manuscript preparation process must be declared by adding a statement at the end of the manuscript when the paper is first submitted. The statement will appear in the published work and should be placed in a new section before the references list.' },
      { type: 'heading', content: 'An example:', level: 3 },
      { type: 'paragraph', content: 'Title of new section: Declaration of generative AI and AI-assisted technologies in the manuscript preparation process.' },
      { type: 'paragraph', content: 'Statement: During the preparation of this work the author(s) used [NAME OF TOOL / SERVICE] in order to [REASON]. After using this tool/service, the author(s) reviewed and edited the content as needed and take(s) full responsibility for the content of the published article.' },
      { type: 'paragraph', content: 'The declaration does not apply to the use of basic tools, such as tools used to check grammar, spelling and references. If you have nothing to disclose, you do not need to add a statement.' },
      { type: 'paragraph', content: 'Please read Elsevier\'s author policy on the use of generative AI and AI-assisted technologies, which can be found in our generative AI policies for journals.' },
      { type: 'paragraph', content: 'Please note: to protect authors\' rights and the confidentiality of their research, this journal does not currently allow the use of generative AI or AI-assisted technologies such as ChatGPT or similar services by reviewers or editors in the peer review and manuscript evaluation process, as is stated in our generative AI policies for journals. We are actively evaluating compliant AI Tools and may revise this policy in the future.' }
    ],
    'preprints': [
      { type: 'heading', content: 'Preprint sharing', level: 3 },
      { type: 'paragraph', content: 'Authors may share preprints in line with Elsevier\'s article sharing policy. Sharing preprints, such as on a preprint server, will not count as prior publication.' },
      { type: 'paragraph', content: 'We advise you to read our policy on multiple, redundant or concurrent publication.' },
      { type: 'heading', content: 'Preprint posting on SSRN', level: 3 },
      { type: 'paragraph', content: 'In support of Open Science, this journal offers its authors a free preprint posting service on SSRN, Elsevier\'s preprint and early research repository.' },
      { type: 'paragraph', content: 'During submission to this journal, you can choose to post your manuscript on SSRN, and it will be made publicly available as soon as it passes the journal\'s initial desk review.' },
      { type: 'paragraph', content: 'As a preprint on SSRN, your manuscript will benefit from:' },
      { type: 'list', content: ['Early registration with a preprint DOI (Digital Object Identifier)', 'A link from the preprint to the version of record if published in this Elsevier journal', 'Preprint posting, sharing, and download availability that facilitates collaboration and early citations'] },
      { type: 'paragraph', content: 'Your decision to post or not post your preprint will have no effect on the editorial process or publication outcome with the journal. For additional information, please consult the SSRN Terms of Use and FAQs.' },
      { type: 'paragraph', content: 'It is expected that the corresponding author will seek approval from all co-authors before agreeing to post the manuscript publicly, prior to peer review, on SSRN.' }
    ],
    'inclusive-language': [
      { type: 'paragraph', content: 'Inclusive language acknowledges diversity, conveys respect to all people, is sensitive to differences, and promotes equal opportunities. Authors should ensure their work uses inclusive language throughout and contains nothing which might imply one individual is superior to another on the grounds of:' },
      { type: 'list', content: ['age', 'gender', 'race', 'ethnicity', 'culture', 'sexual orientation', 'disability or health condition'] },
      { type: 'paragraph', content: 'We recommend avoiding the use of descriptors about personal attributes unless they are relevant and valid. Write for gender neutrality with the use of plural nouns ("clinicians, patients/clients") as default. Wherever possible, avoid using "he, she," or "he/she."' },
      { type: 'paragraph', content: 'No assumptions should be made about the beliefs of readers and writing should be free from bias, stereotypes, slang, reference to dominant culture and/or cultural assumptions.' },
      { type: 'paragraph', content: 'These guidelines are meant as a point of reference to help you identify appropriate language but are by no means exhaustive or definitive' }
    ],
    'sex-gender-analyses': [
      { type: 'paragraph', content: 'There is no single, universally agreed-upon set of guidelines for defining sex and gender. We offer the following guidance:' },
      { type: 'list', content: ['Sex and gender-based analyses (SGBA) should be integrated into research design when research involves or pertains to humans, animals or eukaryotic cells. This should be done in accordance with any requirements set by funders or sponsors and best practices within a field.', 'Sex and/or gender dimensions of the research should be addressed within the article or declared as a limitation to the generalizability of the research.', 'Definitions of sex and/or gender applied should be explicitly stated to enhance the precision, rigor and reproducibility of the research and to avoid ambiguity or conflation of terms and the constructs to which they refer.'] },
      { type: 'paragraph', content: 'We advise you to read the Sex and Gender Equity in Research (SAGER) guidelines and the SAGER checklist (PDF) on the EASE website, which offer systematic approaches to the use of sex and gender information in study design, data analysis, outcome reporting and research interpretation.' },
      { type: 'paragraph', content: 'For further information we suggest reading the rationale behind and recommended use of the SAGER guidelines.' },
      { type: 'heading', content: 'Definitions of sex and/or gender', level: 3 },
      { type: 'paragraph', content: 'We ask authors to define how sex and gender have been used in their research and publication. Some guidance:' },
      { type: 'paragraph', content: 'Sex generally refers to a set of biological attributes that are associated with physical and physiological features such as chromosomal genotype, hormonal levels, internal and external anatomy. A binary sex categorization (male/female) is usually designated at birth ("sex assigned at birth") and is in most cases based solely on the visible external anatomy of a newborn. In reality, sex categorizations include people who are intersex/have differences of sex development (DSD).' },
      { type: 'paragraph', content: 'Gender generally refers to socially constructed roles, behaviors and identities of women, men and gender-diverse people that occur in a historical and cultural context and may vary across societies and over time. Gender influences how people view themselves and each other, how they behave and interact and how power is distributed in society.' },
      { type: 'paragraph', content: 'Depending on the focus of a paper, sex and/or gender may or may not be relevant to the content of the paper. We recognize that beliefs, attitudes, and laws relating to sex and gender may vary. These articles do not attempt to dictate author beliefs but rather require that, where relevant to an author\'s research or paper, the author must provide clear explanations of how the paper and research define and use sex and gender.' }
    ],
    'jurisdictional-claims': [
      { type: 'paragraph', content: 'Elsevier respects the decisions taken by its authors as to how they choose to designate territories and identify their affiliations in their published content. Elsevier\'s policy is to take a neutral position with respect to territorial disputes or jurisdictional claims, including, but not limited to, maps and institutional affiliations. For journals that Elsevier publishes on behalf of a third party owner, the owner may set its own policy on these issues.' },
      { type: 'heading', content: 'Maps:', level: 3 },
      { type: 'paragraph', content: 'Readers should be able to locate any study areas shown within maps using common mapping platforms. Maps should only show the area actually studied and authors should not include a location map which displays a larger area than the bounding box of the study area. Authors should add a note clearly stating that "map lines delineate study areas and do not necessarily depict accepted national boundaries". During the review process, Elsevier\'s editors may request authors to change maps if these guidelines are not followed.' },
      { type: 'heading', content: 'Institutional affiliations:', level: 3 },
      { type: 'paragraph', content: 'Authors should use either the full, standard title of their institution or the standard abbreviation of the institutional name so that the institutional name can be independently verified for research integrity purposes.' }
    ],
    'file-format': [
      { type: 'heading', content: 'File format', level: 3 },
      { type: 'paragraph', content: 'We ask you to provide editable source files for your entire submission (including figures, tables and text graphics). Some guidelines:' },
      { type: 'list', content: ['Save files in an editable format, using the extension .doc/.docx for Word files and .tex for LaTeX files. A PDF is not an acceptable source file.', 'Format Word files in a single-column layout. Double-column formatting is only permitted for LaTeX submissions.', 'Remove any strikethrough and underlined text from your manuscript, unless it has scientific significance related to your article.', 'Use spell-check and grammar-check functions to avoid errors.'] }
    ],
    'latex': [
      { type: 'paragraph', content: 'We encourage you use our LaTeX template when preparing a LaTeX submission. You will be asked to provide all relevant editable source files upon submission or revision.' },
      { type: 'heading', content: 'Support for your LaTeX submission:', level: 3 },
      { type: 'list', content: ['LaTeX submission instructions and templates', 'Journal Article Publishing Support Center LaTeX FAQs and support', 'Researcher Academy\'s Beginners\' guide to writing a manuscript in LaTeX'] }
    ],
    'title-page': [
      { type: 'paragraph', content: 'You are required to include the following details in the title page information:' },
      { type: 'heading', content: 'Article title', level: 3 },
      { type: 'paragraph', content: 'Article titles should be concise and informative. Please avoid abbreviations and formulae, where possible, unless they are established and widely understood, e.g. DNA.' },
      { type: 'heading', content: 'Author names', level: 3 },
      { type: 'paragraph', content: 'Provide the given name(s) and family name(s) of each author. The order of authors should match the order in the submission system. Carefully check that all names are accurately spelled. If needed, you can add your name between parentheses in your own script after the English transliteration.' },
      { type: 'heading', content: 'Affiliations', level: 3 },
      { type: 'paragraph', content: 'Add affiliation addresses, referring to where the work was carried out, below the author names. Indicate affiliations using a lower-case superscript letter immediately after the author\'s name and in front of the corresponding address. Ensure that you provide the full postal address of each affiliation, including the country name and, if available, the email address of each author.' },
      { type: 'heading', content: 'Corresponding author', level: 3 },
      { type: 'paragraph', content: 'Clearly indicate who will handle correspondence for your article at all stages of the refereeing and publication process and also post-publication. This responsibility includes answering any future queries about your results, data, methodology and materials. It is important that the email address and contact details of your corresponding author are kept up to date during the submission and publication process.' },
      { type: 'heading', content: 'Present/permanent address', level: 3 },
      { type: 'paragraph', content: 'If an author has moved since the work described in your article was carried out, or the author was visiting during that time, a "present address" (or "permanent address") can be indicated by a footnote to the author\'s name. The address where the author carried out the work must be retained as their main affiliation address. Use superscript Arabic numerals for such footnotes.' }
    ],
    'abstract': [
      { type: 'paragraph', content: 'You are required to provide a concise and factual abstract which does not exceed 250 words. The abstract should briefly state the purpose of your research, principal results and major conclusions. Some guidelines:' },
      { type: 'list', content: ['Abstracts must be able to stand alone as abstracts are often presented separately from the article.', 'Avoid references. If any are essential to include, ensure that you cite the author(s) and year(s).', 'Avoid non-standard or uncommon abbreviations. If any are essential to include, ensure they are defined within your abstract at first mention.'] }
    ],
    'keywords': [
      { type: 'paragraph', content: 'You are required to provide 1 to 7 keywords for indexing purposes. Keywords should be written in English. Please try to avoid keywords consisting of multiple words (using "and" or "of").' },
      { type: 'paragraph', content: 'We recommend that you only use abbreviations in keywords if they are firmly established in the field.' }
    ],
    'highlights': [
      { type: 'paragraph', content: 'You are encouraged to provide article highlights at submission.' },
      { type: 'paragraph', content: 'Highlights are a short collection of bullet points that should capture the novel results of your research as well as any new methods used during your study. Highlights will help increase the discoverability of your article via search engines. Some guidelines:' },
      { type: 'list', content: ['Submit highlights as a separate editable file in the online submission system with the word "highlights" included in the file name.', 'Highlights should consist of 3 to 5 bullet points, each a maximum of 85 characters, including spaces.', 'We encourage you to view example article highlights and read about the benefits of their inclusion.'] }
    ],
    'graphical-abstract': [
      { type: 'paragraph', content: 'You are encouraged to provide a graphical abstract at submission.' },
      { type: 'paragraph', content: 'The graphical abstract should summarize the contents of your article in a concise, pictorial, professional form which is designed to appeal to an interdisciplinary audience. A graphical abstract will help draw more attention to your online article and support readers in digesting your research. Some guidelines:' },
      { type: 'list', content: ['You need to ensure that you have obtained the necessary permission to include any third party owned material in a graphical abstract.', 'The use of generative AI or AI-assisted tools in the production of graphical abstracts must align with our generative AI policies for journals.', 'Submit your graphical abstract as a separate file in the online submission system.', 'Ensure the image is a minimum of 531 x 1328 pixels (h x w) or proportionally more and is readable at a size of 5 x 13 cm using a regular screen resolution of 96 dpi.', 'Our preferred file types for graphical abstracts are TIFF, EPS, PDF or MS Office files.', 'We encourage you to view example graphical abstracts and read about the benefits of including them.'] }
    ],
    'units-classifications': [
      { type: 'paragraph', content: 'This journal requires you to use the international system of units (SI) which follows internationally accepted rules and conventions. If other units are mentioned within your article, you should provide the equivalent unit in SI.' }
    ],
    'math-formulae': [
      { type: 'list', content: ['Submit math equations as editable text, not as images.', 'Present simple formulae in line with normal text, where possible.', 'Use the solidus (/) instead of a horizontal line for small fractional terms such as X/Y.', 'Present variables in italics.', 'Denote powers of e by exp.', 'Display equations separately from your text, numbering them consecutively in the order they are referred to within your text.'] }
    ],
    'tables': [
      { type: 'paragraph', content: 'Tables must be submitted as editable text, not as images. Some guidelines:' },
      { type: 'list', content: ['Place tables next to the relevant text or on a separate page(s) at the end of your article.', 'Cite all tables in the manuscript text.', 'Number tables consecutively according to their appearance in the text.', 'Please provide captions along with the tables.', 'Place any table notes below the table body.', 'Avoid vertical rules and shading within table cells.', 'We recommend that you use tables sparingly, ensuring that any data presented in tables is not duplicating results described elsewhere in the article.'] }
    ],
   'figures-images': [
  { type: 'paragraph', content: 'Figures, images, artwork, diagrams and other graphical media must be supplied as separate files along with the manuscript. We recommend that you read our detailed artwork and media instructions. Some excerpts:' },
  { type: 'list', content: [
      'Cite all images in the manuscript text.',
      'Number images according to the sequence they appear within your article.',
      'Submit each image as a separate file using a logical naming convention for your files (for example, Figure_1, Figure_2 etc).',
      'Please provide captions for all figures, images, and artwork.',
      'Text graphics may be embedded in the text at the appropriate position. If you are working with LaTeX, text graphics may also be embedded in the file.'
    ]
  }
],
  'ai-figures': [
  { type: 'paragraph', content: 'Please read our policy on the use of generative AI and AI-assisted tools in figures, images, and artwork, which can be found in Elsevier’s GenAI Policies for Journals. This policy states:' },
  { type: 'list', content: [
      'We do not permit the use of Generative AI or AI-assisted tools to create or alter images in submitted manuscripts.',
      'The only exception is if the use of AI or AI-assisted tools is part of the research design or methods (for example, in the field of biomedical imaging). If this is the case, such use must be described in a reproducible manner in the methods section, including the name of the model or tool, version and extension numbers, and manufacturer.',
      'The use of generative AI or AI-assisted tools in the production of artwork such as for graphical abstracts is not permitted.',
      'The use of generative AI in the production of cover art may in some cases be allowed, if the author obtains prior permission from the journal editor and publisher, can demonstrate that all necessary rights have been cleared for the use of the relevant material, and ensures that there is correct content attribution.'
    ]
  }
],
'supplementary-material': [
  { type: 'paragraph', content: 'We encourage the use of supplementary materials such as applications, images and sound clips to enhance research. Some guidelines:' },
  { type: 'list', content: [
      'Supplementary material should be accurate and relevant to the research.',
      'Cite all supplementary files in the manuscript text.',
      'Submit supplementary materials at the same time as your article. Be aware that all supplementary materials provided will appear online in the exact same file type as received. These files will not be formatted or typeset by the production team.',
      'Include a concise, descriptive caption for each supplementary file describing its content.',
      'Provide updated files if at any stage of the publication process you wish to make changes to submitted supplementary materials.',
      'Do not make annotations or corrections to a previous version of a supplementary file.',
      'Switch off the option to track changes in Microsoft Office files. If tracked changes are left on, they will appear in your published version.'
    ]
  }
],
 'video': [
  { type: 'paragraph', content: 'This journal accepts video material and animation sequences to support and enhance your scientific research. We encourage you to include links to video or animation files within articles. Some guidelines:' },
  { type: 'list', content: [
      'When including video or animation file links within your article, refer to the video or animation content by adding a note in your text where the file should be placed.',
      'Clearly label files ensuring the given file name is directly related to the file content.',
      'Provide files in one of our recommended file formats. Files should be within our preferred maximum file size of 150 MB per file, 1 GB in total.',
      'Provide "stills" for each of your files. These will be used as standard icons to personalize the link to your video data. You can choose any frame from your video or animation or make a separate image.',
      'Provide descriptive text in your manuscript to refer to the video content. This text helps ensure accessibility for visually impaired readers who rely on descriptive information. For journals publishing in print this is also essential, as video and animation files cannot be embedded in the print version.',
      'We publish all video and animation files supplied in the electronic version of your article.',
      'For more detailed instructions, we recommend that you read our guidelines on submitting video content to be included in the body of an article.'
    ]
  }
],
 'research-data': [
  { type: 'paragraph', content: 'We are committed to supporting the storage of, access to and discovery of research data, and our research data policy sets out the principles guiding how we work with the research community to support a more efficient and transparent research process.' },
  { type: 'paragraph', content: 'Research data refers to the results of observations or experimentation that validate research findings, which may also include software, code, models, algorithms, protocols, methods and other useful materials related to the project.' },
  { type: 'paragraph', content: 'Please read our guidelines on sharing research data for more information on depositing, sharing and using research data and other relevant research materials.' },
  { type: 'paragraph', content: 'Research data deposit, citation and linking:' },
  { type: 'list', content: [
      'Deposit your research data in a relevant data repository.',
      'Cite and link to this dataset in your article.',
      'If this is not possible, make a statement explaining why research data cannot be shared.'
    ]
  }
],
'data-linking': [
  { type: 'paragraph', content: 'Linking to the data underlying your work increases your exposure and may lead to new collaborations. It also provides readers with a better understanding of the described research.' },
  { type: 'paragraph', content: 'If your research data has been made available in a data repository there are a number of ways your article can be linked directly to the dataset:' },
  { type: 'list', content: [
      'Provide a link to your dataset when prompted during the online submission process.',
      'For some data repositories, a repository banner will automatically appear next to your published article on ScienceDirect.',
      'You can also link relevant data or entities within the text of your article through the use of identifiers. Use the following format: Database: 12345 (e.g. TAIR: AT1G01020; CCDC: 734053; PDB: 1XFN).'
    ]
  },
  { type: 'paragraph', content: 'Learn more about linking research data and research articles in ScienceDirect.' }
],
  'research-elements': [
  { type: 'paragraph', content: 'This journal enables the publication of research objects (e.g. data, methods, protocols, software and hardware) related to original research in Elsevier\'s Research Elements journals.' },
  { type: 'paragraph', content: 'Research Elements are peer-reviewed, open access journals which make research objects findable, accessible and reusable. By providing detailed descriptions of objects and their application with links to the original research article, your research objects can be placed into context within your article.' },
  { type: 'paragraph', content: 'You will be alerted during submission to the opportunity to submit a manuscript to one of the Research Elements journals. Your Research Elements article can be prepared by you, or by one of your collaborators.' }
],
'co-submission': [
  { type: 'paragraph', content: 'You are encouraged to publish a description of your research data, methods, or protocols related to your regular article as a co-submission article in Data in Brief or MethodsX.' },
  { type: 'paragraph', content: 'This co-submission can be submitted at the same time as your regular manuscript submission to this journal. If both your regular and co-submitted manuscripts are accepted for publication, they will be linked together on ScienceDirect, thereby promoting research reproducibility, interoperability, and open science.' },
  { type: 'paragraph', content: 'Prepare a separate manuscript describing your research data, methods, or protocols using the mandatory templates from Data in Brief or in MethodsX.' },
  { type: 'paragraph', content: 'Submit this co-submission alongside your regular manuscript as a separate submission item; on the ‘Attach files’ page in Editorial Manager, after which it will be automatically forwarded to the Data in Brief or MethodsX and assigned an editor.' },
  { type: 'paragraph', content: 'For associated Article Processing Charge (APC) details, please visit:' },
  { type: 'list', content: [
      'MethodsX',
      'Data in Brief'
    ]
  },
  { type: 'paragraph', content: 'Please note: Due to the automated process of submitting to Data in Brief or MethodsX, only after acceptance will you be presented with a personalized OA Article Publishing Charge based on your individual context (your country, institutional affiliation, and any society membership for example).' },
  { type: 'paragraph', content: 'Please visit the co-submission Researcher Support page for more information on how to submit a co-submission.' }
],
'article-structure': [
  { type: 'paragraph', content: 'Article sections: Divide your article into clearly defined and numbered sections. Number subsections 1.1 (then 1.1.1, 1.1.2, ...), then 1.2, etc.' },
  { type: 'paragraph', content: 'Use the numbering format when cross-referencing within your article. Do not just refer to "the text."' },
  { type: 'paragraph', content: 'You may give subsections a brief heading. Headings should appear on a separate line.' },
  { type: 'paragraph', content: 'Do not include the article abstract within section numbering.' },
  { type: 'paragraph', content: 'Theory and calculation: The theory section should lay the foundation for further work by extending the background you provided in the introduction to your article. The calculation section should represent a practical development from a theoretical basis.' },
  { type: 'paragraph', content: 'Glossary: Please provide definitions of field-specific terms used in your article, in a separate list.' },
  { type: 'paragraph', content: 'Footnotes: We advise you to use footnotes sparingly. If you include footnotes in your article, ensure that they are numbered consecutively.' },
  { type: 'paragraph', content: 'You may use system features that automatically build footnotes into text. Alternatively, you can indicate the position of footnotes within the text and present them in a separate section at the end of your article.' }
],
 'references': [
  { type: 'paragraph', content: 'Reference to a dataset:' },
  { type: 'paragraph', content: '[6] M. Oguro, S. Imahiro, S. Saito, T. Nakashizuka, Mortality data for Japanese oak wilt disease and surrounding forest compositions [dataset], Mendeley Data, v1, 2015. https://doi.org/10.1234/abc12nb39r.1.' },
  { type: 'paragraph', content: 'Reference to software:' },
  { type: 'paragraph', content: '[7] E. Coon, M. Berndt, A. Jan, D. Svyatsky, A. Atchley, E. Kikinzon, D. Harp, G. Manzini, E. Shelef, K. Lipnikov, R. Garimella, C. Xu, D. Moulton, S. Karra, S. Painter, E. Jafarov, S. Molins, Advanced Terrestrial Simulator (ATS) v0.88 [software], Zenodo, March 25, 2020. https://doi.org/10.1234/zenodo.3727209.' },
  { type: 'paragraph', content: 'Reference style' },
  { type: 'paragraph', content: 'Web references' },
  { type: 'paragraph', content: 'When listing web references, as a minimum you should provide the full URL and the date when the reference was last accessed. Additional information (e.g. DOI, author names, dates or reference to a source publication) should also be provided, if known.' },
  { type: 'paragraph', content: 'You can list web references separately under a new heading directly after your reference list or include them in your reference list.' },
  { type: 'paragraph', content: 'Data references' },
  { type: 'paragraph', content: 'We encourage you to cite underlying or relevant datasets within article text and to list data references in the reference list.' },
  { type: 'paragraph', content: 'When citing data references, you should include:' },
  { type: 'list', content: [
      'author name(s)',
      'dataset title',
      'data repository',
      'version (where available)',
      'year',
      'global persistent identifier'
    ]
  },
  { type: 'paragraph', content: 'Add [dataset] immediately before your reference. This will help us to properly identify the dataset. The [dataset] identifier will not appear in your published article.' },
  { type: 'paragraph', content: 'Software references' },
  { type: 'paragraph', content: 'Cite software (including computational code, scripts, models, notebooks and libraries) in the same way as other sources of information to support proper attribution and credit, reproducibility, collaboration and reuse, and encourage building on the work of others to further research. To facilitate this, useful information is provided in this article on the essentials of software citation by FORCE 11, of which Elsevier is a member.' },
  { type: 'paragraph', content: 'A reference to software should include the following elements:' },
  { type: 'list', content: [
      'Creator(s): the authors or project that developed the software.',
      'Title: the name of the software.',
      'Publication venue: the publication venue of the software, preferably, an archive or repository that provides permanent identifiers.',
      'Date: the date the software was published. This is the date associated with a release or version of the software, or “n.d.” if the date is unknown.'
    ]
  }
],
   'submission-checklist': [
  { type: 'paragraph', content: 'Before completing the submission of your manuscript, we advise you to read our submission checklist:' },
  { type: 'list', content: [
      'One author has been designated as the corresponding author and their full contact details (email address, full postal address and phone numbers) have been provided.',
      'All files have been uploaded, including keywords, figure captions and tables (including a title, description and footnotes) included. This includes any supplementary materials and videos.',
      'Spelling and grammar checks have been carried out.',
      'All references in the article text are cited in the reference list and vice versa.',
      'Permission has been obtained for the use of any copyrighted material from other sources, including the Web.',
      'For open access articles, all authors understand that they are responsible for payment of the article publishing charge (APC) if the manuscript is accepted. Payment of the APC may be covered by the corresponding author\'s institution, or the research funder.'
    ]
  }
],
  'submit-online': [
  { type: 'paragraph', content: 'Our online submission system guides you through the process steps of entering your manuscript details and uploading your files. The system converts your article files to a single PDF file used in the peer-review process.' },
  { type: 'paragraph', content: 'Editable files (e.g., Word, LaTeX) are required to typeset your article for final publication. All correspondence, including notification of the editor\'s decision and requests for revision, is sent by email.' },
  { type: 'paragraph', content: 'Please follow this link to submit your paper.' }
],
    'after-decision': [],
'article-transfer': [
  { type: 'paragraph', content: 'If your manuscript is more suitable for an alternative Elsevier journal, you may receive an email asking you to consider transferring your manuscript via the Elsevier Article Transfer Service.' },
  { type: 'paragraph', content: 'The recommendation could come from the journal editor, a dedicated in-house scientific managing editor, a tool-assisted recommendation or a combination.' },
  { type: 'paragraph', content: 'If you agree with the recommendation, your manuscript will be transferred and independently reviewed by the editors of the new journal. You will have the opportunity to make revisions, if necessary, before the submission is complete at the destination journal.' }
],
   'publishing-agreement': [
  { type: 'paragraph', content: 'Authors will be asked to complete a publishing agreement after acceptance. The corresponding author will receive a link to the online agreement by email. We advise you to read Elsevier\'s policies related to copyright to learn more about our copyright policies and your, and your employer’s/institution’s, additional rights for subscription and open access articles.' }
],
    'license-options': [
      { type: 'paragraph', content: 'Authors will be offered open access user license options which will determine how you, and third parties, can reuse your open access article. We advise that you review these options and any funding body license requirements before selecting a license option.' }
    ],
    'permission-copyrighted': [
      { type: 'paragraph', content: 'If excerpts from other copyrighted works are included in your article, you must obtain written permission from the copyright owners and credit the source(s) within your article using Elsevier’s permission request and license form.' }
    ],
   'proof-correction': [
  { type: 'paragraph', content: 'To ensure a fast publication process we will ask you to provide proof corrections within two days.' },
  { type: 'paragraph', content: 'Corresponding authors will be sent an email which includes a link to our online proofing system, allowing annotation and correction of proofs online. The environment is similar to Word. You can edit text, comment on figures and tables and answer questions raised by our copy editor. Our web-based proofing service ensures a faster and less error-prone process.' },
  { type: 'paragraph', content: 'You can choose to annotate and upload your edits on the PDF version of your article, if preferred. We will provide you with proofing instructions and available alternative proofing methods in our email.' },
  { type: 'paragraph', content: 'The purpose of the proof is to check the typesetting, editing, completeness and correctness of your article text, tables and figures. Significant changes to your article at the proofing stage will only be considered with approval of the journal editor.' }
],
  'offprints': [
  { type: 'paragraph', content: 'A PDF file of your article will be sent by email to the corresponding author. The PDF file will be a watermarked version of your published article including a cover sheet with the journal cover image and a disclaimer outlining the terms and conditions of use.' },
  { type: 'paragraph', content: 'For an extra charge, you will be provided with the option to order paper offprints. A link to an offprint order form will be sent by email when your article is accepted for publication.' }
],
    'responsible-sharing': [
      { type: 'paragraph', content: 'We encourage you to share and promote your article to give additional visibility to your work, enabling your paper to contribute to scientific progress and foster the exchange of scientific developments within your field. Read more about how to responsibly share and promote your article.' }
    ],
    'elsevier-academy': [
  { type: 'paragraph', content: 'If you would like help to improve your submission or navigate the publication process, support is available via Elsevier Researcher Academy.' },
  { type: 'paragraph', content: 'Elsevier Researcher Academy offers free e-learning modules, webinars, downloadable guides and research writing and peer review process resources.' }
],
    'language-editing': [
  { type: 'paragraph', content: 'We recommend that you write in American or British English but not a combination of both.' },
  { type: 'paragraph', content: 'If you feel the English language in your manuscript requires editing to eliminate possible grammatical or spelling errors and to conform to correct scientific English, you may wish to use the English Language Editing service provided by Elsevier’s Author Services.' }
],
    'getting-help': [],
    'author-support': [
      { type: 'paragraph', content: 'We recommend that you visit our Journal Article Publishing Support Center if you have questions about the editorial process or require technical support for your submission.' }
    ],
  };

  useEffect(() => {
    const mainEl = mainContentRef.current;
    if (!mainEl) return;

    const sectionIds: string[] = [];
    contentSections.forEach(item => {
      sectionIds.push(item.id);
      if (item.subsections) {
        item.subsections.forEach(subItem => {
          sectionIds.push(subItem.id);
        });
      }
    });

    const intersectingSections = new Set<string>();

    const handleObserver: IntersectionObserverCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          intersectingSections.add(entry.target.id);
        } else {
          intersectingSections.delete(entry.target.id);
        }
      });

      for (const id of sectionIds) {
        if (intersectingSections.has(id)) {
          setActiveSection(id);
          break;
        }
      }
    };

    const options: IntersectionObserverInit = {
      root: mainEl,
      rootMargin: '0px 0px -80% 0px',
      threshold: 0
    };

    observerRef.current = new IntersectionObserver(handleObserver, options);

    const sections = Array.from(mainEl.querySelectorAll('section'));
    
    sections.forEach(section => {
      if (section) observerRef.current?.observe(section);
    });

    return () => {
      sections.forEach(section => {
        if (section && observerRef.current) {
          observerRef.current.unobserve(section);
        }
      });
      intersectingSections.clear();
    };
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const PlaceholderContent = ({ sectionId }: { sectionId: string }): React.ReactElement => {
    const content = sectionContent[sectionId] || [{ type: 'paragraph' as const, content: 'Content for this section will be displayed here.' }];
    
    return (
      <div className="space-y-5 text-gray-700 leading-relaxed">
        {content.map((item, index) => {
          if (item.type === 'paragraph') {
            return (
              <p key={index}>{item.content}</p>
            );
          } else if (item.type === 'heading') {
            const HeadingTag = `h${item.level || 3}` as keyof JSX.IntrinsicElements;
            return React.createElement(
              HeadingTag,
              { key: index, className: 'font-bold text-lg mt-6 mb-2' },
              item.content
            );
          } else if (item.type === 'list') {
            const listItems = Array.isArray(item.content) ? item.content : [item.content];
            return (
              <ul key={index} className="list-disc ml-6 mb-4">
                {listItems.map((listItem, listIndex) => (
                  <li key={listIndex}>{listItem}</li>
                ))}
              </ul>
            );
          }
          return null;
        })}
      </div>
    );
  };

  return (
    <div className="flex font-sans bg-white min-h-screen mb-8 mr-32 ml-32 gap-12">
      
      <nav className="w-full md:w-80 bg-gray-100 p-8 md:sticky md:top-0 md:h-screen md:overflow-y-auto border-b md:border-b-0 md:border-r border-gray-300 shrink-0">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Guide for authors</h1>
        <div className="space-y-6">
          {navGroups.map(group => (
            <div key={group.groupTitle}>
              <a
                href={`#${group.links[0].id}`}
                onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  e.preventDefault();
                  scrollToSection(group.links[0].id);
                }}
                className="text-sm font-bold text-blue-700 mb-3 block transition-all duration-200 no-underline hover:underline hover:decoration-orange-500 hover:decoration-2 hover:underline-offset-4"
              >
                {group.groupTitle}
              </a>
              <ul className="space-y-0 list-disc pl-5 marker:text-blue-400">
                {group.links.map(link => (
                  <li key={link.id}>
                    <a
                      href={`#${link.id}`}
                      onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                        e.preventDefault();
                        scrollToSection(link.id);
                      }}
                      className={`text-sm transition-all duration-200 no-underline ${
                        activeSection === link.id
                          ? 'text-blue-700 font-semibold hover:underline hover:decoration-orange-500 hover:decoration-2 hover:underline-offset-4'
                          : 'text-blue-600 hover:underline hover:decoration-orange-500 hover:decoration-2 hover:underline-offset-4'
                      }`}
                    >
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </nav>

      <div className="flex-1 flex flex-col text-sm">
        <div className="sticky top-0 bg-white border-b border-gray-200 pl-20 pr-8 py-4 flex justify-end gap-4 z-10">
          <button className="px-6 py-2 text-blue-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors text-sm font-medium">
            Print Guide as PDF
          </button>
          <button className="px-6 py-2 text-blue-600 border-2 border-blue-600 rounded hover:bg-blue-50 transition-colors text-sm font-medium">
            Compare journals ↗
          </button>
        </div>

        {/* <main 
          ref={mainContentRef} 
          className="flex-1 md:h-screen md:overflow-y-auto scroll-smooth"
        >
          <div className="pl-20 pr-8 pt-16 pb-12">
            {contentSections.map(item => (
              <section 
                key={item.id} 
                id={item.id} 
                className="mb-16 scroll-mt-20"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  {item.title}
                </h2>
                <PlaceholderContent sectionId={item.id} />

                {item.subsections && (
                  <div className="space-y-12 mt-12">
                    {item.subsections.map(subItem => (
                      <section
                        key={subItem.id}
                        id={subItem.id}
                        className="scroll-mt-20"
                      >
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                          {subItem.title}
                        </h3>
                        <PlaceholderContent sectionId={subItem.id} />
                      </section>
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>
        </main> */}
        <main 
  ref={mainContentRef} 
  className="flex-1 md:h-screen md:overflow-y-auto scroll-smooth"
>
  <div className="pl-20 pr-8 pt-16 pb-12">
    {contentSections.map(item => (
      <section 
        key={item.id} 
        id={item.id} 
        className={`mb-8 scroll-mt-20`} // Reduced margin-bottom from 16 to 8
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4"> {/* Reduced margin-bottom from 6 to 4 */}
          {item.title}
        </h2>
        <PlaceholderContent sectionId={item.id} />

        {item.subsections && (
          <div className="space-y-8 mt-8"> {/* Reduced spacing between subsections */}
            {item.subsections.map(subItem => (
              <section
                key={subItem.id}
                id={subItem.id}
                className="scroll-mt-20"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {subItem.title}
                </h3>
              </section>
            ))}
          </div>
        )}
      </section>
    ))}
  </div>
</main>
      </div>
    </div>
  );
}
