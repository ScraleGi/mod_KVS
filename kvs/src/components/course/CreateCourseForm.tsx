"use client"
import { useState } from "react"
import { CreateCourseFormProps } from "@/types/query-models"
import { formatDateISO } from "@/lib/utils"
import { useToaster } from '@/components/ui/toaster';
import CancelButton from '@/components/cancelButton/cancelButton';
import TrainerSearchBox from "../forms/TrainerSearchBox"

export default function CreateCourseForm({
  id,
  course,
  trainers,
  programs,
  onSubmit,
}: CreateCourseFormProps) {
  const [mainTrainerId, setMainTrainerId] = useState<string>(course?.mainTrainer?.id || "")
  const [additionalTrainerIds, setAdditionalTrainerIds] = useState<string[]>(
    course?.trainers?.map(t => t.id).filter(id => id !== course?.mainTrainer?.id) || []
  )
  const [programId, setProgramId] = useState(course?.program?.id || "")
  const { showToast } = useToaster();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const code = form.code.value.trim();
    const startDate = form.startDate.value;
    const endDate = form.endDate.value;

  if (!code || !programId || !startDate || !endDate || !mainTrainerId) {
    showToast('Bitte alle Pflichtfelder ausfüllen.', 'info');
    return;
  }
  // Wenn alles ausgefüllt, rufe das ursprüngliche onSubmit auf
    onSubmit(new FormData(form));
  };

  const isEditing = Boolean(id)
  const buttonText = isEditing ? "Aktualisieren" : "Kurs erstellen"

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Course Code */}
      <div className="space-y-1">
        <label htmlFor="code" className="block text-xs font-medium text-gray-600">
          Kurs-Code
        </label>
        <input
          id="code"
          name="code"
          type="text"
          defaultValue={course?.code || ""}
          placeholder="Kurs-Code einfügen"
          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>
      {/* Program */}
      <div className="space-y-1">
        <label htmlFor="programId" className="block text-xs font-medium text-gray-600">
          Programm
        </label>
        <select
          id="programId"
          name="programId"
          value={programId}
          onChange={e => setProgramId(e.target.value)}
          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        >
          <option value="" disabled>Programm wählen</option>
          {programs.map((program) => (
            <option key={program.id} value={program.id}>{program.name}</option>
          ))}
        </select>
      </div>
      <div className="space-y-1">
        <label htmlFor="startDate" className="block text-xs font-medium text-gray-600">
          Start Datum
        </label>
        <input
          id="startDate"
          name="startDate"
          type="date"
          defaultValue={formatDateISO(course?.startDate)}
          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>
      <div className="space-y-1">
        <label htmlFor="endDate" className="block text-xs font-medium text-gray-600">
          End Datum
        </label>
        <input
          id="endDate"
          name="endDate"
          type="date"
          defaultValue={formatDateISO(course?.endDate)}
          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>

      {/* Main Trainer Searchbox */}
      <TrainerSearchBox
        label="Trainer (Haupttrainer)"
        trainers={trainers}
        selected={mainTrainerId}
        onChange={id => {
          setMainTrainerId(id as string)
          setAdditionalTrainerIds(ids => ids.filter(aid => aid !== id))
        }}
        excludeIds={additionalTrainerIds}
      />

      {/* Additional Trainer Searchbox */}
      <TrainerSearchBox
        label="Co-Trainer"
        trainers={trainers}
        selected={additionalTrainerIds}
        onChange={value => setAdditionalTrainerIds(Array.isArray(value) ? value : [value])}
        multi
        excludeIds={mainTrainerId ? [mainTrainerId] : []}
      />

      {/* Hidden Inputs for backend */}
      <input type="hidden" name="mainTrainerId" value={mainTrainerId} />
      {additionalTrainerIds.map(id => (
        <input key={id} type="hidden" name="trainerIds" value={id} />
      ))}

      

      <div className="pt-2 flex items-center justify-between">
        <CancelButton>Abbrechen</CancelButton>
        <button
          type="submit"
          className="cursor-pointer inline-flex items-center px-5 py-2 border border-transparent text-xs font-semibold rounded text-white bg-blue-600 hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {buttonText}
        </button>
        
      </div>
    </form>
  )
}