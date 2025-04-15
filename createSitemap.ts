import fs from 'node:fs'
import path from 'node:path'
import { SitemapStream, streamToPromise } from 'sitemap'
import { prerender } from './react-router.config'
import 'dotenv/config'

// eslint-disable-next-line @typescript-eslint/no-shadow
const __dirname = path.dirname(new URL(import.meta.url).pathname)

// 배포 디렉토리가 dist 일때 동작한다.
const outputPath = path.join(__dirname, 'build/client', 'sitemap.xml')
// 호스트 이름을 바꿔준다.
const hostname = process.env.VITE_PROJECT_URL

async function generateSitemap() {
  const sitemapStream = new SitemapStream({ hostname })

  prerender.forEach((route) => {
    sitemapStream.write({
      url: route,
      changefreq: 'weekly',
      priority: 0.8
    })
  })
  sitemapStream.end()

  const sitemap = await streamToPromise(sitemapStream)

  fs.writeFileSync(outputPath, sitemap.toString())
  console.log(`${outputPath} generated!`)
}

generateSitemap()
