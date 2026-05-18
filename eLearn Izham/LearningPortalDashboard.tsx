import React, { useMemo, useState } from 'react';

interface LectureNote {
  id: string;
  title: string;
  uploadDate: string;
  fileUrl: string;
}

interface Subject {
  id: string;
  code: string;
  name: string;
  instructor: string;
  notes: LectureNote[];
}

const subjects: Subject[] = [
  {
    id: 'subject-1',
    code: 'CS301',
    name: 'Operating Systems',
    instructor: 'Dr. Ayesha Khan',
    notes: [
      {
        id: 'os-1',
        title: 'Process Scheduling and CPU Management',
        uploadDate: '2026-05-05',
        fileUrl: '#',
      },
      {
        id: 'os-2',
        title: 'Memory Segmentation and Paging',
        uploadDate: '2026-05-08',
        fileUrl: '#',
      },
      {
        id: 'os-3',
        title: 'Synchronization and Deadlock Handling',
        uploadDate: '2026-05-12',
        fileUrl: '#',
      },
      {
        id: 'os-4',
        title: 'File System Design Patterns',
        uploadDate: '2026-05-16',
        fileUrl: '#',
      },
    ],
  },
  {
    id: 'subject-2',
    code: 'WD204',
    name: 'Web Development',
    instructor: 'Prof. Maryam Rauf',
    notes: [
      {
        id: 'wd-1',
        title: 'Responsive Layouts with Tailwind CSS',
        uploadDate: '2026-05-03',
        fileUrl: '#',
      },
      {
        id: 'wd-2',
        title: 'React Component Patterns',
        uploadDate: '2026-05-09',
        fileUrl: '#',
      },
      {
        id: 'wd-3',
        title: 'State Management in Modern Applications',
        uploadDate: '2026-05-13',
        fileUrl: '#',
      },
      {
        id: 'wd-4',
        title: 'Web Accessibility Best Practices',
        uploadDate: '2026-05-17',
        fileUrl: '#',
      },
    ],
  },
  {
    id: 'subject-3',
    code: 'DB212',
    name: 'Database Systems',
    instructor: 'Dr. Salman Tariq',
    notes: [
      {
        id: 'db-1',
        title: 'Relational Database Normalization',
        uploadDate: '2026-05-02',
        fileUrl: '#',
      },
      {
        id: 'db-2',
        title: 'SQL Joins and Query Optimization',
        uploadDate: '2026-05-10',
        fileUrl: '#',
      },
      {
        id: 'db-3',
        title: 'Transaction Control and Concurrency',
        uploadDate: '2026-05-14',
        fileUrl: '#',
      },
      {
        id: 'db-4',
        title: 'NoSQL Use Cases and Indexing',
        uploadDate: '2026-05-18',
        fileUrl: '#',
      },
    ],
  },
  {
    id: 'subject-4',
    code: 'CN220',
    name: 'Computer Networks',
    instructor: 'Prof. Hira Ali',
    notes: [
      {
        id: 'cn-1',
        title: 'Network Layer Fundamentals',
        uploadDate: '2026-05-04',
        fileUrl: '#',
      },
      {
        id: 'cn-2',
        title: 'TCP vs UDP and Transport Protocols',
        uploadDate: '2026-05-11',
        fileUrl: '#',
      },
      {
        id: 'cn-3',
        title: 'Wireless Networking Essentials',
        uploadDate: '2026-05-15',
        fileUrl: '#',
      },
      {
        id: 'cn-4',
        title: 'Network Security Principles',
        uploadDate: '2026-05-19',
        fileUrl: '#',
      },
    ],
  },
];

const LearningPortalDashboard: React.FC = () => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0].id);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const selectedSubject = useMemo(
    () => subjects.find((subject) => subject.id === selectedSubjectId) ?? subjects[0],
    [selectedSubjectId]
  );

  const filteredNotes = useMemo(
    () =>
      selectedSubject.notes.filter((note) =>
        note.title.toLowerCase().includes(searchQuery.trim().toLowerCase())
      ),
    [selectedSubject.notes, searchQuery]
  );

  const handleViewNote = (note: LectureNote) => {
    console.log(`Viewing note: ${note.title} (${note.fileUrl})`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-slate-100/90 py-5 shadow-sm backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 sm:px-8">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Student Learning Portal</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
              Learning Portal Dashboard
            </h1>
          </div>
          <div className="rounded-2xl bg-indigo-600 px-4 py-3 text-white shadow-lg shadow-indigo-200/30 sm:px-5">
            <p className="text-sm font-semibold">4 Subscribed Subjects</p>
            <p className="text-xs text-indigo-100">Keep track of lecture notes in one place.</p>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-6 px-6 py-8 sm:px-8 lg:grid-cols-[320px_1fr]">
        <aside className="space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-100">
            <h2 className="text-lg font-semibold text-slate-900">Your Subjects</h2>
            <p className="mt-2 text-sm text-slate-500">
              Select a subject to explore lecture notes and review content.
            </p>
          </div>

          <div className="space-y-3">
            {subjects.map((subject) => {
              const isSelected = selectedSubjectId === subject.id;
              return (
                <button
                  key={subject.id}
                  type="button"
                  onClick={() => setSelectedSubjectId(subject.id)}
                  className={`w-full rounded-3xl border p-5 text-left transition duration-200 ${
                    isSelected
                      ? 'border-indigo-400 bg-indigo-50 shadow-md shadow-indigo-100'
                      : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-indigo-700">
                        {subject.code}
                      </p>
                      <h3 className="mt-3 text-xl font-semibold text-slate-900">{subject.name}</h3>
                    </div>
                    <span className="inline-flex rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                      {subject.notes.length} Notes
                    </span>
                  </div>
                  <p className="mt-4 text-sm text-slate-500">Instructor: {subject.instructor}</p>
                </button>
              );
            })}
          </div>
        </aside>

        <section className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-100">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-indigo-600">
                  Selected Subject
                </p>
                <h2 className="mt-3 text-3xl font-semibold text-slate-900">{selectedSubject.name}</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                  Instructor: {selectedSubject.instructor} • {selectedSubject.notes.length} lecture notes available.
                </p>
              </div>
              <div className="rounded-3xl bg-indigo-50 px-4 py-3 text-indigo-700 shadow-inner shadow-indigo-100/40">
                <p className="text-sm font-medium">Subject Code</p>
                <p className="mt-1 text-2xl font-semibold">{selectedSubject.code}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-100">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Lecture Notes
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-slate-900">Search within notes</h3>
                </div>
                <div className="mt-4 sm:mt-0">
                  <label htmlFor="note-search" className="sr-only">
                    Search notes by title
                  </label>
                  <input
                    id="note-search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search lecture notes..."
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 sm:w-80"
                  />
                </div>
              </div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-600 shadow-sm shadow-slate-100">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Quick Tips</p>
              <ul className="mt-4 space-y-3 text-sm leading-6">
                <li className="rounded-2xl bg-slate-50 p-4">Use the search bar to filter lecture titles instantly.</li>
                <li className="rounded-2xl bg-slate-50 p-4">Click a subject on the left to switch content quickly.</li>
                <li className="rounded-2xl bg-slate-50 p-4">View or download notes directly from the notes list.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-100">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-semibold text-slate-900">Available Notes</h3>
                <p className="mt-2 text-sm text-slate-500">
                  {filteredNotes.length} result{filteredNotes.length !== 1 ? 's' : ''} for "{searchQuery || 'all notes'}"
                </p>
              </div>
              <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                {selectedSubject.notes.length} Total Notes
              </span>
            </div>

            <div className="space-y-4">
              {filteredNotes.map((note) => (
                <article
                  key={note.id}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-5 transition hover:border-indigo-300 hover:bg-slate-100"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-indigo-700">Lecture Note</p>
                      <h4 className="mt-2 text-xl font-semibold text-slate-900">{note.title}</h4>
                      <p className="mt-2 text-sm text-slate-600">Uploaded: {note.uploadDate}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleViewNote(note)}
                      className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    >
                      View Note
                    </button>
                  </div>
                </article>
              ))}

              {filteredNotes.length === 0 && (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
                  No lecture notes match your search. Try a different keyword.
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LearningPortalDashboard;
