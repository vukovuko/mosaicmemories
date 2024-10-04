import { Suspense } from "react"

import SideMenu from "@/components/side-menu"
import Link from "next/link"

export default function Nav() {

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <header className="relative h-16 mx-auto border-b duration-200 bg-white border-ui-border-base">
        <nav className="content-container txt-xsmall-plus text-ui-fg-subtle flex items-center justify-between w-full h-full text-small-regular">
          <div className="flex-1 basis-0 h-full flex items-center">
            <div className="h-full">
              <SideMenu />
            </div>
          </div>
          <div className="flex items-center h-full">
            <Link
              href="/"
              className="text-gray-600 hover:text-black font-semibold hover:font-bold uppercase text-base sm:text-lg md:text-[1.125rem]"
            >
              Mosaic Memories
            </Link>
          </div>
          <div className="flex items-center gap-x-6 h-full flex-1 basis-0 justify-end">
            <div className="hidden small:flex items-center gap-x-6 h-full">
              <Link
                className="hover:#e5e7eb"
                href="/o-nama"
              >
                O nama
              </Link>
            </div>
          </div>
        </nav>
      </header>
    </div>
  )
}