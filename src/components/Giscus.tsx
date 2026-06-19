import { useEffect, useRef } from 'react'

interface GiscusProps {
  term?: string
}

export default function Giscus({ term }: GiscusProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const existing = ref.current.querySelector('iframe.giscus-frame')
    if (existing) existing.remove()
    const existingScript = ref.current.querySelector('script')
    if (existingScript) existingScript.remove()

    const script = document.createElement('script')
    script.src = 'https://giscus.app/client.js'
    script.setAttribute('data-repo', 'mikegaomk/PhotonCloud')
    script.setAttribute('data-repo-id', 'R_kgDOS8JZUQ')
    script.setAttribute('data-category', 'General')
    script.setAttribute('data-category-id', 'DIC_kwDOS8JZUc4C_epl')
    script.setAttribute('data-mapping', term ? 'specific' : 'pathname')
    if (term) script.setAttribute('data-term', term)
    script.setAttribute('data-strict', '0')
    script.setAttribute('data-reactions-enabled', '1')
    script.setAttribute('data-emit-metadata', '0')
    script.setAttribute('data-input-position', 'top')
    script.setAttribute('data-theme', 'light')
    script.setAttribute('data-lang', 'zh-CN')
    script.setAttribute('data-loading', 'lazy')
    script.crossOrigin = 'anonymous'
    script.async = true

    ref.current.appendChild(script)
  }, [term])

  return (
    <div ref={ref} className="mt-8 border-t pt-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-700">💬 社区讨论</h3>
      <p className="text-sm text-gray-500 mb-4">登录 GitHub 即可参与讨论，评论会同步到 GitHub Discussions</p>
    </div>
  )
}
