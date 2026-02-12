import React from 'react';
import { WorksheetDataL1 } from '../types';
import { PracticeCheckbox } from './PracticeCheckbox';
import { StudentInputArea } from './StudentInputArea';

interface Props {
  data: WorksheetDataL1;
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

const ExampleDisplay: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
        <span className="font-bold text-sm text-indigo-600 block mb-1">Example:</span>
        <div className="text-slate-600">{children}</div>
    </div>
);


export const WorksheetLevel1: React.FC<Props> = ({ data, image }) => {
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
                    <p className="text-slate-500 font-medium mt-1">SELF-DIRECTED ENGLISH VOCABULARY LEARNING (LEVEL 1)</p>
                    <div className="mt-4 inline-block bg-amber-200 text-amber-800 font-semibold px-4 py-2 rounded-md text-md">
                        Korean Meaning: {data.koreanMeaning}
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
            <WorksheetSection number={1} title="Write the word 3 times">
                <div className="p-3">
                    <ExampleDisplay>
                        <div className="text-2xl font-mono tracking-widest space-x-6">
                            {Array.isArray(data.wordRepetitions) && data.wordRepetitions.length > 0
                                ? data.wordRepetitions.map((w, i) => <span key={i}>{w}</span>)
                                : <span className="text-slate-400 text-base">N/A</span>}
                        </div>
                    </ExampleDisplay>
                    <div className="mt-4">
                        <h4 className="font-semibold text-sm text-slate-600 mb-1 pl-3">Your Turn:</h4>
                        <StudentInputArea type="english-notebook" rows={3} />
                    </div>
                </div>
            </WorksheetSection>

            <WorksheetSection number={2} title="Write down example sentences">
                 <div className="p-3">
                    <ExampleDisplay>
                        <ul className="list-disc list-inside space-y-2">
                            {Array.isArray(data.exampleSentences) && data.exampleSentences.length > 0
                                ? data.exampleSentences.map((s, i) => <li key={i}>{s}</li>)
                                : <li>N/A</li>}
                        </ul>
                    </ExampleDisplay>
                    <div className="mt-4">
                        <h4 className="font-semibold text-sm text-slate-600 mb-1 pl-3">Your Turn:</h4>
                        <StudentInputArea type="english-notebook" rows={2} />
                    </div>
                 </div>
            </WorksheetSection>
            
            <WorksheetSection number={3} title="Change the sentence">
                 <div className="p-3">
                    <ExampleDisplay>
                        <p>{data.changedSentence || 'N/A'}</p>
                    </ExampleDisplay>
                    <div className="mt-4">
                        <h4 className="font-semibold text-sm text-slate-600 mb-1 pl-3">Your Turn:</h4>
                        <StudentInputArea type="english-notebook" rows={1} />
                    </div>
                </div>
            </WorksheetSection>

            <WorksheetSection number={4} title="Make your own simple sentence">
                 <div className="p-3">
                    <ExampleDisplay>
                        <p>{data.ownSimpleSentence || 'N/A'}</p>
                    </ExampleDisplay>
                    <div className="mt-4">
                        <h4 className="font-semibold text-sm text-slate-600 mb-1 pl-3">Your Turn:</h4>
                        <StudentInputArea type="english-notebook" rows={2} />
                    </div>
                </div>
            </WorksheetSection>

            <WorksheetSection number={5} title="Say your word (Check the boxes as you practice)">
                <div className="p-3 flex space-x-2">
                    {[...Array(5)].map((_, i) => <PracticeCheckbox key={i} />)}
                </div>
            </WorksheetSection>

            <WorksheetSection number={6} title="Say your sentence and Record it (Check the boxes as you practice)">
                 <div className="p-3 flex space-x-2">
                    {[...Array(5)].map((_, i) => <PracticeCheckbox key={i} />)}
                </div>
            </WorksheetSection>

            <WorksheetSection number={7} title="Find sentences using the word (proverbs, quotes, etc.)">
                <div className="p-3">
                    <ExampleDisplay>
                        <p className="italic">{data.usageExamples || 'N/A'}</p>
                    </ExampleDisplay>
                    <div className="mt-4">
                        <h4 className="font-semibold text-sm text-slate-600 mb-1 pl-3">Your Turn:</h4>
                        <StudentInputArea type="lined" rows={3}/>
                    </div>
                </div>
            </WorksheetSection>
        </main>
    </div>
  );
};