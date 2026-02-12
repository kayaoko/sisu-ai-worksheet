import React from 'react';
import { WorksheetDataL3 } from '../types';
import { StudentInputArea } from './StudentInputArea';

interface Props {
  data: WorksheetDataL3;
  image: string | null;
}

const WorksheetSection: React.FC<{ number: number; title: string; children: React.ReactNode }> = ({ number, title, children }) => (
    <div className="py-4">
        <h3 className="text-lg font-semibold text-slate-700 mb-2">
            <span className="bg-indigo-100 text-indigo-700 font-bold rounded-full w-8 h-8 inline-flex items-center justify-center mr-3">{number}</span>
            {title}
        </h3>
        <div className="pl-11 border-l-2 border-slate-200 ml-4">{children}</div>
    </div>
);

const ExampleDisplay: React.FC<{ children: React.ReactNode; isInfo?: boolean }> = ({ children, isInfo = false }) => (
    <div className={`p-3 rounded-lg ${!isInfo ? 'bg-slate-50 border border-slate-200' : ''}`}>
        {!isInfo && <span className="font-bold text-sm text-indigo-600 block mb-1">Example:</span>}
        <div className="text-slate-600">{children}</div>
    </div>
);


export const WorksheetLevel3: React.FC<Props> = ({ data, image }) => {
  return (
     <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 animate-fade-in">
        <header className="border-b-2 border-slate-900 pb-4 mb-4">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-5xl font-black tracking-tighter">WORD: <span className="text-indigo-600">{data.word}</span></h2>
                    <div className="flex flex-wrap items-center gap-x-4 mt-2 text-slate-600">
                        <span className="font-mono text-lg bg-slate-100 px-2 py-1 rounded">IPA: {data.ipa || 'N/A'}</span>
                        <span className="font-semibold text-lg bg-slate-100 px-2 py-1 rounded">Pronunciation: {data.phoneticSpelling || 'N/A'}</span>
                    </div>
                    <p className="text-slate-500 font-medium mt-1">SELF-DIRECTED ENGLISH VOCABULARY LEARNING (LEVEL 3)</p>
                     <div className="mt-4 flex flex-wrap gap-4 text-md">
                        <div className="bg-amber-200 text-amber-800 font-semibold px-4 py-2 rounded-md">Part of Speech: {data.partOfSpeech || 'N/A'}</div>
                        <div className="bg-amber-200 text-amber-800 font-semibold px-4 py-2 rounded-md">Korean Translation: {data.koreanMeaning}</div>
                    </div>
                </div>
                 {image ? (
                    <img src={image} alt={data.word} className="w-36 h-36 rounded-lg border-4 border-slate-200 object-cover shadow-sm" />
                ) : (
                    <div className="w-36 h-36 rounded-lg border-2 border-dashed border-slate-300 bg-slate-100 flex items-center justify-center text-slate-400">No Image</div>
                )}
            </div>
        </header>

        <main className="divide-y divide-slate-200">
            <WorksheetSection number={1} title="Definition (English)">
                <ExampleDisplay isInfo={true}>
                    <p>{data.definition || 'N/A'}</p>
                </ExampleDisplay>
            </WorksheetSection>
            
            <WorksheetSection number={2} title="My example sentence">
                <div className="p-3">
                    <ExampleDisplay>
                        <p>{data.exampleSentence || 'N/A'}</p>
                    </ExampleDisplay>
                    <div className="mt-4">
                        <h4 className="font-semibold text-sm text-slate-600 mb-1 pl-3">Your Turn:</h4>
                        <StudentInputArea type="lined" rows={2} />
                    </div>
                </div>
            </WorksheetSection>

            <WorksheetSection number={3} title="Real-life situation (Write a daily life sentence)">
                <div className="p-3">
                    <ExampleDisplay>
                        <p>{data.realLifeSentence || 'N/A'}</p>
                    </ExampleDisplay>
                    <div className="mt-4">
                        <h4 className="font-semibold text-sm text-slate-600 mb-1 pl-3">Your Turn:</h4>
                        <StudentInputArea type="lined" rows={3} />
                    </div>
                </div>
            </WorksheetSection>

            <WorksheetSection number={4} title="Short paragraph (Record yourself reading - Conversation type, 3-5 sentences)">
                <div className="p-3">
                    <ExampleDisplay>
                        <p className="leading-relaxed">{data.shortParagraph || 'N/A'}</p>
                    </ExampleDisplay>
                     <div className="mt-4">
                        <h4 className="font-semibold text-sm text-slate-600 mb-1 pl-3">Your Turn:</h4>
                        <StudentInputArea type="lined" rows={5} />
                    </div>
                </div>
            </WorksheetSection>

            <WorksheetSection number={5} title="Where can you use this word?">
                <div className="p-3">
                    <ExampleDisplay>
                        <p>{data.usageContext || 'N/A'}</p>
                    </ExampleDisplay>
                    <div className="mt-4">
                        <h4 className="font-semibold text-sm text-slate-600 mb-1 pl-3">Your Turn:</h4>
                        <StudentInputArea type="lined" rows={3} />
                    </div>
                </div>
            </WorksheetSection>
            
            <WorksheetSection number={6} title="Synonym / Antonym">
                <div className="p-3">
                    <ExampleDisplay isInfo={true}>
                        <div className="space-y-2">
                            <div><span className="font-semibold text-sky-700">Synonyms:</span> {Array.isArray(data.synonyms) && data.synonyms.length > 0 ? data.synonyms.join(', ') : ' N/A'}</div>
                            <div><span className="font-semibold text-rose-700">Antonyms:</span> {Array.isArray(data.antonyms) && data.antonyms.length > 0 ? data.antonyms.join(', ') : ' N/A'}</div>
                        </div>
                    </ExampleDisplay>
                    <div className="mt-4">
                        <h4 className="font-semibold text-sm text-slate-600 mb-1 pl-3">Your Turn:</h4>
                        <StudentInputArea type="lined" rows={3} />
                    </div>
                </div>
            </WorksheetSection>

             <WorksheetSection number={7} title="Convert sentences based on grammar (2 types)">
                <div className="p-3">
                    <ExampleDisplay>
                         <ul className="list-decimal list-inside space-y-2">
                            {Array.isArray(data.grammarConversions) && data.grammarConversions.length > 0
                                ? data.grammarConversions.map((s, i) => <li key={i}>{s}</li>)
                                : <li>N/A</li>}
                        </ul>
                    </ExampleDisplay>
                    <div className="mt-4">
                        <h4 className="font-semibold text-sm text-slate-600 mb-1 pl-3">Your Turn:</h4>
                        <StudentInputArea type="lined" rows={2} />
                    </div>
                </div>
            </WorksheetSection>
        </main>
    </div>
  );
};