import { FileText } from 'lucide-react';

export const timelineStats = [
  { value: "4 days", label: "Submission to first decision" },
  { value: "54 days", label: "Submission to decision after review" },
  { value: "116 days", label: "Submission to acceptance" },
  { value: "6 days", label: "Acceptance to online publication" },
];

export interface Article {
  type: 'Research article' | 'Review article';
  access: 'Open access' | 'Abstract only';
  title: string;
  authors: string;
  date: string;
  pdf?: boolean;
}

export const articles: Article[] = [
  { type: 'Research article', access: 'Open access', title: 'Soil moisture estimation using continuous wave radar', authors: 'Hui Huang, ... Radu State', date: 'November 2025', pdf: true },
  { type: 'Research article', access: 'Abstract only', title: 'SEACount: Semantic-driven Exemplar query Attention framework for image boosting class-agnostic Counting in Internet of Things', authors: 'Xinhui Lin, ... Zhaowei Liu', date: 'November 2025' },
  { type: 'Research article', access: 'Open access', title: 'Visualisation of movement patterns supporting teacher reflection - qualitative analysis of educational benefits of IoT in the classroom', authors: 'Patrik Hernwall, Robert Ramberg', date: 'November 2025', pdf: true },
  { type: 'Research article', access: 'Abstract only', title: 'Fusion-based congestion control method for the power internet of things combining data-driven and rule-engine models', authors: 'Chunxin Weng, ... Ying Zou', date: 'November 2025' },
  { type: 'Research article', access: 'Abstract only', title: 'Efficient IoT indoor monitoring via distributed deep learning in hybrid VLC/RF network architectures', authors: 'Thai-Ha Dang, ... Viet-Thang Tran', date: 'November 2025' },
  { type: 'Research article', access: 'Abstract only', title: 'Hybrid CNN-LSTM model for predicting nitrogen, phosphorus, and potassium (NPK) fertilization requirements', authors: 'Abdellatif Moussaid, ... Hamza Briak', date: 'November 2025' },
];

export interface CallForPaper {
    title: string;
    editors: string;
    description: string;
    deadline: string;
}

export const callsForPapers: CallForPaper[] = [
    {
        title: '"Resilient & Sustainable Smart Communities" Extended Best Papers from IEEE ISC2-2025',
        editors: 'Guest editors: Joannis Chatzigiannakis, Luis Muñoz, Georgios Mylonas',
        description: 'The International Smart Cities Conference ISC2 is the flagship IEEE conference for Smart Cities, sponsored by the IEEE Smart Cities Community and the IEEE Power & Energy Society. ISC2 is a highly selective conference that brings together academic ...',
        deadline: '15 December 2025'
    },
    {
        title: '"Advances in Internet-of-Things Systems and Services" Extended Best Papers from AINA-2025',
        editors: 'Guest editors: Santi Caballé; Leonard Barolli.',
        description: 'The 39th International Conference on Advanced Information Networking and Applications (AINA-2025), held at the Open University of Catalonia (UOC) in Barcelona, Spain, showcased cutting-edge research that pushes the boundaries of the Internet of ...',
        deadline: '15 September 2025'
    },
    {
        title: 'Internet of Things and Machine Learning in Smart Agriculture',
        editors: 'Guest editors: Antonino Pagano; Ilenia Tinnirello; Stefano Giordano; Giacomo Morabito.',
        description: 'In the near future, the agricultural sector is called upon to face a significant challenge due to increasingly scarce resources, extreme weather conditions, population growth, and the reduction of cultivable land.',
        deadline: '01 May 2026'
    }
];

export interface SpecialIssue {
    title: string;
    editors: string;
    date: string;
}

export const specialIssues: SpecialIssue[] = [
    { title: 'Internet of Things and Machine Learning in Smart Agriculture', editors: 'Edited by Dr. Antonino Pagano, Professor Ilenia Tinnirello, Dr. Stefano Giordano, Dr. Morabito', date: '23 June 2025' },
    { title: 'Collective Intelligence for the Internet of Things', editors: 'Edited by Dr. Javier Berrocal, Dr. Niko Mäkitalo, Dr. Roberto Morabito, Dr. Christine Julien', date: '26 May 2025' },
    { title: 'Explainable AI for Industrial Information Integration in Industrial IoT (IIoT)', editors: 'Edited by Dr. Honghai Liu, Dr. Anna Kobusinska, Dr. Peng Liu', date: '5 May 2025' },
    { title: 'Advances in Internet of Fuzzy Things', editors: 'Edited by Professor Phan Cong Vinh, Professor Ha Quang Thinh Ngo', date: '5 May 2025' }
]
