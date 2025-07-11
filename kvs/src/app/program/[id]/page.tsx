import React from 'react';
import Link from 'next/link';
import ProgramToaster from './ProgramToaster';
import { Info, GraduationCap, Pencil } from 'lucide-react';
import { db } from '@/lib/db';
import { sanitize } from '@/lib/sanitize';

export default async function ProgramPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  try {
    const { id } = await params;

    const programData = await db.program.findUnique({
      where: { id },
      include: {
        area: { select: { name: true } },
        course: {
          where: { deletedAt: null },
          include: {
            mainTrainer: true,
            registrations: { 
              where: { 
                deletedAt: null,
                participant: {
                  deletedAt: null // Filter out registrations with soft-deleted participants
                }
              },
              include: { participant: true } 
            }
          },
          orderBy: { startDate: 'asc' }
        }
      }
    });

    // Sanitize data to handle Decimal values properly
    const program = sanitize(programData);

    if (!program) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafd]">
          <div className="max-w-2xl w-full mx-auto bg-white rounded-2xl shadow px-8 py-10">
            <Link href="/program" className="text-blue-700 hover:underline mb-6 block">
              &larr; Back to Programs
            </Link>
            <div className="text-red-600 text-lg font-semibold">Program not found.</div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafd]">
        <ProgramToaster />
        {/* Breadcrumb navigation */}
        <nav className="w-full max-w-3xl mb-6 text-sm text-gray-500 flex items-center gap-2 px-2">
          <Link href="/area" className="hover:underline">Areas</Link>
          <span>&gt;</span>
          <Link href="/program" className="hover:underline">Programs</Link>
          <span>&gt;</span>
          <span className="text-gray-700">{program.name}</span>
        </nav>
        
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg px-8 py-10 relative">
          {/* Edit Link */}
          <Link
            href={`/program/${program.id}/edit`}
            className="absolute top-6 right-6 text-gray-400 hover:text-blue-600 transition"
            title="Edit Program"
          >
            <Pencil className="w-5 h-5" />
          </Link>
          
          {/* Title */}
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 drop-shadow-sm">{program.name}</h1>

          {/* Info Line */}
          <div className="flex flex-wrap justify-center gap-6 text-base mb-8 text-gray-600">
            <div><b>Area:</b> {program.area?.name ?? 'Unknown'}</div>
            <div><b>Units:</b> {program.teachingUnits ?? 'N/A'}</div>
            <div><b>Price:</b> {program.price ? `€${program.price}` : 'N/A'}</div>
            <div><b>Created:</b> {new Date(program.createdAt).toLocaleDateString()}</div>
          </div>

          <hr className="my-6 border-gray-200" />

          {/* Program Description */}
          <h2 className="text-xl font-bold mb-2 text-gray-600 flex items-center gap-2">
            <Info className="w-5 h-5 text-gray-400" />
            Program Description
          </h2>
          <div className="mb-8 text-gray-700">
            {program.description
              ? <span className="block ml-7">{program.description}</span>
              : <span className="italic text-gray-400 block ml-7">No description provided.</span>
            }
          </div>

          <hr className="my-6 border-gray-200" />

          {/* Courses List */}
          <h2 className="text-xl font-bold mb-2 text-gray-600 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-gray-400" />
            Courses for this Program
          </h2>
          {program.course.length === 0 ? (
            <div className="text-gray-400 italic ml-7">No courses for this program.</div>
          ) : (
            <ul className="space-y-2 ml-2">
              {program.course.map(course => (
                <li key={course.id} className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-blue-50 transition border border-gray-100">
                  <div>
                    <Link href={`/course/${course.id}`} className="font-semibold text-blue-700 hover:underline mb-2 block">
                      {course.code || program.name}
                    </Link>
                    <div className="text-sm text-gray-500 space-y-2">
                      <div>
                        Start Date: {course.startDate ? new Date(course.startDate).toLocaleDateString() : "N/A"}
                      </div>
                      <div>
                        Main Trainer: {course.mainTrainer ? `${course.mainTrainer.name} ${course.mainTrainer.surname}` : "N/A"}
                      </div>
                    </div>
                  </div>
                  <span className="inline-block mt-14 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                    Participants: {course.registrations.length || 0}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Failed to load program:', error);
    
    // Error state
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafd]">
        <div className="max-w-2xl w-full mx-auto bg-white rounded-2xl shadow px-8 py-10">
          <Link href="/program" className="text-blue-700 hover:underline mb-6 block">
            &larr; Back to Programs
          </Link>
          <div className="text-red-600 text-lg font-semibold">
            An error occurred while loading the program. Please try again.
          </div>
        </div>
      </div>
    );
  }
}