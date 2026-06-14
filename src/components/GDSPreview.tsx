import { useState } from 'react'
import { ZoomIn, ZoomOut, RotateCw, Grid } from 'lucide-react'

interface GDSPreviewProps { component: string; params?: Record<string, number>; height?: number }

const LC: Record<string, { fill: string; stroke: string }> = {
  WG: { fill: '#3b82f6', stroke: '#1d4ed8' }, SLAB: { fill: '#93c5fd', stroke: '#60a5fa' },
  N: { fill: '#fca5a5', stroke: '#ef4444' }, P: { fill: '#86efac', stroke: '#22c55e' },
  HEATER: { fill: '#fbbf24', stroke: '#d97706' }, M1: { fill: '#a78bfa', stroke: '#7c3aed' },
  GE: { fill: '#f97316', stroke: '#c2410c' }, CLAD: { fill: '#e2e8f0', stroke: '#94a3b8' },
  LN: { fill: '#eab308', stroke: '#a16207' }, ELECTRODE: { fill: '#d4af37', stroke: '#996515' },
}

export default function GDSPreview({ component, params = {}, height = 300 }: GDSPreviewProps) {
  const [zoom, setZoom] = useState(1)
  const [showGrid, setShowGrid] = useState(true)
  const [rotation, setRotation] = useState(0)
  const width = 500

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-900">
      <div className="flex items-center justify-between px-3 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-1">
          <button onClick={() => setZoom((z) => Math.min(3, z + 0.3))} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded"><ZoomIn className="h-3.5 w-3.5" /></button>
          <button onClick={() => setZoom((z) => Math.max(0.3, z - 0.3))} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded"><ZoomOut className="h-3.5 w-3.5" /></button>
          <button onClick={() => setRotation((r) => (r + 90) % 360)} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded"><RotateCw className="h-3.5 w-3.5" /></button>
          <button onClick={() => setShowGrid(!showGrid)} className={`p-1.5 rounded ${showGrid ? 'text-blue-400 bg-gray-700' : 'text-gray-400'}`}><Grid className="h-3.5 w-3.5" /></button>
          <span className="text-xs text-gray-500 ml-2">{(zoom * 100).toFixed(0)}%</span>
        </div>
        <span className="text-xs text-gray-500 font-mono">{component}</span>
      </div>
      <div className="relative overflow-hidden" style={{ height }}>
        <svg width="100%" height="100%" viewBox={`${-width/2/zoom} ${-height/2/zoom} ${width/zoom} ${height/zoom}`} style={{ transform: `rotate(${rotation}deg)` }}>
          {showGrid && <g opacity="0.12">{Array.from({length:40},(_,i)=>{const p=(i-20)*10;return <g key={i}><line x1={p} y1={-200} x2={p} y2={200} stroke="#666" strokeWidth="0.3"/><line x1={-200} y1={p} x2={200} y2={p} stroke="#666" strokeWidth="0.3"/></g>})}</g>}
          {renderComponent(component, params)}
        </svg>
        <div className="absolute bottom-2 right-2 flex items-center gap-1 text-xs text-gray-500"><div className="w-10 h-0.5 bg-gray-500"/><span>{(20/zoom).toFixed(0)}μm</span></div>
      </div>
    </div>
  )
}

function renderComponent(comp: string, p: Record<string, number>) {
  switch (comp) {
    case 'straight': case 'strip_waveguide': {
      const w = (p.width||0.5)*20, l = Math.min(150,(p.length||100)*0.8)
      return <g><rect x={-l/2-5} y={-w*3} width={l+10} height={w*6} fill={LC.CLAD.fill} opacity={0.3}/><rect x={-l/2} y={-w/2} width={l} height={w} fill={LC.WG.fill} stroke={LC.WG.stroke} strokeWidth="0.5"/><circle cx={-l/2} cy={0} r={1.5} fill="#fff" opacity={0.8}/><circle cx={l/2} cy={0} r={1.5} fill="#fff" opacity={0.8}/></g>
    }
    case 'mmi1x2': {
      const wM=(p.width_mmi||6)*5, lM=(p.length_mmi||11)*4, wW=5
      return <g><rect x={-lM/2-25} y={-wW/2} width={25} height={wW} fill={LC.WG.fill}/><rect x={-lM/2} y={-wM/2} width={lM} height={wM} fill={LC.WG.fill} stroke={LC.WG.stroke} strokeWidth="0.5" rx={1}/><rect x={lM/2} y={-wM/4-wW/2} width={25} height={wW} fill={LC.WG.fill}/><rect x={lM/2} y={wM/4-wW/2} width={25} height={wW} fill={LC.WG.fill}/><circle cx={-lM/2-25} cy={0} r={1.5} fill="#fff" opacity={0.8}/><circle cx={lM/2+25} cy={-wM/4} r={1.5} fill="#fff" opacity={0.8}/><circle cx={lM/2+25} cy={wM/4} r={1.5} fill="#fff" opacity={0.8}/></g>
    }
    case 'mzi': case 'mzi_modulator': {
      const aL=Math.min(120,(p.arm_length||3)*30), wW=4
      return <g><rect x={-aL/2-15} y={-3} width={12} height={6} fill={LC.WG.fill} rx={1}/><rect x={-aL/2} y={-25-wW/2} width={aL} height={wW} fill={LC.WG.fill} stroke={LC.WG.stroke} strokeWidth="0.3"/><rect x={-aL/2} y={25-wW/2} width={aL} height={wW} fill={LC.WG.fill} stroke={LC.WG.stroke} strokeWidth="0.3"/><rect x={-aL/4} y={-25-wW-3} width={aL/2} height={3} fill={LC.N.fill} opacity={0.7}/><rect x={-aL/4} y={-25+wW/2} width={aL/2} height={3} fill={LC.P.fill} opacity={0.7}/><rect x={-aL/6} y={-25-wW-8} width={aL/3} height={2} fill={LC.HEATER.fill} rx={0.5}/><rect x={aL/2+3} y={-3} width={12} height={6} fill={LC.WG.fill} rx={1}/><line x1={-aL/2-3} y1={-3} x2={-aL/2} y2={-25} stroke={LC.WG.fill} strokeWidth={wW} strokeLinecap="round"/><line x1={-aL/2-3} y1={3} x2={-aL/2} y2={25} stroke={LC.WG.fill} strokeWidth={wW} strokeLinecap="round"/><line x1={aL/2} y1={-25} x2={aL/2+3} y2={-3} stroke={LC.WG.fill} strokeWidth={wW} strokeLinecap="round"/><line x1={aL/2} y1={25} x2={aL/2+3} y2={3} stroke={LC.WG.fill} strokeWidth={wW} strokeLinecap="round"/><circle cx={-aL/2-18} cy={0} r={2} fill="#fff" opacity={0.8}/><circle cx={aL/2+18} cy={0} r={2} fill="#fff" opacity={0.8}/></g>
    }
    case 'ring_single': case 'ring_filter': {
      const r=(p.radius||10)*4, gap=(p.gap||0.2)*20, wW=4
      return <g><circle cx={0} cy={-gap/2-r-wW/2} r={r} fill="none" stroke={LC.WG.fill} strokeWidth={wW}/><rect x={-r-25} y={-wW/2} width={r*2+50} height={wW} fill={LC.WG.fill}/><circle cx={0} cy={-gap/2-r-wW/2} r={r+4} fill="none" stroke={LC.HEATER.fill} strokeWidth={1.5} strokeDasharray="8 4" opacity={0.8}/><circle cx={-r-25} cy={0} r={2} fill="#fff" opacity={0.8}/><circle cx={r+25} cy={0} r={2} fill="#fff" opacity={0.8}/></g>
    }
    case 'grating_coupler': case 'grating_coupler_elliptical': {
      const nP=Math.min(20,p.n_periods||20), period=(p.period||0.63)*15
      const teeth = Array.from({length:nP},(_,i)=><rect key={i} x={i*period} y={-(25-i*0.3)} width={period*0.5} height={(25-i*0.3)*2} fill={LC.WG.fill} opacity={0.8-i*0.02} rx={0.5}/>)
      return <g><polygon points={`-40,-3 0,-25 0,25 -40,3`} fill={LC.WG.fill} stroke={LC.WG.stroke} strokeWidth="0.3"/><rect x={-60} y={-3} width={20} height={6} fill={LC.WG.fill}/>{teeth}<circle cx={-60} cy={0} r={2} fill="#fff" opacity={0.8}/></g>
    }
    case 'ge_pd': case 'ge_detector': {
      const gL=(p.ge_length||30)*2, gW=(p.ge_width||8)*3
      return <g><rect x={-gL/2-30} y={-3} width={30} height={6} fill={LC.WG.fill}/><rect x={-gL/2} y={-gW/2} width={gL} height={gW} fill={LC.GE.fill} stroke={LC.GE.stroke} strokeWidth="0.5" rx={2}/><rect x={-gL/4} y={-gW/2-4} width={gL/2} height={3} fill={LC.P.fill} opacity={0.7}/><rect x={-gL/4} y={gW/2+1} width={gL/2} height={3} fill={LC.N.fill} opacity={0.7}/><rect x={-gL/4-2} y={-gW/2-10} width={gL/2+4} height={5} fill={LC.M1.fill} opacity={0.6} rx={1}/><rect x={-gL/4-2} y={gW/2+5} width={gL/2+4} height={5} fill={LC.M1.fill} opacity={0.6} rx={1}/><circle cx={-gL/2-30} cy={0} r={2} fill="#fff" opacity={0.8}/></g>
    }
    case 'tfln_mzm': case 'tfln_iq': {
      const mL=Math.min(140,(p.length||20)*5), gap=(p.electrode_gap||5)*3
      return <g><rect x={-mL/2-10} y={-50} width={mL+20} height={100} fill={LC.LN.fill} opacity={0.2} rx={3}/><rect x={-mL/2} y={-gap/2-2} width={mL} height={3} fill={LC.LN.fill} stroke={LC.LN.stroke} strokeWidth="0.5"/><rect x={-mL/2} y={gap/2-1} width={mL} height={3} fill={LC.LN.fill} stroke={LC.LN.stroke} strokeWidth="0.5"/><rect x={-mL/2+5} y={-gap/2-12} width={mL-10} height={6} fill={LC.ELECTRODE.fill} stroke={LC.ELECTRODE.stroke} strokeWidth="0.3" rx={1}/><rect x={-mL/2+5} y={-3} width={mL-10} height={6} fill={LC.ELECTRODE.fill} stroke={LC.ELECTRODE.stroke} strokeWidth="0.5" rx={1}/><rect x={-mL/2+5} y={gap/2+6} width={mL-10} height={6} fill={LC.ELECTRODE.fill} stroke={LC.ELECTRODE.stroke} strokeWidth="0.3" rx={1}/><circle cx={-mL/2-10} cy={-gap/4} r={2} fill="#fff" opacity={0.8}/><circle cx={mL/2+10} cy={-gap/4} r={2} fill="#fff" opacity={0.8}/></g>
    }
    case 'directional_coupler': {
      const gap=(p.gap||0.2)*30, l=Math.min(100,(p.length||10)*6), wW=4
      return <g><rect x={-l/2-20} y={-gap/2-wW/2} width={l+40} height={wW} fill={LC.WG.fill}/><rect x={-l/2-20} y={gap/2-wW/2} width={l+40} height={wW} fill={LC.WG.fill}/><rect x={-l/2} y={-gap/2-wW/2} width={l} height={gap+wW} fill={LC.WG.fill} opacity={0.15} stroke={LC.WG.stroke} strokeWidth="0.3" strokeDasharray="3 2"/><circle cx={-l/2-20} cy={-gap/2} r={1.5} fill="#fff" opacity={0.8}/><circle cx={-l/2-20} cy={gap/2} r={1.5} fill="#fff" opacity={0.8}/><circle cx={l/2+20} cy={-gap/2} r={1.5} fill="#fff" opacity={0.8}/><circle cx={l/2+20} cy={gap/2} r={1.5} fill="#fff" opacity={0.8}/></g>
    }
    case 'spiral_delay': {
      const r=(p.radius||50)*0.6, n=Math.min(8,p.n_turns||6)
      const paths = Array.from({length:n},(_,i)=><circle key={i} cx={0} cy={0} r={r-i*4} fill="none" stroke={LC.WG.fill} strokeWidth={3} opacity={0.8-i*0.08}/>)
      return <g>{paths}<circle cx={-r} cy={0} r={2} fill="#fff" opacity={0.8}/><circle cx={r} cy={0} r={2} fill="#fff" opacity={0.8}/></g>
    }
    case 'edge_coupler': {
      const tL=(p.taper_length||300)*0.2, tipW=(p.tip_width||0.1)*30, endW=(p.end_width||0.5)*20
      return <g><polygon points={`${-tL/2},${-endW/2} ${tL/2},${-tipW/2} ${tL/2},${tipW/2} ${-tL/2},${endW/2}`} fill={LC.WG.fill} stroke={LC.WG.stroke} strokeWidth="0.5"/><rect x={-tL/2-20} y={-endW/2} width={20} height={endW} fill={LC.WG.fill}/><circle cx={-tL/2-20} cy={0} r={2} fill="#fff" opacity={0.8}/><circle cx={tL/2} cy={0} r={1} fill="#fff" opacity={0.8}/></g>
    }
    default:
      return <g><rect x={-40} y={-30} width={80} height={60} fill={LC.WG.fill} opacity={0.3} stroke={LC.WG.stroke} strokeWidth="1" strokeDasharray="4 2" rx={5}/><text x={0} y={5} textAnchor="middle" fontSize="8" fill="#999">{comp}</text></g>
  }
}
