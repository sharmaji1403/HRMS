import { ClockIcon, CheckCircleIcon } from "lucide-react"

const ClockCard = ({ todayRecord, clocking, onClock }) => {
  const alreadyClockedOut = todayRecord?.checkOut

  return (
    <div className="card p-5 mb-6 flex items-center justify-between">
      <div>
        <p className="font-medium text-slate-800">
          {alreadyClockedOut ? "Attendance Complete" : todayRecord ? "Clock Out" : "Clock In"}
        </p>
        <p className="text-sm text-slate-500">
          {alreadyClockedOut ? "You've completed today's attendance" : todayRecord ? "End your work day" : "Start your work day"}
        </p>
      </div>

      {alreadyClockedOut ? (
        <div className="flex items-center gap-2 text-emerald-600 font-medium">
          <CheckCircleIcon size={18} />
          Done
        </div>
      ) : (
        <button
          onClick={onClock}
          disabled={clocking}
          className="btn-primary flex items-center gap-2 disabled:opacity-50"
        >
          <ClockIcon size={16} />
          {clocking ? "Please wait..." : todayRecord ? "Clock Out" : "Clock In"}
        </button>
      )}
    </div>
  )
}

export default ClockCard