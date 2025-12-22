import React from 'react';
import { Article } from '../data/mockData';
import { FileText } from 'lucide-react';

interface ArticleGridCardProps {
  article: Article;
}

const ArticleGridCard: React.FC<ArticleGridCardProps> = ({ article }) => {
  return (
    <div className="flex flex-col">
      <div className="text-xs text-gray-500 mb-2">
        <span>{article.type}</span>
        <span className="mx-1">•</span>
        <span className={article.access === 'Open access' ? 'text-green-600' : ''}>{article.access}</span>
      </div>
      <h4 className="text-md font-bold text-brand-blue hover:underline cursor-pointer flex-grow">
        {article.title}
      </h4>
      <p className="text-sm text-gray-600 mt-2">{article.authors}</p>
      <p className="text-sm text-gray-500 mt-1">{article.date}</p>
      {article.pdf && (
        <a href="#" className="text-sm text-brand-blue hover:underline mt-3 flex items-center gap-1 font-semibold">
          <FileText size={16} className="text-red-600" /> View PDF
        </a>
      )}
    </div>
  );
};

export default ArticleGridCard;
