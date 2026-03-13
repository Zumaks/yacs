import React from "react";
import { Spinner } from "@/components/ui/spinner";
import { useSchedule } from "../context/schedule-context";
import ScheduleList from "../components/ScheduleList";
import WeekScheduler from "../components/WeekScheduler";

export default function HomePage() {
  const { catalogLoading } = useSchedule();

  return (
    <main className="flex-1 p-4">
      <WeekScheduler events={[]} startHour={8} endHour={20} showWeekend={false} />
      {catalogLoading ? (
        <section className="mx-auto mt-6 flex max-w-5xl items-center justify-center rounded-xl border border-border bg-surface/40 px-6 py-10">
          <div className="flex flex-col items-center gap-3 text-center">
            <Spinner size="lg" label="Loading courses" />
            <div>
              <h2 className="text-lg font-semibold text-foreground">Loading courses</h2>
              <p className="text-sm text-foreground/70">Pulling the catalog into your schedule workspace.</p>
            </div>
          </div>
        </section>
      ) : (
        <ScheduleList />
      )}
    </main>
  );
}
