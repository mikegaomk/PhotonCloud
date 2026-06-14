import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type { PhotonicsChip } from '../data/photonicsData'

interface ChipCardProps {
  chip: PhotonicsChip
}

export default function ChipCard({ chip }: ChipCardProps) {
  return (
    <Link to={`/chips/${chip.id}`} className="card group cursor-pointer">
      <div className="flex items-center justify-between mb-4">
        <div
          className="chip-tag"
          style={{ backgroundColor: chip.bgColor, color: chip.color }}
        >
          {chip.category}
        </div>
        <ArrowRight
          className="h-4 w-4 text-gray-400 group-hover:text-indigo-500 transition-colors"
        />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-1">{chip.name}</h3>
      <p className="text-sm text-gray-500 mb-3">{chip.fullName}</p>
      <p className="text-sm text-gray-600 line-clamp-3">{chip.description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {chip.applications.slice(0, 3).map((app) => (
          <span
            key={app}
            className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
          >
            {app}
          </span>
        ))}
      </div>
    </Link>
  )
}
