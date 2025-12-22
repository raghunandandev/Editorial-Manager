import React from 'react';

const EditorInChief: React.FC = () => {
  return (
    <section className="bg-brand-blue text-white py-8 w-full">
      <div className="flex flex-col gap-8 w-full">
        <div className="flex justify-between items-center mb-6 px-4">
          <h3 className="text-xl font-bold">Editor-in-Chief</h3>
          <a href="#" className="text-sm font-semibold hover:underline">View full editorial board</a>
        </div>
        <div className="flex items-center gap-6 px-4">
          <div className="bg-white rounded-full p-1">
            <img src="https://i.ibb.co/G03gCjD/prof-xhafa.jpg" alt="Professor F. Xhafa" className="h-24 w-24 rounded-full object-cover" />
          </div>
          <div>
            <p className="font-bold text-lg">Professor F. Xhafa</p>
            <p className="text-sm text-gray-300">Universitat Politècnica de Catalunya, Barcelona, Spain</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditorInChief;
